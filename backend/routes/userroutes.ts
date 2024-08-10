import { Router } from "express";
import { login, register } from "../controllers/userController";
export const userRouter: Router = Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
