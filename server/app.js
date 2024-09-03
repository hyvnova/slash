import express from "express";
import cors from "cors";

const app = express();

// parse json request body
app.use(express.json());

// cors
app.use(cors({
    origin: '*',
    methods: '*',
    allowedHeaders: '*',
    credentials: false,
    optionsSuccessStatus: 204,
}));


// healthcheck endpoint
app.get("/", (req, res) => {
  res.status(200).send({ status: "ok" });
});

export default app;