import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { prisma } from '@repo/database';

export const authRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

// Setup Nodemailer (Gmail SMTP)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// 1. Register User
authRouter.post('/register', async (req, res) => {
  try {
    const { email, password, name, address } = req.body;
    
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
       res.status(400).json({ error: 'Email is already registered' });
       return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        address
      }
    });

    res.json({ message: 'Registration successful', user: { id: newUser.id, email: newUser.email } });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to register account', details: error.message, stack: error.stack });
  }
});

// 2. Login User
authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
       res.status(401).json({ error: 'Invalid email or password' });
       return;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
       res.status(401).json({ error: 'Invalid email or password' });
       return;
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1d' });
    
    res.json({ message: 'Login successful', token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' });
  }
});

// 3. Forgot Password
authRouter.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
       res.json({ message: 'If that email is registered, a password reset link has been sent.' });
       return;
    }

    const resetToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    const expires = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: expires
      }
    });

    const resetLink = `http://localhost:3000/forgot-password/reset?token=${resetToken}`;
    
    await transporter.sendMail({
      from: `"My E-Commerce" <${process.env.SMTP_USER || 'noreply@ecommerce.com'}>`,
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>Hello,</p><p>Click the following link to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p><p>If you did not request a password reset, please ignore this email.</p>`,
    });

    res.json({ message: 'If that email is registered, a password reset link has been sent.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process forgot password request' });
  }
});
