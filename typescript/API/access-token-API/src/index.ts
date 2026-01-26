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
  userId: number;
  createdAt: string;
};

const FILE_PATH = "./tokens.json";

const loaduser = (): User => {
  if (!fs.existsSync(FILE_PATH)) {
    return {
      id: 0,
      username: "",
      password: "",
    }
  };

  const data = fs.readFileSync(FILE_PATH, "utf-8");

  const parsed = JSON.parse(data);

  return {
    id: typeof parsed.id === "number" ? parsed.id : 0,
    username: typeof parsed.username === "string" ? parsed.username : "",
    password: typeof parsed.password === "string" ? parsed.password : "",
  };
}


const loadtoken = (): AuthToken => {
  if (!fs.existsSync(FILE_PATH)) {
    return {
      userId: 0,
      createdAt: "",
    }
  };

  const data = fs.readFileSync(FILE_PATH, "utf-8");

  const parsed = JSON.parse(data);

  return {
    userId: typeof parsed.userId === "number" ? parsed.userId : 0,
    createdAt: typeof parsed.createdAt === "string" ? parsed.createdAt : "",
  };
}

const saveLog = (log: AuthToken, user: User): void => {
  fs.writeFileSync(
    FILE_PATH,
    JSON.stringify(log, user, null, 3),
  );
};

let token: AuthToken = loadtoken();
let user: User = loaduser();

app.get("/api/token", (req: Request, res: Response) => {
  res.json({ token });
  res.json({ user });
})

app.post("/api/token", (req: Request, res: Response) => {
  const {username, password} = req.body as {
    username?: string;
    password?: string;
  };

  if (!username || !password) {
    res.status(400).json({ error: "username and password required"})
  }

  const NewUser: User = {
    id: nextId++,            // 自動でID振る
    username,                 // リクエストから取得
    password,                   // リクエストから取得
  };

  const NewToken: AuthToken = {
    userId: nextId++,
    createdAt: new Date().toISOString(),
  };
  
user.push(NewUser);
token.push(NewToken);

savelog(user, token);

res.status(201).json(NewUser, NewToken);
})

app.delete("/api/token/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const before = {user.length, token.length};
  user = user.filter(e => e.id !== id);   // 指定ID以外を残す
  token = token.filter(n => n.id !== id);
  savelog(user, token); 

  if(before === {users.length, token.length}) {
    return res.status(404).json({error:"not found"})
  };

  res.json(204).end();
})

app.listen(3000, () => {
  console.log("enable!!!");
})
