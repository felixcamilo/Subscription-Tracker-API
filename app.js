import express from "express";
import {PORT} from "./config/env.js";
import userRouter from "./routes/user.routes.js";
import sessionRouter from "./routes/auth.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";

import connectToDatabase from "./database/mongodb.js";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/error.middleware.js";
import arcjetMiddleware from "./middlewares/arcjet.middleware.js";
import swaggerUi from "swagger-ui-express";
import openApiDocument from "./docs/openapi.js";

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(arcjetMiddleware)

app.use('/api/v1/users', userRouter);
app.use('/api/v1/sessions', sessionRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.get("/api-docs.json", (req, res) => res.json(openApiDocument));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use(errorMiddleware)

app.get("/", (req, res) => {
    res.send("Welcome to the Subscription Tracker API!");
})

app.listen(PORT, async () => {
    console.log(`Subscription Tracker API is running on http://localhost:${PORT}`);
    await connectToDatabase()

});

export default app;
