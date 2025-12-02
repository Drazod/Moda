import { Request, Response } from 'express';
import { prisma } from '..';
import { io } from '../index';
import { uploadToFirebase } from '../services/upload.services';

/**
 * Create a new post
 * POST /posts
 * Body: { caption?: string, location?: string }
 * Files: images[] (up to 10 images)
 */
export const createPost = async (req: Request, res: Response) => {
  const { caption, location } = req.body;
  
  if (!req.user) return res.status(401).json({ message: "User not authenticated" });
  
  const files = req.files as { images?: Express.Multer.File[] };
  
  if (!files || !files.images || files.images.length === 0) {
    return res.status(400).json({ message: "At least one image is required" });
  }

  if (files.images.length > 10) {
    return res.status(400).json({ message: "Maximum 10 images allowed per post" });
  }
  
  try {
    // Upload all images to Firebase
    const uploadedImages = await Promise.all(
      files.images.map(async (file, index) => {
        const imageName = Date.now() + "_" + index + "_" + file.originalname;
        const imageUrl = await uploadToFirebase({ ...file, originalname: imageName });
        return { imageUrl, order: index };
      })
    );

    const post = await prisma.post.create({
      data: {
        userId: req.user.id,
        caption: caption || null,
        location: location || null,
        images: {
          create: uploadedImages
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: {
              select: { id: true, name: true, url: true }
            }
          }
        },
        images: {
          orderBy: { order: 'asc' }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    });

    // Emit socket event to all friends
    const friends = await prisma.friendship.findMany({
      where: {
        OR: [
          { requesterId: req.user.id, status: 'ACCEPTED' },
          { addresseeId: req.user.id, status: 'ACCEPTED' }
        ]
      },
      select: {
        requesterId: true,
        addresseeId: true
      }
    });

    // Notify friends about new post
    friends.forEach(friendship => {
      const friendId = friendship.requesterId === req.user!.id 
        ? friendship.addresseeId 
        : friendship.requesterId;
      
      io.to(String(friendId)).emit('new-post', {
        post,
        message: `${req.user!.name} created a new post`
      });
    });

    return res.status(201).json({
      message: "Post created successfully",
      post
    });
  } catch (error: any) {
    console.error('❌ Create post error:', error);
    return res.status(500).json({
      error: 'Failed to create post',
      details: error.message
    });
  }
};

/**
 * Get feed posts (from friends and own posts)
 * GET /posts/feed?page=1&limit=20
 */
export const getFeedPosts = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "User not authenticated" });
  
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  try {
    // Get list of friend IDs
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { requesterId: req.user.id, status: 'ACCEPTED' },
          { addresseeId: req.user.id, status: 'ACCEPTED' }
        ]
      },
      select: {
        requesterId: true,
        addresseeId: true
      }
    });

    const friendIds = friendships.map(f => 
      f.requesterId === req.user!.id ? f.addresseeId : f.requesterId
    );

    // Include own posts and friends' posts
    const userIds = [req.user.id, ...friendIds];

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: {
          userId: { in: userIds }
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: {
                select: { id: true, name: true, url: true }
              }
            }
          },
          images: {
            orderBy: { order: 'asc' }
          },
          likes: {
            where: { userId: req.user!.id },
            select: { id: true }
          },
          _count: {
            select: {
              likes: true,
              comments: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.post.count({
        where: {
          userId: { in: userIds }
        }
      })
    ]);

    // Add isLiked flag
    const postsWithLikeStatus = posts.map(post => ({
      ...post,
      isLiked: post.likes.length > 0,
      likes: undefined // Remove the likes array, just use _count
    }));

    return res.status(200).json({
      posts: postsWithLikeStatus,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('❌ Get feed posts error:', error);
    return res.status(500).json({
      error: 'Failed to get feed posts',
      details: error.message
    });
  }
};

/**
 * Get posts by user ID
 * GET /posts/user/:userId?page=1&limit=20
 */
