const errorMiddleware = (err, req, res, next) => {

    try {

        let statusCode = err.statusCode || 500;
        let message = err.message || "Server Error";
        let errorCode = err.errorCode;

        console.error(err);


        //Mongoose bad Object Id

        if (err.name === 'CastError') {
            statusCode = 404;
            message = "Resource not found";
            errorCode = "NOT_FOUND";

        }

        // Mongoose duplicate key

        if (err.code === 11000) {
            statusCode = 409;
            message = "Duplicate field value entered";
            errorCode = "CONFLICT";

        }

        //Mongoose validation error

        if (err.name === 'ValidationError') {
            const validationMessage = Object.values(err.errors).map(val => val.message);
            statusCode = 400;
            message = validationMessage.join(", ");
            errorCode = "VALIDATION_ERROR";
        }

        const fallbackCodeByStatus = {
            400: "BAD_REQUEST",
            401: "UNAUTHORIZED",
            403: "FORBIDDEN",
            404: "NOT_FOUND",
            409: "CONFLICT",
            429: "TOO_MANY_REQUESTS",
            500: "INTERNAL_SERVER_ERROR",
            503: "SERVICE_UNAVAILABLE",
        };

        const resolvedCode = errorCode || fallbackCodeByStatus[statusCode] || "INTERNAL_SERVER_ERROR";

        res.status(statusCode).json({
            success: false,
            error: {
                code: resolvedCode,
                message,
            },
        });
    }
    catch (error) {
            next(error);

    }
}

export default errorMiddleware;
