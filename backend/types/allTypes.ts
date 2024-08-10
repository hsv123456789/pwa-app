import type { Request } from "express";
import type { User } from "@prisma/client";
export type RegisterBody = {
  email: string;
  username: string;
  password: string;
};

export type LoginBody = {
  email: string;
  password: string;
};

export type UserPayload = {
  username: string;
  token: string;
};

export interface RequestWithUser extends Request {
  user: User;
}
