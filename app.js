import express from "express";
import {PORT} from "./config/env.js";
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import workflowRouter from "./routes/workflow.routes.js";

import connectToDatabase from "./database/mongodb.js";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/error.middleware.js";
import arcjetMiddleware from "./middlewares/arcjet.middleware.js";
import cors from "cors"

const app = express();


const allowedOrigins = [
    "http://localhost:5173",      // local dev
    "https://myfrontend.com"      // production frontend
]

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow non-browser tools (Postman, curl)
            if (!origin) return callback(null, true)

            if (allowedOrigins.includes(origin)) {
                callback(null, true)
            } else {
                callback(new Error("Not allowed by CORS"))
            }
        },
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true
    })
)

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(arcjetMiddleware)

app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/workflows', workflowRouter);

app.use(errorMiddleware)

app.get("/", (req, res) => {
    res.send("Welcome to the Subscription Tracker API!");
})

app.listen(PORT, async () => {
    console.log(`Subscription Tracker API is running on http://localhost:${PORT}`);

   await connectToDatabase()

});

export default app;