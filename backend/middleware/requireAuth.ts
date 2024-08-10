import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { db } from "../utils/db";
import type { RequestWithUser } from "../types/allTypes";
export async function requireAuth(
  request: RequestWithUser,
  response: Response,
  nextFunction: NextFunction
) {
  const { authorization } = request.headers;
  try {
    if (!authorization) {
      throw Error("Authorization is required");
    }
    const token = authorization?.split(" ")[1];
    const secret = process.env.JWT_SECRET;
    if (secret === undefined) {
      throw Error("JWT secret is undefined");
    }
    const payload: any = jwt.verify(token, secret);
    const { id } = payload;
    const userfound = await db.user.findUnique({ where: { id: id } });
    if (!userfound) {
      throw Error("User does not exist in the database.");
    } else {
      request.user = userfound;
    }
    nextFunction();
  } catch (error: any) {
    console.log(error.message);
    res.status(401).json({ error: "Request is not authorized" });
  }
}
