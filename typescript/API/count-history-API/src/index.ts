import express, { Request, Response } from "express";
import fs from "fs";

const app = express();
app.use(express.json());

const FILE_PATH = "./count.json";

function loadCount(): number {
  if (!fs.existsSync(FILE_PATH)) {
    return 0;
  }

  const data = fs.readFileSync(FILE_PATH, "utf-8");
  const parsed = JSON.parse(data);

  return typeof parsed.count === "number" ? parsed.count : 0;
}

function saveCount(count: number) {
  fs.writeFileSync(FILE_PATH, JSON.stringify({ count }, null, 2));
}

let count: number = loadCount();

app.get("/api/count", (req: Request, res: Response) => {
  res.json({ count });
});

app.post("/api/count/add", (req: Request, res: Response) => {
  count++;
  saveCount(count);
  res.json({ count });
});

app.post("/api/count/minus", (req: Request, res: Response) => {
  count--;
  saveCount(count);
  res.json({ count });
});

app.post("/api/count/reset", (req: Request, res: Response) => {
  count = 0;
  saveCount(count);
  res.json({ count });
});

app.listen(3000, () => {
  console.log("enablee!!!!");
});
