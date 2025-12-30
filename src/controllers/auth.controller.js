import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
    try {
        const { username, email, fullName, password } = req.body;
        console.log(req.body);
        if (!username || !email || !fullName || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(409).json({ message: "User with given email or username already exists" });
        }
        const newUser = new User({ username, email, fullName, password });
        await newUser.save();
        res.status(201).json({ user:newUser,message: "User registered successfully" });
    } catch (error) {
        console.error("Error in registerUser:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const loginUser = async (req, res) => {
    try {
        const { identifier , password } = req.body;
        console.log(req.body);
        
        if (!(identifier && password)) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user = await User.findOne({ $or: [{ email: identifier },{username:identifier }] });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false });

        const logedInUser = await User.findById(user._id).select('-password -refreshTokens');

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 24 * 60 * 60 * 1000,
        };
        res.status(200)
            .cookie('accessToken', accessToken, cookieOptions)
            .cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 10 * 24 * 60 * 60 * 1000 })
            .json({
                message: "Login successful",
                user: logedInUser,
                accessToken,
                refreshToken
            });

    } catch (error) {
        console.error("Error in loginUser:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const logoutUser = async (req, res) => {
    try {
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset: { refreshToken: 1 }
            },
            {
                new: true,
            }
        )
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
        };
        res.status(200)
            .clearCookie("accessToken", cookieOptions)
            .clearCookie("refreshToken", cookieOptions)
            .json({ message: "Logout successful" });
    } catch (error) {
        console.error("Error in logoutUser:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const refreshAccessToken = async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        return res.status(401).json({ message: "No refresh token provided" });
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET,
        )

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }
        const newAccessToken = user.generateAccessToken();
        const newRefreshToken = user.generateRefreshToken();
        user.refreshToken = newRefreshToken;
        await user.save({ validateBeforeSave: false });

        const options = {
            httpOnly: true,
            secure: true
        }
        res.status(200)
            .cookie('accessToken', newAccessToken, options)
            .json({
                accessToken: newAccessToken,
            });

    } catch (error) {
        console.error("Error in refreshAccessToken:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


export { registerUser, loginUser, logoutUser, refreshAccessToken };
