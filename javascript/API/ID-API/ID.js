const express = require("express");
const app = express();
app.use(express.json());

let ids = [];
let nextId = 1;

app.get("/api/ids", (req, res) => {
  res.json(ids);
});

app.post("/api/ids", (req, res) => {
  const item = {
    id: nextId++,
    text: req.body.text,
  };

  ids.push(item);
  res.status(201).json(item);
});

app.delete("/api/ids/:id", (req, res) => {
  const id = Number(req.params.id);
  ids = ids.filter((r) => r.id !== id);
  if (ids.length === before) {
    return res.status(404).json({ error: "not found" });
  }
  res.status(204).end();
});

app.listen(3000, () => {
  console.log("enable!!");
});
