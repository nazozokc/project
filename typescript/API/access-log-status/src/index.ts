import express, { Request, Response } from "express";
import fs from "fs";
const app = express();
app.use(express.json());

const FILE_PATH = "./history.json";

const loadCount = () => {
  if (!fs.existsSync(FILE_PATH)) {
    return { count: 0, updatedAt: "" };
  }

  const data = fs.readFileSync(FILE_PATH, "utf-8");
  const parsed = JSON.parse(data);

  return typeof parsed.count === "number" ? parsed.count : 0;
};

const saveCount = (count: number) => {
  fs.writeFileSync(
    FILE_PATH,
    JSON.stringify({ count, updatedAt: new Date().toISOString() }, null, 2),
  );
};

let count: number = loadCount();

app.get("/api/access/count", (req: Request, res: Response) => {
  res.json({ count });
});

app.post("/api/access", (req: Request, res: Response) => {
  count++;
  saveCount(count);
  res.json({ count });
});

app.post("/api/access/reset", (req: Request, res: Response) => {
  count = 0;
  saveCount(count);
  res.json({ count });
});

app.listen(3000, () => {
  console.log("enable!!!");
});
