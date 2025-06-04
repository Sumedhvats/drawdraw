import { WebSocket, WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { jwtSecret } from "@repo/be-config/config";
import { prismaClient as db } from "@repo/database/client";

interface User {
  ws: WebSocket;
  rooms: number[];
  userId: string;
}

const users: User[] = [];
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection",(ws, request) => {
  console.log("someone tried to connect");
  
  function checkUser(token: string): string | null {
    try {
      const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
      
      return decoded.userId || null;
    } catch {
      return null;
    }
  }

  const url = request.url;
  if (!url) {
    ws.close();
    return;
  }

  const queryParam = new URLSearchParams(url.split("?")[1]);
  const token = queryParam.get("token");
  const userId = token ? checkUser(token) : null;

  if (!userId) {
    ws.send("Unauthorized. Closing connection.");
    ws.close();
    return;
  }

  const user: User = { userId, rooms: [], ws };
  users.push(user);

  

  ws.on("message",async  (data) => {
    console.log(data.toString());
    
    let parsedData;
    try {
      parsedData = JSON.parse(data.toString());
      console.log("parsed date: "+parsedData);
    } catch {
      return;
    }

    if (parsedData.type === "join_room") {
      
      user.rooms.push(parsedData.roomId);
console.log("joined a room");

      
      ws.send("connected")
    }

    if (parsedData.type == "leave_room") {
      user.rooms = user.rooms.filter((roomId) => roomId !== parsedData.roomId);
      ws.send("diconnected")
    }

    if (parsedData.type == "chat") {

       await db.chat.create({
        data: {
          roomId: Number(parsedData.roomId),
          message:parsedData.message,
          userId
        }
      });
      console.log("created chat on db");
      


      users.forEach((u) => {
        if (u.rooms.includes(parsedData.roomId)) {
          u.ws.send(
            JSON.stringify({
              type: "chat",
              message: parsedData.message,
              roomId: parsedData.roomId,
            })
          );
        }
      });
    }
  });

  ws.on("close", () => {
    const index = users.findIndex((u) => u.ws === ws);
    if (index !== -1) users.splice(index, 1);
  });
});
