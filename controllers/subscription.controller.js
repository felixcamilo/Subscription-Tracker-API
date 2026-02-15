import Subscription from "../models/subscription.model.js";
import { workflowClient } from "../config/upstash.js";
import { LOCAL_URL, RENDER_URL, QSTASH_TOKEN } from "../config/env.js";
import { checkAdminPermission, checkSubscriptionOwnership } from "../permissions/permissions.js";

const getBaseUrl = () => {
    if (process.env.RENDER_URL) {
        return `${RENDER_URL}`;
    }

    return `${LOCAL_URL}`;
};

const buildReminderJobRunUrl = (subscriptionId) =>
    `${getBaseUrl()}/api/v1/subscriptions/${subscriptionId}/reminder-jobs/run`;

const triggerReminderWorkflow = async (subscriptionId) => {
    if (!QSTASH_TOKEN) {
        return null;
    }

    const response = await workflowClient.trigger({
        url: buildReminderJobRunUrl(subscriptionId),
        headers: {
            "content-type": "application/json",
        },
        retries: 0,
    });

    return response.workflowRunId;
};

const assertReminderJobPermission = (subscription, req) => {
    if (subscription.user.toString() !== req.user.id && req.user.role !== "admin") {
        const error = new Error("You do not have permission to perform this action");
        error.statusCode = 403;
        throw error;
    }
};

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id,
        });

        let workflowRunId = null;

        try {
            workflowRunId = await triggerReminderWorkflow(subscription.id);
        } catch (workflowError) {
            // Log error but don't fail the request.
            console.error("Workflow trigger failed:", workflowError.message);
        }

        return res
            .location(`/api/v1/subscriptions/${subscription.id}`)
            .status(201)
            .json({ success: true, data: { subscription, workflowRunId } });
    } catch (error) {
        next(error);
    }
};

export const createReminderJob = async (req, res, next) => {
    try {
        const { id } = req.params;
        const subscription = await Subscription.findById(id);

        if (!subscription) {
            const error = new Error("Subscription not found");
            error.statusCode = 404;
            throw error;
        }

        assertReminderJobPermission(subscription, req);

        if (!QSTASH_TOKEN) {
            const error = new Error("Reminder workflow is not configured");
            error.statusCode = 503;
            error.errorCode = "WORKFLOW_NOT_CONFIGURED";
            throw error;
        }

        const workflowRunId = await triggerReminderWorkflow(subscription.id);

        return res
            .location(`/api/v1/subscriptions/${subscription.id}/reminder-jobs/${workflowRunId}`)
            .status(201)
            .json({
                success: true,
                data: {
                    workflowRunId,
                },
            });
    } catch (error) {
        next(error);
    }
};

export const getSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            const error = new Error("Subscription not found");
            error.statusCode = 404;
            throw error;
        }

        if (subscription.user.toString() === req.user.id || req.user.role === "admin") {
            return res.status(200).json({ success: true, data: subscription });
        }

        const error = new Error("You do not have permission to perform this action");
        error.statusCode = 403;
        throw error;
    } catch (error) {
        next(error);
    }
};

export const updateSubscription = async (req, res, next) => {
    try {
        const { id } = req.params;
        const subscription = await Subscription.findById(id);

        if (!subscription) {
            const error = new Error("Subscription not found");
            error.statusCode = 404;
            throw error;
        }

        checkSubscriptionOwnership(subscription, req);

        const updatedSubscription = await Subscription.findOneAndUpdate(
            { _id: id },
            req.body,
            {
                new: true,
            }
        );

        return res.status(200).json({
            success: true,
            message: "Subscription updated successfully",
            data: updatedSubscription,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            const error = new Error("Subscription not found");
            error.statusCode = 404;
            throw error;
        }

        checkSubscriptionOwnership(subscription, req);
        await Subscription.findByIdAndDelete(req.params.id);

        return res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export const cancelSubscription = async (req, res, next) => {
    if (!req.body.status || req.body.status !== "cancelled" || Object.keys(req.body).length !== 1) {
        const error = new Error("Invalid request body");
        error.statusCode = 400;
        throw error;
    }

    updateSubscription(req, res, next);
};

export const getAllSubscriptions = async (req, res, next) => {
    try {
        checkAdminPermission(req);
        const subscriptions = await Subscription.find();

        return res.status(200).json({ success: true, data: subscriptions });
    } catch (error) {
        next(error);
    }
};
