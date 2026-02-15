import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {JWT_EXPIRES_IN, JWT_SECRET} from "../config/env.js";

// What is a req body? req.body is an object containing data coming from the client (Post RequestS)


export const signIn = async (req, res, next) => {

    try {
        const {email, password} = req.body;

        const user = await User.findOne({email});

        if(!user){

            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        const isPasswordValid  = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            const error = new Error("Invalid Password");
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({userId: user._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});

        res.status(200).json({
            success: true,
            message: "User signed in successfully",
            data: {
                token,
                user
            }
        })
    }
    catch (error) {
        next(error);
    }
}

export const signOut = async (req, res, next) => {

}