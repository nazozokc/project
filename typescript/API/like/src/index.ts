import express, { Request, Response } from "express";
const app = express();
app.use(express.json());

type likes = {
  count: number;
}

let like: likes = {
  count = 0;
}

app.get("/api/like", (req: Request, res: Response) => {
  res.json(like);
})

app.post("/api/like", (req: Request, res: Response) => {
  let count += 1;
  res.json(like);
});

app.post("/api/like/reset", (req: Request, res: Response) => {
  let count = 0;
  res.json(like);
});

app.listen(3000, () => {
  console.log("enable!!!");
});
