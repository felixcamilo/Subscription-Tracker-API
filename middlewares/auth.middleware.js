import jwt from "jsonwebtoken";
import {JWT_SECRET} from "../config/env.js";
import User from "../models/user.model.js";

const buildAuthError = (message, errorCode = "UNAUTHORIZED") => {
    const error = new Error(message);
    error.statusCode = 401;
    error.errorCode = errorCode;
    return error;
};

const authorize = async (req, res, next) => {

    try {

        let token;

        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {

            token = req.headers.authorization.split(" ")[1];

        }

        if(!token) {
            return next(buildAuthError("Authorization token is required", "AUTH_REQUIRED"));
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.userId);

        if(!user) {
            return next(buildAuthError("Authentication token is invalid", "INVALID_TOKEN"));
        }

        req.user = user;

        next();

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return next(buildAuthError("Authentication token has expired", "TOKEN_EXPIRED"));
        }

        return next(buildAuthError("Authentication token is invalid", "INVALID_TOKEN"));
    }
}

export default authorize;