export const getUserPosts = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  try {
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: {
          userId: parseInt(userId)
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: {
                select: { id: true, name: true, url: true }
              }
            }
          },
          images: {
            orderBy: { order: 'asc' }
          },
          likes: req.user ? {
            where: { userId: req.user.id },
            select: { id: true }
          } : false,
          _count: {
            select: {
              likes: true,
              comments: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.post.count({
        where: {
          userId: parseInt(userId)
        }
      })
    ]);

    const postsWithLikeStatus = posts.map(post => ({
      ...post,
      isLiked: req.user ? (post.likes as any[]).length > 0 : false,
      likes: undefined
    }));

    return res.status(200).json({
      posts: postsWithLikeStatus,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('❌ Get user posts error:', error);
    return res.status(500).json({
      error: 'Failed to get user posts',
      details: error.message
    });
  }
};

/**
 * Get single post by ID
 * GET /posts/:postId
 */
export const getPost = async (req: Request, res: Response) => {
  const { postId } = req.params;
  
  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(postId) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: {
              select: { id: true, name: true, url: true }
            }
          }
        },
        images: {
          orderBy: { order: 'asc' }
        },
        likes: req.user ? {
          where: { userId: req.user.id },
          select: { id: true }
        } : false,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: {
                  select: { id: true, name: true, url: true }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 50
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const postWithLikeStatus = {
      ...post,
      isLiked: req.user ? (post.likes as any[]).length > 0 : false,
      likes: undefined
    };

    return res.status(200).json({ post: postWithLikeStatus });
  } catch (error: any) {
    console.error('❌ Get post error:', error);
    return res.status(500).json({
      error: 'Failed to get post',
      details: error.message
    });
  }
};

/**
 * Delete a post
 * DELETE /posts/:postId
 */
export const deletePost = async (req: Request, res: Response) => {
  const { postId } = req.params;
  
  if (!req.user) return res.status(401).json({ message: "User not authenticated" });
  
  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(postId) }
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: "You can only delete your own posts" });
    }

    await prisma.post.delete({
      where: { id: parseInt(postId) }
    });

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error: any) {
    console.error('❌ Delete post error:', error);
    return res.status(500).json({
      error: 'Failed to delete post',
      details: error.message
    });
  }
};

/**
 * Like a post
 * POST /posts/:postId/like
 */
export const likePost = async (req: Request, res: Response) => {
  const { postId } = req.params;
  
  if (!req.user) return res.status(401).json({ message: "User not authenticated" });
  
  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(postId) },
      select: { id: true, userId: true }
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if already liked
    const existingLike = await prisma.postLike.findUnique({
      where: {
        postId_userId: {
          postId: parseInt(postId),
          userId: req.user.id
        }
      }
    });

    if (existingLike) {
      return res.status(400).json({ message: "Post already liked" });
    }

    const like = await prisma.postLike.create({
      data: {
        postId: parseInt(postId),
        userId: req.user.id
      }
    });

    // Get updated like count
    const likeCount = await prisma.postLike.count({
      where: { postId: parseInt(postId) }
    });

    // Emit socket event to post owner (if not self-like)
    if (post.userId !== req.user.id) {
      io.to(String(post.userId)).emit('post-liked', {
        postId: post.id,
        likedBy: {
          id: req.user.id,
          name: req.user.name
        },
        likeCount
      });
    }

    return res.status(200).json({
      message: "Post liked successfully",
      likeCount
    });
  } catch (error: any) {
    console.error('❌ Like post error:', error);
    return res.status(500).json({
      error: 'Failed to like post',
      details: error.message
    });
  }
};

/**
 * Unlike a post
 * DELETE /posts/:postId/like
 */
export const unlikePost = async (req: Request, res: Response) => {
  const { postId } = req.params;
  
  if (!req.user) return res.status(401).json({ message: "User not authenticated" });
  
  try {
    const like = await prisma.postLike.findUnique({
      where: {
        postId_userId: {
          postId: parseInt(postId),
          userId: req.user.id
        }
      }
    });

    if (!like) {
      return res.status(400).json({ message: "Post not liked yet" });
    }

    await prisma.postLike.delete({
      where: {
        postId_userId: {
          postId: parseInt(postId),
          userId: req.user.id
        }
      }
    });

    const likeCount = await prisma.postLike.count({
      where: { postId: parseInt(postId) }
    });

    return res.status(200).json({
      message: "Post unliked successfully",
      likeCount
    });
  } catch (error: any) {
    console.error('❌ Unlike post error:', error);
    return res.status(500).json({
      error: 'Failed to unlike post',
      details: error.message
    });
  }
};

