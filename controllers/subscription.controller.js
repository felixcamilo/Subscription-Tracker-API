import Subscription from '../models/subscription.model.js'
import { workflowClient } from "../config/upstash.js";
import { LOCAL_URL, RENDER_URL, QSTASH_TOKEN } from "../config/env.js";
import { checkAdminPermission, checkSubscriptionOwnership } from "../permissions/permissions.js";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween.js";

dayjs.extend(isBetween);

export const createSubscription = async (req, res, next) => {


    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id
        }
        )

        let workflowRunId = null;

        // Only trigger workflow if Upstash is configured
        if (QSTASH_TOKEN) {
            try {
                const BASE_URL = process.env.RENDER_URL
                    ? `${RENDER_URL}`
                    : `${LOCAL_URL}`

                const response = await workflowClient.trigger({
                    url: `${BASE_URL}/api/v1/subscriptions/${subscription.id}/reminders`,

                    body: {
                        subscriptionId: subscription.id,
                    },

                    headers: {
                        'content-type': 'application/json',
                    },
                    retries: 0,

                })
                workflowRunId = response.workflowRunId;
            } catch (workflowError) {
                // Log error but don't fail the request
                console.error("⚠️ Workflow trigger failed:", workflowError.message);
            }
        } else {
            console.log("ℹ️ Upstash not configured. Skipping workflow trigger.");
        }

       return res.status(201).json({ success: true, data: { subscription, workflowRunId } })

    } catch (error) {
        next(error)
    }
}


export const getSubscription = async (req, res, next) => {

    try {

        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            const error = new Error("Subscription not found");
            error.statusCode = 404;
            throw error;
        }

        if (subscription.user.toString() === req.user.id || req.user.role === 'admin') {

           return res.status(200).json({ success: true, data: subscription })
        }
        else {
            const error = new Error("You do not have permission to perform this action");
            error.statusCode = 403;
            throw error;
        }


    } catch (error) {
        next(error)
    }
}


export const updateSubscription = async (req, res, next) => {

    try {

        const { id } = req.params

        const subscription = await Subscription.findById(id)

        if (!subscription) {
            const error = new Error("Subscription not found");
            error.statusCode = 404;
            throw error;
        }

        checkSubscriptionOwnership(subscription, req, res)

        const updatedSubscription = await Subscription.findOneAndUpdate(
            {_id: id} ,
            req.body,
            { 
              new: true,         // return updated doc
            })

        return res.status(200).json({ success: true, message: "has been updated succesfully!", data: updatedSubscription })

    } catch (error) {
        next(error);
    }
}



export const deleteSubscription = async (req, res, next) => {

    try {

        const subscription = await Subscription.findById(req.params.id)

        if (!subscription) {
            const error = new Error("Subscription not found");
            error.statusCode = 404;
            throw error;
        }

        checkSubscriptionOwnership(subscription, req, res)

        const response = await Subscription.findByIdAndDelete(req.params.id)

        return res.status(200).json({ success: true, message: "has been deleted succesfully!", data: response })
    } catch (error) {
        next(error);
    }
}



export const cancelSubscription = async (req, res, next) => {

    if(!req.body.status || req.body.status !== "cancelled" || Object.keys(req.body).length !== 1) {

        const error = new Error("Invalid request body");
        error.statusCode = 400;
        throw error;
    }

    updateSubscription(req, res, next);
    // try {

    //     const { id } = req.params

    //     let subscription = await Subscription.findById(id)

    //     if (!subscription) {
    //         const error = new Error("Subscription not found");
    //         error.statusCode = 404;
    //         throw error;
    //     }

    //     checkSubscriptionOwnership(subscription, req, res)

    //     if (Object.keys(req.body).length === 0) {
    //         return res.status(400).json({ success: false, error: { message: "No fields to update" } })
    //     }
        
    //     const {status} = req.body

    //     subscription = await Subscription.findByIdAndUpdate(

    //     id,
    //     { $set: { status } },   // 👈 partial update
    //     {
    //         new: true,         // return updated doc
    //         runValidators: true // enforce schema rules
    //     }
    //     )

    //     return res.status(200).json({ success: true, message: "Subscription has been cancelled successfully!", data: subscription })
    // } catch (error) {
    //     next(error);
    // }
}  



export const getAllSubscriptions = async (req, res, next) => {
    try {

        checkAdminPermission(req, res)

        const subscriptions = await Subscription.find();

        return res.status(200).json({ success: true, data: subscriptions })

    } catch (error) {
        next(error);
    }
}


