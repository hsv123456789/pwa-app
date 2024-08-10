import { db } from "../utils/db";
import validator from "validator";
import type { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import type { UserPayload } from "../types/allTypes";
export async function signup(
  email: string,
  username: string,
  password: string
): Promise<User> {
  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) {
    throw Error("The user already exists");
  }
  if (password.length < 8) {
    throw Error("The length of the password is small");
  }
  if (!validator.isEmail(email)) {
    throw Error("The email is not a valid email");
  }

  const encryptedPassword = await Bun.password.hash(password, {
    algorithm: "bcrypt",
    cost: 4,
  });

  const newUser = await db.user.create({
    data: { email, username, encryptedPassword },
  });

  return newUser;
}

function createToken(id: string): string {
  if (process.env.JWT_SECRET === undefined) {
    throw Error("Please add the env file");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "3d" });
}

export async function signin(
  email: string,
  password: string
): Promise<UserPayload> {
  if (!validator.isEmail(email)) {
    throw Error("The email is not a valid email");
  }
  const existingUser = await db.user.findUnique({ where: { email } });
  console.log(existingUser);
  if (!existingUser) {
    throw Error("The  user does not exist in the database");
  }
  const validPassword = await Bun.password.verify(
    password,
    existingUser.encryptedPassword
  );
  if (!validPassword) {
    throw Error("The password is not valid");
  }
  if (process.env.JWT_SECRET === undefined) {
    throw Error("Please add the env file");
  }

  const username = existingUser.username;
  const token = createToken(existingUser.id);
  return { username, token };
}
