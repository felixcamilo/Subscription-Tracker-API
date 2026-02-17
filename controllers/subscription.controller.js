import Subscription from '../models/subscription.model.js'
import {workflowClient} from "../config/upstash.js";
import {LOCAL_URL, RENDER_URL} from "../config/env.js";
import {checkAdminPermission} from "../permissions/permissions.js";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween.js";

dayjs.extend(isBetween);

export const createSubscription = async (req, res, next) => {

    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id}
        )

        const BASE_URL = process.env.RENDER_URL
            ? `${RENDER_URL}`
            : `${LOCAL_URL}`

       const {workflowRunId} = await workflowClient.trigger({
            url: `${BASE_URL}/api/v1/workflows/subscription/reminder`,

            body: {
            subscriptionId: subscription.id,

            },

            headers: {
                'content-type': 'application/json',
            },
            retries: 0,

        })

        res.status(201).json({success: true, data: {subscription, workflowRunId}})

    } catch (error) {
        next(error)
    }
}


export const getSubscription = async (req, res, next) => {

    try {

        const subscription = await Subscription.findById(req.params.id);

        if (!subscription)
            return res.status(404).json({message: "Subscription not found"})


        if (subscription.user._id.toString() === req.user.id || req.user.role === 'admin'){

            res.status(200).json({success: true, data: subscription})
        }
        else{
            res.status(403).json({message: "You do not have permission to perform this action"})
        }


    } catch (error) {
        next(error)
    }
}


export const updateSubscription = async (req, res, next) => {

    try {

        const subscription = await Subscription.findById(req.params.id)

        if (!subscription){
            res.status(404).json({message: "Subscription not found"})
        }

        checkSubscriptionOwnership(subscription, req, res)

        const updatedSubscription = await Subscription.findByIdAndUpdate(
            req.params.id,
            {...req.body},
            {new: true})

        res.status(200).json({success: true, message: "has been updated succesfully!", data: updatedSubscription})

    }  catch (error){
        next(error);
    }
}


export const deleteSubscription = async (req, res, next) => {

    try {

        const subscription = await Subscription.findById(req.params.id)

        if (!subscription){
          return  res.status(404).json({message: "Subscription not found"})
        }

        checkSubscriptionOwnership(subscription, req, res)

        const response = await Subscription.findByIdAndDelete(req.params.id)

        res.status(200).json({success: true, message: "has been deleted succesfully!", data: response})
    }  catch (error){
        next(error);
    }
}


export const getUserAllSubscriptions = async (req, res, next) => {

    try {

        if (req.user.role === "admin" || req.user.id === req.params.id) {
            const subscriptions = await Subscription.find({user: req.params.id})

            res.status(200).json({success: true, data: subscriptions})
        }
        else {

            res.status(403).json({message: "Just the admin and the owner account have permission to perform this action"});

        }


    } catch (error){
        next(error);
    }
}


export const deleteUserAllSubscriptions = async (req, res, next) => {

    try {

        if (req.user.role === "admin" || req.user.id === req.params.id) {

            const response = await Subscription.deleteMany({user: req.params.id})

            res.status(200).json({success: true, data: response})
        }
        else{

            res.status(403).json({message: "Just the admin and the owner account have permission to perform this action"});

        }


    } catch (error) {
        next(error);
    }
}


export const getAllSubscriptions = async (req, res, next) => {
   try {

       checkAdminPermission(req, res)

       const subscriptions = await Subscription.find();

       res.status(200).json({success: true, data: subscriptions})

   } catch (error){
       next(error);
   }
}


export const deleteAllSubscriptions = async (req, res, next) => {
    try {

        const {role} = req.user

        checkAdminPermission(role)

        const subscriptions = await Subscription.deleteMany({});

        res.status(200).json({success: true, data: subscriptions})


    } catch (error) {
        next(error);
    }
}





