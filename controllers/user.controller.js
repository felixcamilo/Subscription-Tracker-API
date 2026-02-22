import User from "../models/user.model.js";
import Subscription from "../models/subscription.model.js";
import { checkAdminOrOwnerPermission, checkAdminPermission } from "../permissions/permissions.js";

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

        const {role, id: currentUserId} = req.user;
        const {id: paramsId} = req.params;

        checkAdminOrOwnerPermission(role, currentUserId, paramsId);

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

        const {role, id: currentUserId} = req.user;
        const {id: paramsId} = req.params;

        checkAdminOrOwnerPermission(role, currentUserId, paramsId);

        const userUpdated = await User.findByIdAndUpdate(
            paramsId,
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

        
        const {role, id: currentUserId} = req.user;
        const {id: paramsId} = req.params;

        checkAdminOrOwnerPermission(role, currentUserId, paramsId);

        const deletedUser = await User.findByIdAndDelete(paramsId);

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
        const {id: paramsId} = req.params;

        checkAdminOrOwnerPermission(currentUserRole, currentUserId, paramsId);

        const subscriptions = await Subscription.find({user: paramsId})

        if(!subscriptions){
            const error = new Error("No subscriptions found for the user id you passed in");
            error.statusCode = 404;
            throw error;
        }

            res.status(200).json({success: true, data: subscriptions})


    } catch (error){
        next(error);
    }
}


export const deleteUserAllSubscriptions = async (req, res, next) => {

    try {

        const {role: currentUserRole, id: currentUserId} = req.user;
        const {id: paramsId} = req.params;

        checkAdminOrOwnerPermission(currentUserRole, currentUserId, paramsId);

        const response = await Subscription.deleteMany({user: paramsId})

        if(response.deletedCount === 0){
            const error = new Error("No subscriptions found for the user id you passed in");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({success: true, message: "All subscriptions deleted successfully", data: response})
        

    } catch (error) {
        next(error);
    }
}