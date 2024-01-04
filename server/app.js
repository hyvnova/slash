import express from "express";
import cors from "cors";
import morgan from "morgan";

import * as middleware from "./utils/middleware.js";

const app = express();

// parse json request body
app.use(express.json());

// cors
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: '*',
    credentials: true,
    optionsSuccessStatus: 204,
}));

// request logger middleware
app.use(morgan("tiny"));

// healthcheck endpoint
app.get("/", (req, res) => {
  res.status(200).send({ status: "ok" });
});


// custom middleware
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;