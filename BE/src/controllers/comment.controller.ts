import { Request, Response } from 'express';
import { prisma } from '..';

// Submit comment/review for a specific transaction detail item
export const submitComment = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { transactionDetailId, content, rating } = req.body;

    if (!transactionDetailId || !content || !rating) {
      return res.status(400).json({ message: 'Transaction detail ID, content, and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Get the transaction detail and verify ownership
    const transactionDetail = await prisma.transactionDetail.findFirst({
      where: {
        id: transactionDetailId,
        transaction: {
          userId: req.user.id
        }
      },
      include: {
        transaction: {
          include: {
            shipping: true
          }
        },
        clothes: true,
        size: true,
        comments: {
          where: {
            userId: req.user.id
          }
        }
      }
    });

    if (!transactionDetail) {
      return res.status(404).json({ message: 'Transaction detail not found or not owned by user' });
    }

    // Check if order is completed (can only comment on completed orders)
    const shipping = transactionDetail.transaction.shipping[0];
    if (!shipping || shipping.State !== 'COMPLETE') {
      return res.status(400).json({ message: 'Can only review items from completed orders' });
    }

    // Check if user has already commented on this item
    if (transactionDetail.comments.length > 0) {
      return res.status(400).json({ message: 'You have already reviewed this item' });
    }

    // Create the comment
    const comment = await prisma.comment.create({
      data: {
        userId: req.user.id,
        transactionDetailId: transactionDetailId,
        content: content.trim(),
        rating: rating,
        isVerifiedPurchase: true
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        transactionDetail: {
          include: {
            clothes: {
              select: {
                id: true,
                name: true
              }
            },
            size: {
              select: {
                id: true,
                label: true
              }
            }
          }
        }
      }
    });

    res.status(201).json({
      message: 'Comment submitted successfully',
      comment: comment
    });

  } catch (error) {
    console.error('Error submitting comment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get comments for a specific product (public endpoint)
export const getProductComments = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Get comments for the product through transaction details
    const comments = await prisma.comment.findMany({
      where: {
        transactionDetail: {
          clothesId: parseInt(productId)
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        transactionDetail: {
          include: {
            size: {
              select: {
                id: true,
                label: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: skip,
      take: limit
    });

    // Get total count for pagination
    const totalComments = await prisma.comment.count({
      where: {
        transactionDetail: {
          clothesId: parseInt(productId)
        }
      }
    });

    // Calculate average rating
    const ratingStats = await prisma.comment.aggregate({
      where: {
        transactionDetail: {
          clothesId: parseInt(productId)
        }
      },
      _avg: {
        rating: true
      },
      _count: {
        rating: true
      }
    });

    res.status(200).json({
      message: 'Comments retrieved successfully',
      comments: comments,
      pagination: {
        page: page,
        limit: limit,
        total: totalComments,
        totalPages: Math.ceil(totalComments / limit)
      },
      ratingStats: {
        averageRating: ratingStats._avg.rating ? parseFloat(ratingStats._avg.rating.toFixed(1)) : 0,
        totalReviews: ratingStats._count.rating
      }
    });

  } catch (error) {
    console.error('Error getting product comments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user's own comments
export const getUserComments = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const comments = await prisma.comment.findMany({
      where: {
        userId: req.user.id
      },
      include: {
        transactionDetail: {
          include: {
            clothes: {
              select: {
                id: true,
                name: true,
                mainImg: true
              }
            },
            size: {
              select: {
                id: true,
                label: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: skip,
      take: limit
    });

    const totalComments = await prisma.comment.count({
      where: {
        userId: req.user.id
      }
    });

    res.status(200).json({
      message: 'User comments retrieved successfully',
      comments: comments,
      pagination: {
        page: page,
        limit: limit,
        total: totalComments,
        totalPages: Math.ceil(totalComments / limit)
      }
    });

  } catch (error) {
    console.error('Error getting user comments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update user's comment
export const updateComment = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { commentId } = req.params;
    const { content, rating } = req.body;

    if (!content || !rating) {
      return res.status(400).json({ message: 'Content and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Verify ownership of comment
    const existingComment = await prisma.comment.findFirst({
      where: {
        id: parseInt(commentId),
        userId: req.user.id
      }
    });

    if (!existingComment) {
      return res.status(404).json({ message: 'Comment not found or not owned by user' });
    }

    // Update the comment
    const updatedComment = await prisma.comment.update({
      where: {
        id: parseInt(commentId)
      },
      data: {
        content: content.trim(),
        rating: rating
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        transactionDetail: {
          include: {
            clothes: {
              select: {
                id: true,
                name: true
              }
            },
            size: {
              select: {
                id: true,
                label: true
              }
            }
          }
        }
      }
    });

    res.status(200).json({
      message: 'Comment updated successfully',
      comment: updatedComment
    });

  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete user's comment
export const deleteComment = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { commentId } = req.params;

    // Verify ownership of comment
    const existingComment = await prisma.comment.findFirst({
      where: {
        id: parseInt(commentId),
        userId: req.user.id
      }
    });

    if (!existingComment) {
      return res.status(404).json({ message: 'Comment not found or not owned by user' });
    }

    // Delete the comment
    await prisma.comment.delete({
      where: {
        id: parseInt(commentId)
      }
    });

    res.status(200).json({
      message: 'Comment deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get items that user can comment on (purchased but not yet reviewed)
export const getCommentableItems = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Get all transaction details for completed orders where user hasn't commented yet
    const commentableItems = await prisma.transactionDetail.findMany({
      where: {
        transaction: {
          userId: req.user.id,
          shipping: {
            some: {
              State: 'COMPLETE'
            }
          }
        },
        comments: {
          none: {
            userId: req.user.id
          }
        }
      },
      include: {
        clothes: {
          select: {
            id: true,
            name: true,
            mainImg: {
              select: {
                url: true
              }
            }
          }
        },
        size: {
          select: {
            id: true,
            label: true
          }
        },
        transaction: {
          select: {
            id: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        transaction: {
          createdAt: 'desc'
        }
      }
    });

    const formattedItems = commentableItems.map(item => ({
      transactionDetailId: item.id,
      clothesId: item.clothes.id,
      clothesName: item.clothes.name,
      clothesImage: item.clothes.mainImg?.url || null,
      size: item.size.label,
      quantity: item.quantity,
      price: item.price,
      purchaseDate: item.transaction.createdAt,
      orderId: `#${item.transaction.id}`
    }));

    res.status(200).json({
      message: 'Commentable items retrieved successfully',
      items: formattedItems
    });

  } catch (error) {
    console.error('Error fetching commentable items:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};