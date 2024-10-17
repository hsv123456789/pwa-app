import { Router } from "express";
import { login, register , submitOrder  , getOrders} from "../controllers/userController";
export const userRouter: Router = Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/submitOrder", submitOrder);
userRouter.get("/getOrders", getOrders);
