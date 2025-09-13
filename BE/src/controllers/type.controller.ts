import { Request, Response } from 'express';
import { prisma } from "..";
import { messaging } from 'firebase-admin';

export const getAllTypes = async (req: Request, res: Response) => {
    try {
        const types = await prisma.category.findMany();
        res.status(200).json(types);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const createType = async (req: Request, res: Response) => {
    try {
        const type = await prisma.category.create({
            data: {
                ...req.body
            }
        });
        res.status(201).json({ message: "Type created successfully!", type});
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getTypeById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const type = await prisma.category.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        res.status(200).json(type);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateType = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const type = await prisma.category.update({
            where: {
                id: parseInt(id)
            },
            data: {
                ...req.body
            }
        });
        res.status(200).json({ message: "Type updated successfully", type });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteType = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deleteType = await prisma.category.delete({
            where: {
                id: parseInt(id)
            }
        });
        res.status(200).json({ message: "Type deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}