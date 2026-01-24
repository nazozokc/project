import express, { Request, Response } from "express";
import fs from "fs";

const app = express();
app.use(express.json());

/* =====================
   型定義（ここがTSの肝）
   ===================== */
type AccessLog = {
  count: number;
  updatedAt: string;
};

/* =====================
   設定
   ===================== */
const FILE_PATH = "./history.json";

/* =====================
   JSONから読み込み
   ===================== */
const loadLog = (): AccessLog => {
  // ファイルがなければ初期値
  if (!fs.existsSync(FILE_PATH)) {
    return {
      count: 0,
      updatedAt: "",
    };
  }

  const data = fs.readFileSync(FILE_PATH, "utf-8");
  const parsed = JSON.parse(data);

  // 最低限の型チェック
  return {
    count: typeof parsed.count === "number" ? parsed.count : 0,
    updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : "",
  };
};

/* =====================
   JSONに保存
   ===================== */
const saveLog = (log: AccessLog): void => {
  fs.writeFileSync(FILE_PATH, JSON.stringify(log, null, 2));
};

/* =====================
   起動時に読み込み
   ===================== */
let log: AccessLog = loadLog();

/* =====================
   現在のアクセス数取得
   ===================== */
app.get("/api/access/log", (req: Request, res: Response) => {
  res.json(log);
});

/* =====================
   アクセス +1
   ===================== */
app.post("/api/access", (req: Request, res: Response) => {
  log.count++;
  log.updatedAt = new Date().toISOString();

  saveLog(log);
  res.json(log);
});

/* =====================
   リセット
   ===================== */
app.post("/api/access/reset", (req: Request, res: Response) => {
  log = {
    count: 0,
    updatedAt: new Date().toISOString(),
  };

  saveLog(log);
  res.json(log);
});

/* =====================
   サーバー起動
   ===================== */
app.listen(3000, () => {
  console.log("Access Log API running");
});
