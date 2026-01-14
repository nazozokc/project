import express, { Request, Response } from "express";

const app = express();
app.use(express());

type Todo = {
  id: number;
  text: string;
};

type CreateTodoBody = {
  text?: string;
};

let todos: Todo[] = [];
let nextId = 1;

app.get("/api/todos", (req: Request, res: Response) => {
  res.json(todos);
});

app.post("/api/todos", (req: Request, res: Response) => {
  const body = req.body as CreateTodoBody;
  if (!body.text) {
    return res.status(400).json({ error: "text is required" });
  }

  const todo: Todo = {
    id: nextId++,
    text: body.text,
  };

  todos.push(todo);
  res.status(201).json(todo);
});

app.delete("/api/todos/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const before = todos.length;

  todos = todos.filter((t) => t.id !== id);

  if (todos.length === before) {
    return res.status(404).json({ error: "not found" });
  }

  res.status(204).end();
});

app.listen(3000, () => {
  console.log("enable!!!");
});
