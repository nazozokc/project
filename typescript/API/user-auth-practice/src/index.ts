import express, { Request, Response } from "express";
import { constrainedMemory } from "node:process";
import { compileFunction } from "node:vm";
export const app = express();
app.use(express.json());

type id = {
  id: number;
  text: string;
};

type CreateTodoBody = {
  text?: string;
};

let ids: id[] = [];
let nextId = 1;

app.get("/api/id", (req: Request, res: Response) => {
  res.json(ids);
});

app.post("/api/id", (req: Request, res: Response) => {
  const body = req.body as CreateTodoBody;
  if (!body.text) {
    return res.status(400).json({ error: "text is required" });
  }

  const item: id = {
    id: nextId++,
    text: body.text,
  };

  ids.push(item);
  res.status(201).json(item);
});

app.delete("/api/id/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const before = ids.length;

  ids = ids.filter((r) => r.id !== id);

  if (ids.length === before) {
    return res.status(404).json({ error: "not found" });
  }

  res.status(204).end();
});

