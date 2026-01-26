import express, { Request, Response } from "express";
import fs, { existsSync } from "fs";
import crypto from "crypto";

const app = express();
app.use(express.json());

type User = {
  id: number;
  username: string;
  password: string;
};

type AuthToken = {
  token: string;
  userId: number;
  createdAt: string;
};

const FILE_PATH = "./tokens.json";

const loadtoken = (): AuthToken => {
  if (!fs.existsSync(FILE_PATH)) {
    return {
      token: "",
      userId: 0,
      createdAt: "",
    }
  };

  const data = fs.readFileSync(FILE_PATH, "utf-8");

  const parsed = JSON.parse(data);

  return {
    token: typeof parsed.token === "string" ? parsed.token : "",
    userId: typeof parsed.userId === "number" ? parsed.userId : 0,
    createdAt: typeof parsed.createdAt === "string" ? parsed.createdAt : "",
  };
}

const saveLog = (log: AuthToken): void => {
  fs.writeFileSync(
    FILE_PATH,
    JSON.stringify(log, null, 2),
  );
};

let token: AuthToken = loadtoken();

app.get("/api/token", (req: Request, res: Response) => {
  res.json({ token });
})

app.post("/api/token", (req: Request, res: Response) => {})
