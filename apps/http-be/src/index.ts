import express, { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtSecret } from "@repo/be-config/config";
import { prismaClient as db } from "@repo/database/client";
import {
  CreateUserSchema,
  SighinUserSchema,
  CreateRoomSchema,
} from "@repo/common/types";

const app = express();
app.use(express.json());

app.post("/signup", async (req: Request, res: Response): Promise<void> => {
  const parsed = CreateUserSchema.safeParse(req.body);
  console.log(req.body);

  if (!parsed.success) {
    res.status(400).json({ message: "Invalid input" });
    return;
  }

  const { name, username, password } = parsed.data;
  const user = await db.user.findFirst({ where: { username } });

  if (user) {
    res.status(400).json({ message: "user already exists" });
    return;
  }

  const encryptedPassword = await bcrypt.hash(password, 5);
  await db.user.create({
    data: {
      name,
      username,
      password: encryptedPassword,
    },
  });

  res.status(201).json({ message: "User created successfully" });
});

app.post("/signin", async (req: Request, res: Response): Promise<void> => {
  const parsed = SighinUserSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid input" });
    return;
  }
  const { username, password } = parsed.data;
  const user = await db.user.findFirst({ where: { username } });

  if (!user) {
    res.status(400).json({ message: "user not found" });
    return;
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    res.status(401).json({ message: "unauthorised access" });
    return;
  }

  const token = jwt.sign(
    { userId: user.id, username: user.username },
    jwtSecret,
    { expiresIn: "7d" }
  );

  res.status(200).json({
    message: "successfully logged in",
    Authorisation: "Bearer " + token,
  });
});

function auth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization as string;
  if (!authHeader) {
    res.status(401).json({ message: "Please login" });
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Token missing" });
    return;
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    (req as any).user = decoded;
    //@ts-ignore
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(403).json({ message: "Invalid token" });
  }
}

app.post(
  "/createRoom",
  auth,
  async (req: Request, res: Response): Promise<void> => {
    const parsed = CreateRoomSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: "Invalid input" });
      return;
    }
    //@ts-ignore
    const userId = req.userId;

    const room = await db.room.create({
      data: {
        slug: parsed.data.name,
        adminId: userId,
      },
    });

    res.status(201).json({ message: "Room created", roomId: room.id });
  }
);

app.get("/chats", auth, async (req: Request, res: Response): Promise<void> => {
  const roomId = Number(req.params.roomId);

  try {
    const chats =await db.chat.findMany({
      where: {
        roomId: roomId,
      },
      orderBy: {
        id: "desc",
      },
      take: 50,
    });
    console.log(chats);
    
    res.status(200).json({
      chats,
    });
  } catch (e) {
    res.status(400).json({
      message: e,
    });
  }
});
app.listen(3002, () => {
  console.log("Server running on http://localhost:3002");
});

app.get("/room:slug", auth, async (req: Request, res: Response): Promise<void> => {
  const slug = req.params.roomId;
if(!slug){
  res.status(400).json({
    "message":"no slug"
  })
  return
}
  try {
    const room =await db.room.findFirst({
      where: {
        slug
      },
    });
    
    res.status(200).json({
      room,
    });
  } catch (e) {
    res.status(400).json({
      message: e,
    });
  }
});
app.listen(3002, () => {
  console.log("Server running on http://localhost:3002");
});
