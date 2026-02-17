import {Router} from "express";
import authorize from "../middlewares/auth.middleware.js";
import {
    createSubscription,
    deleteUserAllSubscriptions, getAllSubscriptions,
    getUserAllSubscriptions, updateSubscription, deleteSubscription, getSubscription, deleteAllSubscriptions

} from "../controllers/subscription.controller.js";

const subscriptionRouter  = new Router();


subscriptionRouter.post("/", authorize, createSubscription);

subscriptionRouter.get("/:id", authorize, getSubscription);

subscriptionRouter.get("/", authorize, getAllSubscriptions);

subscriptionRouter.put("/:id", authorize, updateSubscription);

subscriptionRouter.delete("/:id", authorize, deleteSubscription);

subscriptionRouter.delete("/", authorize, deleteAllSubscriptions);

subscriptionRouter.get("/user/:id", authorize, getUserAllSubscriptions);

subscriptionRouter.delete("/user/:id", authorize, deleteUserAllSubscriptions);



export default subscriptionRouter;