import type { Express } from "express";
import express from "express";
import dotenv from "dotenv";
import { userRouter } from "./routes/userroutes";
import cors from "cors";
dotenv.config();
const expressAplication: Express = express();

expressAplication.use(cors());
expressAplication.use(express.json());
expressAplication.use((req, res, next) => {
  console.log(req.url);
  next();
});
expressAplication.use("/api/user/", userRouter);

expressAplication.listen(process.env.PORT, () => {
  console.log(`the application is working on ${process.env.PORT}`);
});
