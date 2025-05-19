import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { jwtSecret } from "@repo/be-config/config";
const wss = new WebSocketServer({ port: 8080 });
interface User{
  ws:WebSocket,
  rooms:[],
  userId:string
}


const users:User[] = []

wss.on("connection", (ws) => {
  function checkUser(token: string): string | null {
    const decoded = jwt.verify(token, jwtSecret);
    if (!decoded || !(decoded as JwtPayload).userId) {
      return null;
    } else {
      //@ts-ignore
      return decoded.userId;
    }
  }
  const url = ws.url;
  if (!url) {
    return;
  }
  const queryParam = new URLSearchParams(url.split("?")[1]);
  const token = queryParam.get("token") as string;
  const userId = checkUser(token)
    if(!userId){
      ws.close
    }
  ws.on("message", (data) => {
    ws.send("pong ");
  });
});
