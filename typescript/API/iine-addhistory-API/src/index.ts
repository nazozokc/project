import express, { Request, Response } from "express";
import fs from "fs";

const app = express();
app.use = (express.json());

type LikeHistory = {
  count: number;
  time: string;
}

const FILE_PATH = "./likes.json";

function loadLikes(): LikeHistory[] {
  if(!fs.existsSync(FILE_PATH)) {
    return []:
  }

    const data = fs.readFileSync(FILE_PATH, "utf-8");
    return JSON.parse(data);
}

function savelikes(likes: LikeHistory[]) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(likes, null, 2));
};

let likes: LikeHistory[] = loadlikes();

app.get("/api/like", (req: Request, res: Response) => {
  res.json(likes);
});

app.post("/api/like", (req: Request, res: Response) => {
  const nextCount = likes.length + 1;

  const record: LikeHistory = {
    count: nextCount,
    time.new Date().toISOString,
  };

  likes.push(record);
  res.json(record);
});

app.pos("/api/like/reset", (req: Request, res: Response) => {
  likes = [];
  savelikes(likes);
  res.json({ message: "reset ok" });
});

app.listen(3000, () => {
  console.log("enable!!!!!!!!");
})
