import { Request, Response } from 'express';
import { prisma } from '..';

export const branchCreate = async (req: Request, res: Response) => {
    const { code, name, address, phone, hours} = req.body;
    try {
        const branch = await prisma.branch.create({
        data: { code, name, address, phone, hours, isActive: true },
        });
        res.status(201).json({ message: "Branch created", branch });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Admin: Update branch
export const updateBranch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { code, name, address, phone, hours, isActive } = req.body;
    const branch = await prisma.branch.update({
      where: { id: parseInt(id) },
      data: { code, name, address, phone, hours, isActive },
    });
    res.status(200).json({ message: "Branch updated", branch });
  } catch (error) {
    res.status(500).json({ message: "Error updating branch", error });
  }
};

// Admin: Delete branch
export const deleteBranch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.branch.delete({ where: { id: parseInt(id) } });
    res.status(200).json({ message: "Branch deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting branch", error });
  }
};

// Admin: Get all branches (no user filter)
export const getAllBranchesForAdmin = async (req: Request, res: Response) => {
  try {
    const branches = await prisma.branch.findMany();
    res.status(200).json({ branches });
  } catch (error) {
    res.status(500).json({ message: "Error fetching branches", error });
  }
};

// Admin: Get all branches ( branchCode and Name only)
export const getAllBranches = async (req: Request, res: Response) => {
  try {
    const branches = await prisma.branch.findMany({
      select: {
        code: true,
        name: true
      }
    });
    res.status(200).json({ branches });
  } catch (error) {
    res.status(500).json({ message: "Error fetching branches", error });
  }
};
