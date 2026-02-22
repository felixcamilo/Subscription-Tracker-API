import Subscription from '../models/subscription.model.js'
import {workflowClient} from "../config/upstash.js";
import {LOCAL_URL, RENDER_URL} from "../config/env.js";
import {checkAdminPermission, checkOwnerPermission} from "../permissions/permissions.js";
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


export const getAllSubscriptions = async (req, res, next) => {
   try {

       const {role} = req.user

       checkAdminPermission(role)

       const subscriptions = await Subscription.find();

       if(!subscriptions){
           return res.status(404).json({message: "There are no subscriptions in the database"})
       }

       res.status(200).json({success: true, data: subscriptions})

   } catch (error){
       next(error);
   }
}



export const getSubscription = async (req, res, next) => {

    try {

        const {id} = req.params;
        
        const subscription = await Subscription.findById(id);

        if (!subscription)
            return res.status(404).json({message: "Subscription not found"})

        
        const subscriptionUserId = subscription.user._id.toString()

        const {id: currentUserId} = req.user
  
        checkOwnerPermission(subscriptionUserId, currentUserId)

        res.status(200).json({success: true, data: subscription})


    } catch (error) {
        next(error)
    }
}



export const updateSubscription = async (req, res, next) => {

    try {

        const {id} = req.params;
        const subscription = await Subscription.findById(id)

        if (!subscription){
            return res.status(404).json({message: "Subscription not found"})
        }

        const subscriptionUserId = subscription.user._id.toString()

        const {id: currentUserId} = req.user
  
        checkOwnerPermission(subscriptionUserId, currentUserId)

        const blockedFields = new Set(["_id", "user", "createdAt", "updatedAt", "__v"]);
        const updateFields = Object.fromEntries(
            Object.entries(req.body).filter(([key, value]) => !blockedFields.has(key) && value !== undefined)
        );

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({message: "No valid fields to update"})
        }

        const updatedSubscription = await Subscription.findByIdAndUpdate(
            id,
            {$set: updateFields},
            {new: true, runValidators: true})

        res.status(200).json({success: true, message: "has been updated succesfully!", data: updatedSubscription})

    }  catch (error){
        next(error);
    }
}


export const deleteSubscription = async (req, res, next) => {

    try {

        const subscriptionId = req.params.id

        const subscription = await Subscription.findById(subscriptionId)

        if (!subscription){
          return  res.status(404).json({success: false, message: "Subscription not found"})
        }

        const subscriptionUserId = subscription.user._id.toString()
        const {id} = req.user

        checkOwnerPermission(subscriptionUserId, id)

        const response = await Subscription.findByIdAndDelete(subscriptionId)

        res.status(200).json({success: true, message: "has been deleted succesfully!", data: response})
    }  catch (error){
        next(error);
    }
}


export const getUpcomingRenewals = async (req, res, next) => {
    try {

        const today = dayjs();
        const in7Days = dayjs().add(7, 'day');

        const subscriptions = await Subscription.find({
            user: req.user._id,
            renewalDate: {
                $gte: today.toDate(),
                $lte: in7Days.toDate()
            }
        });

        res.status(200).json({success: true, data: subscriptions });
    } catch (error) {
        next(error);
    }
}



