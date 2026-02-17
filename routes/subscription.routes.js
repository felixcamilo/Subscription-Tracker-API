import {Router} from "express";
import authorize from "../middlewares/auth.middleware.js";
import {
    createSubscription,
    deleteUserAllSubscriptions, getAllSubscriptions,
    getUserAllSubscriptions, updateSubscription, deleteSubscription, getSubscription, deleteAllSubscriptions

} from "../controllers/subscription.controller.js";

const subscriptionRouter  = new Router();

subscriptionRouter.get("/", authorize, getAllSubscriptions);

subscriptionRouter.post("/", authorize, createSubscription);

subscriptionRouter.get("/:id", authorize, getSubscription);

subscriptionRouter.put("/:id", authorize, updateSubscription);

subscriptionRouter.delete("/", authorize, deleteAllSubscriptions);

subscriptionRouter.delete("/:id", authorize, deleteSubscription);

subscriptionRouter.delete("/user/:id", authorize, deleteUserAllSubscriptions);

subscriptionRouter.get("/user/:id", authorize, getUserAllSubscriptions);

export default subscriptionRouter;