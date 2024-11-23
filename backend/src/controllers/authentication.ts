
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../../models/user_model';

export const register = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  const { email, fullName, password } = req.body;
  try {
    if (!email || !fullName || !password) {
      res.sendStatus(400);
      return;
    }

    if (password.length < 8) {
      res.status(400).json({ msg: "Password should be at least 8 characters." });
      return;
    }

    const user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ msg: "Email already exists." });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      fullName,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET || "secret", {
      expiresIn: "1h",
    });

    res.status(201).json({
      token,
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Error in signup controller", error);
    res.status(500).json({ msg: "Server error" });
  }
};

