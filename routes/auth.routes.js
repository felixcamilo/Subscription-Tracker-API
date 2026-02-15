import {Router} from "express";
import {signIn, signOut} from "../controllers/auth.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const sessionRouter = Router();

sessionRouter.post("/", signIn);
sessionRouter.delete("/current", authorize, signOut);

export default sessionRouter;
