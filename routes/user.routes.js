import {Router} from "express";
import {getUsers, getUser, updateUser, deleteUser, getUserAllSubscriptions, deleteUserAllSubscriptions} from "../controllers/user.controller.js";
import authorize from "../middlewares/auth.middleware.js";


const userRouter = Router();

userRouter.get("/",authorize, getUsers)

userRouter.get("/current/:id",authorize, getUser)

userRouter.put("/current/:id", authorize, updateUser)

userRouter.delete("/current/:id", authorize, deleteUser)

userRouter.get("/:id/subscriptions", authorize, getUserAllSubscriptions)

userRouter.delete("/:id/subscriptions", authorize, deleteUserAllSubscriptions)

export default userRouter;