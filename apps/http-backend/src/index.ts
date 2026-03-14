import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_TOKEN } from "@repo/backend-common/config";
import { authMiddleware } from "./middleware";
import {
  CreateRoomSchema,
  CreateUserSchema,
  SigninSchema,
} from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
const app = express();
app.use(express.json());

app.post("/signup", async (req: Request, res: Response) => {
  const parsedData = CreateUserSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: "Invalid Inputs",
      error: parsedData.error.message,
    });
    return;
  }
  //db call

  try {
    const user = await prismaClient.user.create({
      data: {
        email: parsedData.data.username,
        password: parsedData.data.password,
        name: parsedData.data.name,
      },
    });

    res.status(200).json({
      message: "Signed Up successfully",
      userid: user.id,
    });
  } catch (e) {
    console.log(e);
    res.status(411).json({
      message: "User already exists with that email",
      error: e,
    });
  }
});

app.post("/signin", (req: Request, res: Response) => {
  const data = SigninSchema.safeParse(req.body);
  if (!data.success) {
    res.json({
      message: "Invalid inputs",
      error: data.error,
    });
    return;
  }
  const userId = 1;
  const token = jwt.sign({ userId }, JWT_TOKEN);
});

app.post("/room", authMiddleware, (req: Request, res: Response) => {
  const data = CreateRoomSchema.safeParse(req.body);
  if (!data.success) {
    res.json({
      message: "Invalid Inputs",
      error: data.error,
    });
    return;
  }
  //db call
  res.json({
    roomID: 311,
  });
});

app.listen(3001);
