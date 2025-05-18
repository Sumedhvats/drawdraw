import express, { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import {jwtSecret} from "@repo/be-config/config"
import {CreateUserSchema,SighinUserSchema,CreateRoomSchema} from "@repo/common/types"

const app = express();
app.use(express.json());


app.post("/signup", async (req, res) => {

  const parsed = CreateUserSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid input" });
  }
  const {name, username, password }   = parsed.data;
  const user = db.findOne({
    username,
  });
  if (user) {
    res.status(400).json({
      message: "user already exists",
    });
  } else {
    const encryptedPassword = await bcrypt.hash(password, 5);
    db.create({
      name,
      username,
      encryptedPassword,
    });
    res.status(201).json({ message: "User created successfully" });
  }
});

app.post("/signin", async (req, res) => {
 
  const parsed = SigninSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid input" });
  }
  const { username, password } = parsed.data;
  const user = db.findOne({
    username,
  });
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
    const token = jwt.sign(username, jwtSecret);
    res.status(200).json({
      message: "successfully logged in",
      Authorisation: "Bearer " + token,
    });
  }
});

function auth(req: Request, res: Response, next: NextFunction) {
  
  const parsed = CreateRoomSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid input" });
  }

  if (!req.headers.authorization)
    res.status(401).json({ message: "please login" });
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  try {
    const decoded = jwt.verify(token as string, jwtSecret);
    // @ts-ignore
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
}

app.get("/createRoom", auth, (req: Request, res: Response) => {
  const roomId = (Math.random() + 1).toString(36).substring(4);
});

app.listen(3002, () => {
  console.log("Server running on http://localhost:3002");
});
