import { WebSocketServer } from "ws";
import jwt, { JwtPayload, verify } from "jsonwebtoken";
import { JWT_TOKEN } from "@repo/backend-common/config";
import type { WebSocket as WsWebSocket } from "ws";
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws: WsWebSocket;
  userId: string;
  rooms: string[];
}

const users: User[] = [];

const authenticateUser = (token: string) => {
  try {
    const verified = jwt.verify(token, JWT_TOKEN) as JwtPayload;
    if (!verified.userId) {
      return null;
    } else {
      return verified.userId;
    }
  } catch (e) {
    return null;
  }
};

wss.on("connection", function connection(ws, reqeust) {
  const requestUrl = reqeust.url;
  if (!requestUrl) {
    return;
  }
  const queryParams = new URLSearchParams(requestUrl?.split("?")[1]);
  const token = queryParams.get("token") ?? "";
  const userId = authenticateUser(token);
  if (!userId) {
    ws.close();
    return;
  }

  users.push({
    ws,
    rooms: [],
    userId,
  });
  ws.on("message", async function message(data) {
    const parsedData = JSON.parse(data as unknown as string);

    if (parsedData.type === "join_room") {
      const user = users.find((user) => user.ws == ws);
      user?.rooms.push(parsedData.roomId);
    }

    if (parsedData.type === "leave_room") {
      const user = users.find((user) => user.ws == ws);
      if (user) {
        user.rooms = user?.rooms.filter(
          (roomId) => roomId !== parsedData.roomId,
        );
      }
    }

    if (parsedData.type === "chat") {
      const roomId = parsedData.roomId;
      const message = parsedData.message;

      try {
        await prismaClient.chat.create({
          data: {
            message,
            roomId,
            userId,
          },
        });

        users.forEach((user) => {
          if (user.rooms.includes(roomId)) {
            user.ws.send(
              JSON.stringify({
                type: "chat",
                roomId,
                message,
              }),
            );
          }
        });
      } catch (e) {
        console.log(e);
      }
    }
  });
});
