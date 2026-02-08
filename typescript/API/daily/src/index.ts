import express, { Request, Response } from "express";
const app = express();
app.use(express.json());

type Diary = {
  id: number;
  title: string;
  body: string;
};

const diaries: Diary[] = [];
let nextId = 1;

app.get("/api/diaries", (req: Request, res:Response) => {
  res.json(diaries);
})

app.post("/api/diaries", (req: Request, res: Response)=> {
  const { title, body } = req.body as = {
    title?: string;
    body?: string;
  };

  if(!title || !body){
    return res.status(404).json({error: "title and body required"});
  };

  const diary: Diary = {
    id: nextId++,
    title,
    body,
  };

  diaries.push(diary);
  res.status(201).json(diary);
});

app.delete("/api/diaries/:id", (req: Request, res: Response) => {
  const number = Number(req.params.id);
  const before = diary.length;

  diaries = diaries.filter(r => r.id !== id);

  if(!before){
    return res.status(404).json({error: "not found"});
  }

  res.status(204).end();
})

app.listen(3000, () => {
  console.log("enable!!!");
});

