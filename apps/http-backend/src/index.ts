import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_TOKEN } from "@repo/backend-common/config";
import { authMiddleware } from "./middleware";
import {
  CreateRoomSchema,
  CreateUserSchema,
  SigninSchema,
} from "@repo/common/types";

const app = express();

app.post("/signup", (req: Request, res: Response) => {
  const data = CreateUserSchema.safeParse(req.body);
  if (!data.success) {
    res.json({
      message: "Invalid Inputs",
      error: data.error,
    });
    return;
  }
  //db call
  res.json({
    userId: 231,
  });
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
