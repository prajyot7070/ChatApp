
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


//Signin endpoint
export const login = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      res.status(400).json({ msg: "Please provide all required fields." });
      return;
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ msg: "Invalid credentials." });
      return;
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ msg: "Invalid credentials." });
      return;
    }

    // Create and send JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error in login controller", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Logout controller
// Note: Client-side handling is more important for JWT logout
export const logout = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    // With JWTs, the actual logout happens on the client side
    // by removing the token from storage
    res.json({ msg: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout controller", error);
    res.status(500).json({ msg: "Server error" });
  }
};
