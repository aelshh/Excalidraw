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
        // Todo: Hash the password
        password: parsedData.data.password,
        name: parsedData.data.name,
      },
    });

    res.status(200).json({
      message: "Signed Up successfully",
      userId: user.id,
    });
  } catch (e) {
    console.log(e);
    res.status(411).json({
      message: "User already exists with that email",
      error: e,
    });
  }
});

app.post("/signin", async (req: Request, res: Response) => {
  const parsedData = SigninSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: "Invalid inputs",
      error: parsedData.error,
    });
    return;
  }

  const user = await prismaClient.user.findUnique({
    where: {
      email: parsedData.data.username,
      //Todo: compare hashed password
      password: parsedData.data.password,
    },
  });

  if (!user) {
    res.status(403).json({
      message: "Email or password Invalid",
    });
  }

  const token = jwt.sign({ userId: user?.id }, JWT_TOKEN);
  res.json({
    token,
  });
});

app.post("/room", authMiddleware, async (req: Request, res: Response) => {
  const parsedData = CreateRoomSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: "Invalid Inputs",
      error: parsedData.error,
    });
    return;
  }

  try {
    const room = await prismaClient.room.create({
      data: {
        slug: parsedData.data.name,
        adminId: req.userId,
      },
    });
    res.json({
      roomID: room.id,
    });
  } catch (e) {
    return res.status(411).json({
      message: "Room already exists with that name",
    });
  }
});

app.listen(3001, () => console.log("Server is running port port 3001"));
