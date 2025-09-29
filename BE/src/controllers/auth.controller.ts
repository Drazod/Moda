

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
            // If user exists and is disabled (add your state field, e.g. isActive or isVerified)
            if (user.isVerified === false) { // or use your own state field
                // Reactivate account
                const otp = Math.floor(100000 + Math.random() * 900000).toString();
                const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        name,
                        password: hashSync(password, 10),
                        phone,
                        address: address || "N/A",
                        otpCode: otp,
                        otpExpiry: otpExpiry,
                        isVerified: false // or your own state field
                    }
                });
                const { sendOtpEmail } = await import('../utils/email');
                await sendOtpEmail(email, otp);
                return res.status(200).json({ message: "Account reactivated. Please check your email for the OTP code." });
            }
            // If user is active, block registration
            return res.status(400).json({ message: "User already exists" });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashSync(password, 10),
                phone,
                address: address || "N/A",
                otpCode: otp,
                otpExpiry: otpExpiry,
                isVerified: false // or your own state field
            },
        });

        // Send OTP email
        const { sendOtpEmail } = await import('../utils/email');
        await sendOtpEmail(email, otp);

        res.status(201).json({ message: "User registered. Please check your email for the OTP code." });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}
// OTP verification endpoint
export const verifyOtp = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        if (user.isVerified) {
            return res.status(400).json({ message: "User already verified" });
        }
        if (!user.otpCode || !user.otpExpiry) {
            return res.status(400).json({ message: "No OTP found. Please register again." });
        }
        if (user.otpCode !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        if (user.otpExpiry < new Date()) {
            return res.status(400).json({ message: "OTP expired" });
        }
        const updatedUser = await prisma.user.update({
            where: { email },
            data: {
                isVerified: true,
                otpCode: null,
                otpExpiry: null
            }
        });

        // Generate JWT token after successful verification
        if (!JWT_SECRET) {
            return res.status(500).json({ message: "JWT secret is not defined" });
        }
        const token = jwt.sign(
            {
                id: updatedUser.id,
                email: updatedUser.email,
            },
            JWT_SECRET,
            { expiresIn: "1h" }
        );
    return res.status(200).json({ user: updatedUser, token });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
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
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        const { oldPassword, newPassword } = req.body;
        // Enforce strong password: at least 8 chars, 1 uppercase, 1 lowercase, 1 number
        const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
        if (!strongPassword.test(newPassword)) {
            return res.status(400).json({ message: "New password must be at least 8 characters, include uppercase, lowercase, and a number." });
        }
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id
            }
        });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        if (!compareSync(oldPassword, user.password)) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }

        // Store original password for rollback
        const originalPassword = user.password;
        
        // Generate rollback token (valid for 24 hours)
        const rollbackToken = require('crypto').randomBytes(32).toString('hex');
        const tokenExpiry = new Date();
        tokenExpiry.setHours(tokenExpiry.getHours() + 24);
        
        // Update password in database
        const updatedUser = await prisma.user.update({
            where: {
                id: req.user.id
            },
            data: {
                password: hashSync(newPassword, 10)
            }
        });
        console.log('Password updated in database for user ID:', req.user.id);
        // Store password history for rollback
        await prisma.passwordHistory.create({
            data: {
                userId: req.user.id,
                previousPassword: originalPassword,
                rollbackToken: rollbackToken,
                tokenExpiry: tokenExpiry
            }
        });
        console.log('Password history stored for user ID:', req.user.id);
        // Try to send email notification
        try {
            const { sendPasswordChangeNotification } = require('../utils/email');
            await sendPasswordChangeNotification(user.email, user.name, rollbackToken);
        } catch (emailError) {
            console.error('Failed to send password change email:', emailError);
            // Rollback password change if email fails
            await prisma.user.update({
                where: {
                    id: req.user.id
                },
                data: {
                    password: originalPassword
                }
            });
            // Clean up password history
            await prisma.passwordHistory.deleteMany({
                where: {
                    rollbackToken: rollbackToken
                }
            });
            return res.status(500).json({ 
                message: "Password change failed due to email notification error. Please try again." 
            });
        }

        res.status(200).json({ message: "Password changed successfully. Confirmation email sent." });
    } catch (error) {
        console.error('Password change error:', error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const rollbackPassword = async (req: Request, res: Response) => {
    try {
        const { token } = req.query;
        
        if (!token) {
            return res.status(400).json({ message: "Rollback token is required" });
        }

        // Find the password history entry
        const passwordHistory = await prisma.passwordHistory.findUnique({
            where: {
                rollbackToken: token as string
            },
            include: {
                user: true
            }
        });

        if (!passwordHistory) {
            return res.status(400).json({ message: "Invalid rollback token" });
        }

        // Check if token has expired
        if (new Date() > passwordHistory.tokenExpiry) {
            return res.status(400).json({ message: "Rollback token has expired" });
        }

        // Check if token has already been used
        if (passwordHistory.isUsed) {
            return res.status(400).json({ message: "Rollback token has already been used" });
        }

        // Restore previous password
        await prisma.user.update({
            where: {
                id: passwordHistory.userId
            },
            data: {
                password: passwordHistory.previousPassword
            }
        });

        // Mark token as used
        await prisma.passwordHistory.update({
            where: {
                rollbackToken: token as string
            },
            data: {
                isUsed: true
            }
        });

        res.status(200).json({ 
            message: "Password has been successfully restored to your previous password. Please log in with your old password." 
        });
    } catch (error) {
        console.error('Password rollback error:', error);
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
