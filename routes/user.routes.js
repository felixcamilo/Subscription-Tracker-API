import {Router} from "express";
import {signUp, getUsers, getUser, updateUser, getUserAllSubscriptions, deleteUserAllSubscriptions} from "../controllers/user.controller.js";
import authorize from "../middlewares/auth.middleware.js";


const userRouter = Router();

userRouter.get("/",authorize, getUsers)

userRouter.get("/:id",authorize, getUser)

userRouter.patch("/:id", authorize, updateUser)

userRouter.delete("/:id/subscriptions", authorize, deleteUserAllSubscriptions);

userRouter.get("/:id/subscriptions", authorize, getUserAllSubscriptions);

userRouter.post("/", signUp)


export default userRouter;