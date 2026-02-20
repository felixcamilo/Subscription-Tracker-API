import User from "../models/user.model.js";
import Subscription from "../models/subscription.model.js";
import { checkAdminPermission } from "../permissions/permissions.js";

export const getUsers = async (req, res, next) => {

    try {

        const {role} = req.user;

        checkAdminPermission(role);

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
            return res.status(403).json({message: "Unauthorized"});
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


export const deleteUser = async (req, res, next) => {

    try {

        
        const {role} = req.user;

        checkAdminPermission(role);

        const {id} = req.params;

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            const error = new Error("Unable to delete. User not found");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({success: true,message: "User deleted successfully", data: deletedUser});
    } catch (error) {
        next(error)
    }
}


export const getUserAllSubscriptions = async (req, res, next) => {

    try {

        const {role: currentUserRole, id: currentUserId} = req.user;

        if (currentUserRole === "admin" || currentUserId === req.params.id) {
            const subscriptions = await Subscription.find({user: req.params.id})

            res.status(200).json({success: true, data: subscriptions})
        }
        else {

            res.status(403).json({success: false, 
                message: "Only the admin and the Subscriptions Owner have permission to perform this action"});

        }


    } catch (error){
        next(error);
    }
}


export const deleteUserAllSubscriptions = async (req, res, next) => {

    try {

        const {role: currentUserRole, id: currentUserId} = req.user;

        if (currentUserRole === "admin" || currentUserId === req.params.id) {

            const response = await Subscription.deleteMany({user: req.params.id})

            res.status(200).json({success: true, message: "All subscriptions deleted successfully", data: response})
        }
        else{

            res.status(403).json({success: false, 
                message: "Only the admin and the Subscriptions Owner have permission to perform this action"});

        }


    } catch (error) {
        next(error);
    }
}