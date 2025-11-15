import { Request, Response } from 'express';
import { prisma } from '..';

/**
 * Send a friend request
 * POST /friendship/request
 */
export const sendFriendRequest = async (req: Request, res: Response) => {
  const { addresseeId } = req.body;
  
  if (!req.user) return res.status(401).json({ message: "User not authenticated" });
  if (!addresseeId) return res.status(400).json({ message: "addresseeId is required" });
  
  const requesterId = req.user.id;
  
  if (requesterId === addresseeId) {
    return res.status(400).json({ message: "Cannot send friend request to yourself" });
  }
  
  try {
    // Check if addressee exists
    const addressee = await prisma.user.findUnique({ where: { id: addresseeId } });
    if (!addressee) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Check if friendship already exists (either direction)
    const existingFriendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId, addresseeId },
          { requesterId: addresseeId, addresseeId: requesterId }
        ]
      }
    });
    
    if (existingFriendship) {
      if (existingFriendship.status === 'ACCEPTED') {
        return res.status(400).json({ message: "Already friends" });
      } else if (existingFriendship.status === 'PENDING') {
        return res.status(400).json({ message: "Friend request already sent" });
      } else if (existingFriendship.status === 'BLOCKED') {
        return res.status(400).json({ message: "Cannot send friend request" });
      }
    }
    
    // Create friend request
    const friendship = await prisma.friendship.create({
      data: {
        requesterId,
        addresseeId,
        status: 'PENDING'
      },
      include: {
        requester: {
          select: { id: true, name: true, email: true, avatar: true }
        },
        addressee: {
          select: { id: true, name: true, email: true, avatar: true }
        }
      }
    });
    
    res.status(201).json({ message: "Friend request sent", friendship });
  } catch (error) {
    console.error("Error sending friend request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Accept friend request
 * PUT /friendship/accept/:id
 */
export const acceptFriendRequest = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  if (!req.user) return res.status(401).json({ message: "User not authenticated" });
  
  try {
    const friendship = await prisma.friendship.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!friendship) {
      return res.status(404).json({ message: "Friend request not found" });
    }
    
    if (friendship.addresseeId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to accept this request" });
    }
    
    if (friendship.status !== 'PENDING') {
      return res.status(400).json({ message: "Friend request is not pending" });
    }
    
    const updatedFriendship = await prisma.friendship.update({
      where: { id: parseInt(id) },
      data: { status: 'ACCEPTED' },
      include: {
        requester: {
          select: { id: true, name: true, email: true, avatar: true }
        },
        addressee: {
          select: { id: true, name: true, email: true, avatar: true }
        }
      }
    });
    
    res.status(200).json({ message: "Friend request accepted", friendship: updatedFriendship });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Reject/decline friend request
 * DELETE /friendship/reject/:id
 */
export const rejectFriendRequest = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  if (!req.user) return res.status(401).json({ message: "User not authenticated" });
  
  try {
    const friendship = await prisma.friendship.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!friendship) {
      return res.status(404).json({ message: "Friend request not found" });
    }
    
    if (friendship.addresseeId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to reject this request" });
    }
    
    await prisma.friendship.delete({
      where: { id: parseInt(id) }
    });
    
    res.status(200).json({ message: "Friend request rejected" });
  } catch (error) {
    console.error("Error rejecting friend request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get pending friend requests
 * GET /friendship/requests
 */
export const getPendingRequests = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "User not authenticated" });
  
  try {
    const requests = await prisma.friendship.findMany({
      where: {
        addresseeId: req.user.id,
        status: 'PENDING'
      },
      include: {
        requester: {
          select: { id: true, name: true, email: true, avatar: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.status(200).json({ requests });
  } catch (error) {
    console.error("Error getting pending requests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get list of friends
 * GET /friendship/friends
 */
export const getFriends = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "User not authenticated" });
  
  try {
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { requesterId: req.user.id, status: 'ACCEPTED' },
          { addresseeId: req.user.id, status: 'ACCEPTED' }
        ]
      },
      include: {
        requester: {
          select: { id: true, name: true, email: true, avatar: true }
        },
        addressee: {
          select: { id: true, name: true, email: true, avatar: true }
        }
      }
    });
    
    // Map to return the friend (not the current user)
    const friends = friendships.map(friendship => {
      const friend = friendship.requesterId === req.user!.id 
        ? friendship.addressee 
        : friendship.requester;
      return {
        friendshipId: friendship.id,
        ...friend,
        friendsSince: friendship.updatedAt
      };
    });
    
    res.status(200).json({ friends });
  } catch (error) {
    console.error("Error getting friends:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Remove friend
 * DELETE /friendship/remove/:friendshipId
 */
export const removeFriend = async (req: Request, res: Response) => {
  const { friendshipId } = req.params;
  
  if (!req.user) return res.status(401).json({ message: "User not authenticated" });
  
  try {
    const friendship = await prisma.friendship.findUnique({
      where: { id: parseInt(friendshipId) }
    });
    
    if (!friendship) {
      return res.status(404).json({ message: "Friendship not found" });
    }
    
    if (friendship.requesterId !== req.user.id && friendship.addresseeId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    await prisma.friendship.delete({
      where: { id: parseInt(friendshipId) }
    });
    
    res.status(200).json({ message: "Friend removed" });
  } catch (error) {
    console.error("Error removing friend:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Search users (to add as friends)
 * GET /friendship/search?query=name
 */
export const searchUsers = async (req: Request, res: Response) => {
  const { query } = req.query;
  
  if (!req.user) return res.status(401).json({ message: "User not authenticated" });
  if (!query) return res.status(400).json({ message: "query is required" });
  
  try {
    const users = await prisma.user.findMany({
      where: {
        AND: [
          { id: { not: req.user.id } }, // Exclude current user
          {
            OR: [
              { name: { contains: String(query) } },
              { email: { contains: String(query) } }
            ]
          }
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true
      },
      take: 20
    });
    
    // Check friendship status for each user
    const userIds = users.map(u => u.id);
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { requesterId: req.user.id, addresseeId: { in: userIds } },
          { requesterId: { in: userIds }, addresseeId: req.user.id }
        ]
      }
    });
    
    const usersWithStatus = users.map(user => {
      const friendship = friendships.find(f => 
        (f.requesterId === req.user!.id && f.addresseeId === user.id) ||
        (f.addresseeId === req.user!.id && f.requesterId === user.id)
      );
      
      return {
        ...user,
        friendshipStatus: friendship?.status || null,
        friendshipId: friendship?.id || null
      };
    });
    
    res.status(200).json({ users: usersWithStatus });
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
