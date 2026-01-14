const express = require("express");
const app = express();
app.use(express.json());

let todos = [];
let nextId = 1;

app.get("/api/todos", (req, res) => {
  res.json(todos);
});

app.post("/api/todos", (req, res) => {
  const todo = {
    id: nextId++,
    title: req.body.title,
    done: false,
  };
  todos.push(todo);
  res.status(201).json(todo);
});

app.put("/api/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    return res.status(404).json({ error: "not found " });
  }

  const { done } = req.body;
  if (typeof done !== "boolean") {
    return res.status(400).json({ error: "done must be boolean" });
  }

  todo.done = req.body.done;
  res.json(todo);
});

app.delete("/api/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  todos = todos.filter((r) => r.id !== id);
  if (before === todos.length) {
    return res.status(404).json({ error: "not found" });
  }

  res.status(204).end();
});

app.listen(3000, () => {
  console.log("todos-API-server enable now!!!");
});
