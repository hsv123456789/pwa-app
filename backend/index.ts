import type { Express } from "express";
import express from "express";
import dotenv from "dotenv";
import { userRouter } from "./routes/userroutes";
import cors from "cors";
dotenv.config();
const expressAplication: Express = express();

expressAplication.use(cors());
const corsOptions = {
  //origin: ['http://localhost:4200','http://127.0.0.1:4200'], // Explicitly set the allowed origin
  origin: '*', //
  credentials: true, // Allow credentials to be included in requests
  optionsSuccessStatus: 200 // For legacy browser support
};

// Use the CORS middleware with the configured options
expressAplication.use(cors(corsOptions));
expressAplication.use(express.json());
expressAplication.use((req, res, next) => {
  console.log(req.url);
  next();
});
expressAplication.use("/api/user/", userRouter);

expressAplication.listen(process.env.PORT, () => {
  console.log(`the application is working on ${process.env.PORT}`);
});
