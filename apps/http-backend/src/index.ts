import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_TOKEN } from "./config";
import { authMiddleware } from "./middleware";

const app = express();

app.post("/signup", (req: Request, res: Response) => {
  //db call
  res.json({
    userId: 231,
  });
});

app.post("/signin", (req: Request, res: Response) => {
  const userId = 1;
  const token = jwt.sign({ userId }, JWT_TOKEN);
});

app.post("/room", authMiddleware, (req: Request, res: Response) => {
  //db call
  res.json({
    roomID: 311,
  });
});

app.listen(3001);
