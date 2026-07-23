import User from "../models/User.js";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validation
        if (!email || !password) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "All fields are required",
            });
        }

        // Find User
        const existUser = await User.findOne({
            email: email.toLowerCase(),
        });

        if (!existUser) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                message: "Incorrect email or password",
            });
        }

        // Compare Password
        const passwordMatch = await bcrypt.compare(
            password,
            existUser.password
        );

        if (!passwordMatch) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                message: "Incorrect email or password",
            });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: existUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Success Response
        return res.status(httpStatus.OK).json({
            success: true,
            message: "Login successful",
            token,
        });

    } catch (err) {
        console.error(err);

        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "Something went wrong",
        });
    }
};

const register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Validation
        if (!name || !email || !password) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "All fields are required",
            });
        }

        // Check existing user
        const existUser = await User.findOne({
            email: email.toLowerCase(),
        });

        if (existUser) {
            return res.status(httpStatus.CONFLICT).json({
                message: "User already exists",
            });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User
        const newUser = new User({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
        });

        await newUser.save();

        return res.status(httpStatus.CREATED).json({
            success: true,
            message: "User registered successfully",
        });

    } catch (err) {
        console.error(err);

        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "Something went wrong",
        });
    }
};

export { register, login };