import express, { Request, Response } from "express";

const app = express();
app.use(express());

let count: number = 0;

app.get("/api/count", (req: Request, res: Response) => {
  res.json({ count });
});

app.post("/api/count/add", (req: Request, res: Response) => {
  count++;
  res.json({ count });
});

app.post("/api/count/minus", (req: Request, res: Response) => {
  count--;
  res.json({ count });
});

app.post("/api/count/reset", (req: Request, res: Response) => {
  count = 0;
  res.json({ count });
});

app.listen(3000, () => {
  console.log("enable!!!!");
});