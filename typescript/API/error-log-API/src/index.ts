import express, { Request, Response } from "express";
import fs from "fs";

const app = express();
app.use(express.json());

type Errorlog = {
  id: number;
  message: string;
  level: "error" | "warn" | "info";
  time: string;
};

const FILE_PATH = "./errors.json";

// JSONファイルからエラー履歴を読み込む関数
const loadErrors = (): ErrorLog[] => {
  // ファイルが存在しなければ空配列を返す
  if (!fs.existsSync(FILE_PATH)) {
    return [];
  }

  // ファイルを文字列として読み込む
  const data = fs.readFileSync(FILE_PATH, "utf-8");

  // 文字列をJSONに変換して型アサーション
  return JSON.parse(data) as ErrorLog[];
};

const saveError = (errors: Errorlog[]) => {
  fs.writeFileSync(FILE_PATH, JSON.stringify(errors, null, 2));
};

let errors: Errorlog[] = loadErrors();
let nextId = errors.length ? Math.max(...errors.map((e) => e.id)) + 1 : 1;

app.get("/api/error", (req: Request, res: Response) => {
  res.json(errors);
});

app.post("/api/error", (req: Request, res: Response) => {
  const { message, level } = req.body as {
    message?: string;
    level?: "error" | "warn" | "info";
  };

  if (!message || !level) {
    return res.status(400).json({ error: "message and level are required" });
  }

  const newError: Errorlog = {
    id: nextId,
    message,
    level,
    time: new Date().toISOString(),
  };
});
