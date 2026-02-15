import aj from '../config/arcjet.js'

const buildArcjetError = (statusCode, message, errorCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.errorCode = errorCode;
    return error;
};

const arcjetMiddleware = async (req, res, next) => {
    try {

        const decision = await aj.protect(req, {requested: 1})

        if(decision.isDenied()) {
            if (decision.reason.isRateLimit())
                return next(buildArcjetError(429, "Rate limit reached", "RATE_LIMITED"))

            if(decision.reason.isBot())
                return next(buildArcjetError(403, "Bot detected", "BOT_DETECTED"))

            return next(buildArcjetError(403, "Access denied", "ACCESS_DENIED"))
        }

        next();
    } catch (error){
        console.log(`Arcjet Middleware Error: ${error}`)
        if (!error.statusCode) {
            const middlewareError = buildArcjetError(500, "Security middleware failure", "ARCJET_ERROR");
            return next(middlewareError);
        }
        return next(error);
    }
}

export default arcjetMiddleware;
