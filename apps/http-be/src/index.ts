import express, { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { jwtSecret } from "@repo/be-config/config";
import { prismaClient as db } from "@repo/database/client";
import {
  CreateUserSchema,
  SighinUserSchema,
  CreateRoomSchema,
} from "@repo/common/types";

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  const parsed = CreateUserSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid input" });
  }

  const { name, username, password } = parsed.data;
  const user = await db.user.findUnique({ where: { username } });
  if (user) {
    res.status(400).json({
      message: "user already exists",
    });
  } else {
    const encryptedPassword = await bcrypt.hash(password, 5);
   await db.user.create({
      data: {
        name,
        username,
        password: encryptedPassword,
      },
    });
    res.status(201).json({ message: "User created successfully" });
  }
});

app.post("/signin", async (req, res) => {
  const parsed = SighinUserSchema.safeParse(req.body);
  if (!parsed.success || !parsed.data) {
    res.status(400).json({ message: "Invalid input" });
  }
  const { username, password } = parsed.data;
  const user = await db.user.findUnique({ where: { username } });

  if (!user) {
    res.status(400).json({
      message: "user not found",
    });
  } else {
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      res.status(401).json({
        message: "unauthorised access",
      });
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
  }
});
function auth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: "Please login" });
    return
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
     res.status(401).json({ message: "Token missing" });
     return
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    // @ts-ignore
    req.user = decoded;
    next();
  } catch (err) {
     res.status(403).json({ message: "Invalid token" });
     return
  }
}


app.get("/createRoom", auth, (req: Request, res: Response) => {
  const parsed = CreateRoomSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid input" });
  }
  const roomId = (Math.random() + 1).toString(36).substring(4);
});

app.listen(3002, () => {
  console.log("Server running on http://localhost:3002");
});
