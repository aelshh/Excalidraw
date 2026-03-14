import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_TOKEN } from "@repo/backend-common/config";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws, reqeust) {
  const requestUrl = reqeust.url;
  if (!requestUrl) {
    return;
  }
  const queryParams = new URLSearchParams(requestUrl?.split("?")[1]);
  const token = queryParams.get("token") ?? "";
  const verfied = jwt.verify(token, JWT_TOKEN) as JwtPayload;
  if (!verfied || verfied.userId) {
    ws.close();
    return;
  }
  ws.on("message", function message(data) {
    ws.send("pong");
  });
});
