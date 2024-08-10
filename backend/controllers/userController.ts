import { password } from "bun";
import { signup, signin } from "../services/userservices";
import type { Request, Response } from "express";
import type { RegisterBody, LoginBody, UserPayload } from "../types/allTypes";

export async function register(request: Request, response: Response) {
  try {
    const { email, username, password }: RegisterBody = request.body;

    const user = await signup(email, username, password);

    response.status(200).send({
      message: `The user has been created successfully with the id ${user.id} `,
    });
  } catch (error: any) {
    response.status(400).send(error.message);
  }
}

export async function login(request: Request, response: Response) {
  try {
    const { email, password }: LoginBody = request.body;
    const payload: UserPayload = await signin(email, password);
    response.status(200).json(payload);
  } catch (error: any) {
    response.status(400).send({ err: error.message });
  }
}
