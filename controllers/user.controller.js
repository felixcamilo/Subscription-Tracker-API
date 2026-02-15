import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {JWT_EXPIRES_IN, JWT_SECRET} from "../config/env.js";
import User from "../models/user.model.js";
import Subscription from "../models/subscription.model.js";


export const signUp = async (req, res, next) => {

    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        // Logic to create a new user

        const {name, email, password, role} = req.body;

        // Check if the user already exists

        const existingUser = await User.findOne({ email });

        if(existingUser){
            const error = new Error("User already exists");
            error.statusCode = 409;
            throw error;
        }

        // hash password

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUsers = await User.create([{name, email, password: hashedPassword, role}], {session})

        const token = jwt.sign({userId: newUsers[0]._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN} );
        const createdUser = newUsers[0].toObject();
        delete createdUser.password;

        await session.commitTransaction();

        await session.endSession();

        res.location(`/api/v1/users/${newUsers[0]._id}`).status(201).json(
            {
                 success: true,
                 message: "User signed up successfully",
                 data: {
                    token,
                    user: createdUser,
                 }
            }
        );
    }
    catch(error){

       await session.abortTransaction();
       await session.endSession();
       next(error);
    }
}


export const getUsers = async (req, res, next) => {

    try {

        if (req.user.role !== 'admin') {
            const error = new Error("You do not have permission to perform this action");
            error.statusCode = 403;
            throw error;
        }

        const users = await User.find();

        res.status(200).json({success: true, data: users});

    } catch(error) {
        next(error)
    }


}

export const getUser = async (req, res, next) => {

    try {

        const user = await User.findById(req.params.id).select("-password");

        if(!user){
            const error = new Error("User not found by id you passed in");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({success: true, data: user});

    } catch(error) {
        next(error)
    }


}

export const updateUser = async (req, res, next) => {

    try {

        if (req.user.id !== req.params.id && req.user.role !== 'admin') {
            const error = new Error("You do not have permission to perform this action");
            error.statusCode = 403;
            throw error;
        }

        const userUpdated = await User.findByIdAndUpdate(
            req.params.id,
            {...req.body},
            {new: true})

        if (!userUpdated){
            const error = new Error("Unable to update. User not found");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({success: true, data: userUpdated});

    } catch (error){
        next(error)
    }
}


export const getUserAllSubscriptions = async (req, res, next) => {

    try {

        if (req.user.role === "admin" || req.user.id === req.params.id) {
            const subscriptions = await Subscription.find({ user: req.params.id })

            res.status(200).json({ success: true, data: subscriptions })
        }
        else {

            const error = new Error("Only the admin and the owner account have permission to perform this action");
            error.statusCode = 403;
            throw error;

        }


    } catch (error) {
        next(error);
    }
}


export const deleteUserAllSubscriptions = async (req, res, next) => {

    try {

        if (req.user.role === "admin" || req.user.id === req.params.id) {

            const response = await Subscription.deleteMany({ user: req.params.id })

            res.status(200).json({ success: true, data: response })
        }
        else {

            const error = new Error("Only the admin and the owner account have permission to perform this action");
            error.statusCode = 403;
            throw error;

        }


    } catch (error) {
        next(error);
    }
}
