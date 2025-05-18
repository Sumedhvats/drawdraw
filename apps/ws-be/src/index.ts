import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import {jwtSecret} from "@repo/be-config/config"
const wss = new WebSocketServer({ port: 8080 });
wss.on("connection", (ws) => {
  const url = ws.url;
  if (!url) {
    return;
  }
  const queryParam = new URLSearchParams(url.split("?")[1]);
  const token = queryParam.get("token") as string;
  const decoded = jwt.verify(token, jwtSecret);
  if (!decoded || !(decoded as JwtPayload).userId) {
    ws.close();
    return;
  }
  ws.on("message", (data) => {
    ws.send("pong ");
  });
});
