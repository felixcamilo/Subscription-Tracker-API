import {Router} from "express";
import {signIn, signOut} from "../controllers/auth.controller.js";

const sessionRouter = Router();

sessionRouter.post("/", signIn);
sessionRouter.delete("/current", signOut);

export default sessionRouter;