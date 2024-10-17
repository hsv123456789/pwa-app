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
export async function submitOrder(request: Request, response: Response) {
  try {
    const { city, restaurant, diet, order, totalPrice } = request.body;

    // Here, you could store the order details in your database
    console.log("Order details received:", { city, restaurant, diet, order, totalPrice });

    const newOrder: Order = {
      city,
      restaurant,
      diet,
      order,
      totalPrice,
    };

    // Push the new order to the orders array
    orders.push(newOrder);

    // Simulate a response indicating the order was received
    response.status(200).send({ message: "Order placed successfully", totalPrice });
  } catch (error: any) {
    response.status(400).send({ err: error.message });
  }
}
interface Order {
  city: string;
  restaurant: string;
  diet: string;
  order: any[]; // Replace `any[]` with a more specific type if possible
  totalPrice: number;
}

let orders: Order[] = [];
export async function getOrders(request: Request, response: Response) {
  try {
    // Fetch orders (replace with DB fetch if necessary)
    response.status(200).json(orders);
    console.log(orders);
  } catch (error: any) {
    response.status(400).send({ err: error.message });
  }
}