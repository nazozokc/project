import express, { Request, Response } from "express";
const app = express();
app.use(express.json());

type memo = {
  id: number;
  text: string;
  tags: string[];
  createAt: string;
};

let memos: memo[] = [];
let nextId = 1;

app.get("/api/memo", (req: Request, res: Response) => {
  res.json(memos);
});

app.post("/api/memo", (req: Request, res: Response) => {
  const id = Number(req.params.id);
});
