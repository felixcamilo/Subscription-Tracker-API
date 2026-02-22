import {Router} from "express";
import authorize from "../middlewares/auth.middleware.js";
import {
    createSubscription, getAllSubscriptions,
    updateSubscription, deleteSubscription, getSubscription, getUpcomingRenewals

} from "../controllers/subscription.controller.js";

const subscriptionRouter  = new Router();


subscriptionRouter.post("/", authorize, createSubscription);

subscriptionRouter.get("/", authorize, getAllSubscriptions);

subscriptionRouter.get("/upcoming-renewals", authorize, getUpcomingRenewals);

subscriptionRouter.get("/:id", authorize, getSubscription);

subscriptionRouter.put("/:id", authorize, updateSubscription);

subscriptionRouter.delete("/:id", authorize, deleteSubscription);


export default subscriptionRouter;