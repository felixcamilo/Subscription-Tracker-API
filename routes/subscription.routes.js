import {Router} from "express";
import authorize from "../middlewares/auth.middleware.js";
import {
    createSubscription, getAllSubscriptions,
    updateSubscription, deleteSubscription, getSubscription

} from "../controllers/subscription.controller.js";

const subscriptionRouter  = new Router();


subscriptionRouter.post("/", authorize, createSubscription);

subscriptionRouter.get("/:id", authorize, getSubscription);

subscriptionRouter.get("/", authorize, getAllSubscriptions);

subscriptionRouter.put("/:id", authorize, updateSubscription);

subscriptionRouter.delete("/:id", authorize, deleteSubscription);


export default subscriptionRouter;