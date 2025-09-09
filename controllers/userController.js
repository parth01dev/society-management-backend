import User from "../models/User.js";
import { hash, compare } from "bcryptjs";
import jwt from 'jsonwebtoken';

const { sign } = jwt;

export async function register(req, res) {
  const {
    firstName,
    lastName,
    email,
    password,
    role,
    phone,
    countryCode, // optional
  } = req.body;

  try {
    if (email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ error: "Email is already registered" });
      }
    }

    if (phone) {
      const phoneExists = await User.findOne({ phone });
      if (phoneExists) {
        return res
          .status(400)
          .json({ error: "Phone number is already registered" });
      }
    }

    const hashed = await hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashed,
      phone,
      role,
      countryCode,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function login(req, res) {
  const { identifier, password } = req.body; // identifier can be email or phone

  try {
    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid password" });

    const token = sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.json({ token, user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
// exports.login = async (req, res) => {
//   const { identifier, password } = req.body; // identifier can be email or phone

//   try {
//     const user = await User.findOne({
//       $or: [{ email: identifier }, { phone: identifier }],
//     });

//     if (!user) return res.status(404).json({ error: 'User not found' });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(401).json({ error: 'Invalid password' });

//     const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
//       expiresIn: '7d',
//     });

//     const userWithoutPassword = user.toObject();
//     delete userWithoutPassword.password;

//     // Add token to user object
//     userWithoutPassword.token = token;

//     res.json({ user: userWithoutPassword });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

export async function updateProfile(req, res) {
  const userId = req.user.id;
  const updateData = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function changePassword(req, res) {
  const userId = req.params.id;
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "Current password is incorrect" });

    const hashed = await hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getUsers(req, res) {
  try {
    const filters = {};

    if (req.query.role) filters.role = req.query.role;
    if (req.query.hasPet !== undefined)
      filters.hasPet = req.query.hasPet === "true";
    if (req.query.bloodGroup) filters.bloodGroup = req.query.bloodGroup;

    // Add more filters as needed...

    const users = await User.find(filters).select("-password"); // exclude password
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateUser(req, res) {
  try {
    const { email, phone } = req.body;
    const userId = req.params.id;

    // Check if email is changing and if it is unique
    if (email) {
      const emailExists = await User.findOne({ email, _id: { $ne: userId } });
      if (emailExists) {
        return res.status(400).json({ error: "Email is already in use" });
      }
    }

    // Check if phone is changing and if it is unique
    if (phone) {
      const phoneExists = await User.findOne({ phone, _id: { $ne: userId } });
      if (phoneExists) {
        return res.status(400).json({ error: "Phone number is already in use" });
      }
    }

    // Proceed with update
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    res.json({ message: "User updated", user: updatedUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteUser(req, res) {
  try {
    const userId = req.params.id;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) return res.status(404).json({ error: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
