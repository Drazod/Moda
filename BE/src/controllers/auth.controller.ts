import { NextFunction, Request, Response } from "express";
import { prisma } from "..";
import jwt from "jsonwebtoken";
import { hashSync, compareSync } from "bcryptjs";
import { JWT_SECRET } from "../configs";

export const Register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, name, phone, address } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        let user = await prisma.user.findFirst({
            where: {
                email: email,
            },
        });

        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashSync(password, 10),
                phone,
                address
            },
        });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    let user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.status(400).json({ message: "Email not found" });
    }
    if (!compareSync(password, user.password)) {
      return res.status(400).json({ message: "Password is incorrect" });
    }
    
    if (!JWT_SECRET) {
      return res.status(500).json({ message: "JWT secret is not defined" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const changePassword = async (req: Request, res: Response) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        if (!compareSync(oldPassword, user.password)) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }
        await prisma.user.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                password: hashSync(newPassword, 10)
            }
        });
        res.status(200).json({ message: "Password changed" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const changeIdentity = async (req: Request, res: Response) => {
    try {
        const { name, phone, address } = req.body;
        const user = await prisma.user.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                name,
                phone,
                address
            }
        });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

// me -> return the logged in user
export const someFunction = (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }
  res.json(req.user);
};
