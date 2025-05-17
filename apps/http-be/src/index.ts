import express, { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";

const bcryptPass = "ajsghfajf";
const jwtSecret = "a;kshncib ";
const app = express();
app.use(express.json());

const userSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(6),
});

app.post("/signup", async (req, res) => {
  const parsed = userSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid input" });
  }
  const { username, password } = parsed.data;
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
      username,
      encryptedPassword,
    });
    res.status(201).json({ message: "User created successfully" });
  }
});

app.post("/signin", async (req, res) => {
  const parsed = userSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid input" });
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
