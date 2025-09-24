import { Request, Response } from "express";
import {prisma} from "..";

// GET all logs
export const getLogs = async (req: Request, res: Response) => {
  try {
    const logs = await prisma.log.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch logs" });
  }
};