/**
 * Get post likes
 * GET /posts/:postId/likes?page=1&limit=50
 */
export const getPostLikes = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;
  const skip = (page - 1) * limit;

  try {
    const [likes, total] = await Promise.all([
      prisma.postLike.findMany({
        where: { postId: parseInt(postId) },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: {
                select: { id: true, name: true, url: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.postLike.count({
        where: { postId: parseInt(postId) }
      })
    ]);

    return res.status(200).json({
      likes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('❌ Get post likes error:', error);
    return res.status(500).json({
      error: 'Failed to get post likes',
      details: error.message
    });
  }
};

/**
 * Add a comment to a post
 * POST /posts/:postId/comments
 * Body: { content: string }
 */
export const addComment = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { content } = req.body;
  
  if (!req.user) return res.status(401).json({ message: "User not authenticated" });
  
  if (!content || content.trim().length === 0) {
    return res.status(400).json({ message: "Comment content is required" });
  }

  if (content.length > 2000) {
    return res.status(400).json({ message: "Comment is too long (max 2000 characters)" });
  }
  
  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(postId) },
      select: { id: true, userId: true }
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = await prisma.postComment.create({
      data: {
        postId: parseInt(postId),
        userId: req.user.id,
        content: content.trim()
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: {
              select: { id: true, name: true, url: true }
            }
          }
        }
      }
    });

    const commentCount = await prisma.postComment.count({
      where: { postId: parseInt(postId) }
    });

    // Emit socket event to post owner (if not self-comment)
    if (post.userId !== req.user.id) {
      io.to(String(post.userId)).emit('post-commented', {
        postId: post.id,
        comment,
        commentCount
      });
    }

    return res.status(201).json({
      message: "Comment added successfully",
      comment,
      commentCount
    });
  } catch (error: any) {
    console.error('❌ Add comment error:', error);
    return res.status(500).json({
      error: 'Failed to add comment',
      details: error.message
    });
  }
};

/**
 * Get post comments
 * GET /posts/:postId/comments?page=1&limit=50
 */
export const getPostComments = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;
  const skip = (page - 1) * limit;

  try {
    const [comments, total] = await Promise.all([
      prisma.postComment.findMany({
        where: { postId: parseInt(postId) },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: {
                select: { id: true, name: true, url: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.postComment.count({
        where: { postId: parseInt(postId) }
      })
    ]);

    return res.status(200).json({
      comments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('❌ Get comments error:', error);
    return res.status(500).json({
      error: 'Failed to get comments',
      details: error.message
    });
  }
};

/**
 * Delete a comment
 * DELETE /posts/:postId/comments/:commentId
 */
export const deleteComment = async (req: Request, res: Response) => {
  const { postId, commentId } = req.params;
  
  if (!req.user) return res.status(401).json({ message: "User not authenticated" });
  
  try {
    const comment = await prisma.postComment.findUnique({
      where: { id: parseInt(commentId) },
      include: { post: true }
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.postId !== parseInt(postId)) {
      return res.status(400).json({ message: "Comment does not belong to this post" });
    }

    // Can delete if: own comment, own post, or admin
    if (
      comment.userId !== req.user.id && 
      comment.post.userId !== req.user.id && 
      req.user.role !== 'ADMIN'
    ) {
      return res.status(403).json({ 
        message: "You can only delete your own comments or comments on your posts" 
      });
    }

    await prisma.postComment.delete({
      where: { id: parseInt(commentId) }
    });

    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error: any) {
    console.error('❌ Delete comment error:', error);
    return res.status(500).json({
      error: 'Failed to delete comment',
      details: error.message
    });
  }
};
