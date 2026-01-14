const express = require("express");
const add = express();
app.use(express());

function rollDice(sides = 0) {
  return Math.floor(Math.random() * sides) + 1;
}

app.get("/api/dice", (req, res) => {
  const count = Number(req.query.count) || 1;
  const sides = Number(req.query.sides) || 6;

  if (count <= 0 || sides <= 0) {
    return res
      .status(400)
      .json({ error: "count and sides must be positive numbers" });
  }

  const results = [];
  for (let i = 0; i < count; i++) {
    results.push(rollDice(sides));
  }

  res.json({ results });
});

app.listen(3000, (req, res) => {
  console.log("diceAPI server enable now");
});
