import User from "../models/User.js";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validation
        if (!email || !password) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "All fields are required",
            });
        }

        if (!validator.isEmail(email)) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "Invalid email format",
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
            user: {
                id: existUser._id,
                name: existUser.name,
                email: existUser.email,
            },
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

        if (!validator.isEmail(email)) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "Invalid email format",
            });
        }

        if (password.length < 6) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "Password must be at least 6 characters long",
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

        // Generate JWT so user is logged in immediately after registering
        const token = jwt.sign(
            { userId: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(httpStatus.CREATED).json({
            success: true,
            message: "User registered successfully",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            },
        });

    } catch (err) {
        console.error(err);

        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "Something went wrong",
        });
    }
};

export { register, login };