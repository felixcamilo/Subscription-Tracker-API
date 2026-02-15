import {Router} from "express";
import authorize from "../middlewares/auth.middleware.js";
import {
    createSubscription, getAllSubscriptions,
    updateSubscription, deleteSubscription, getSubscription
} from "../controllers/subscription.controller.js";
import {sendReminders} from "../controllers/workflow.controller.js";

const subscriptionRouter  = new Router();

subscriptionRouter.get("/", authorize, getAllSubscriptions);

subscriptionRouter.post("/", authorize, createSubscription);

subscriptionRouter.get("/:id", authorize, getSubscription);

subscriptionRouter.patch("/:id", authorize, updateSubscription);

subscriptionRouter.delete("/:id", authorize, deleteSubscription);

subscriptionRouter.post("/:id/reminders", authorize, sendReminders)

export default subscriptionRouter;