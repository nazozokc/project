// Express本体と、型（Request, Response）を読み込む
import express, { Request, Response } from "express";

// Node.js標準のファイル操作モジュール
import fs from "fs";

// Expressアプリを作成
const app = express();

// JSON形式のリクエストボディを自動で解析するミドルウェア
// これがないと req.body が undefined になる
app.use(express.json());

/* =====================
   型定義（TypeScriptの重要ポイント）
   ===================== */

// 「アクセスログはこういう形ですよ」とTSに教える
// count: アクセス数
// updatedAt: 最後に更新された日時（ISO文字列）
type AccessLog = {
  count: number;
  updatedAt: string;
};

/* =====================
   設定
   ===================== */

// アクセス数を保存するJSONファイルのパス
const FILE_PATH = "./history.json";

/* =====================
   JSONから読み込み
   ===================== */

// JSONファイルを読み込んで AccessLog を返す関数
const loadLog = (): AccessLog => {
  // ファイルが存在しない（初回起動など）の場合
  if (!fs.existsSync(FILE_PATH)) {
    // 初期状態を返す
    return {
      count: 0,
      updatedAt: "",
    };
  }

  // JSONファイルを文字列として読み込む
  const data = fs.readFileSync(FILE_PATH, "utf-8");

  // JSON文字列 → JavaScriptオブジェクトに変換
  const parsed = JSON.parse(data);

  // 型チェックをしながら安全に値を取り出す
  return {
    // parsed.count が number なら使う、違えば 0
    count: typeof parsed.count === "number" ? parsed.count : 0,

    // parsed.updatedAt が string なら使う、違えば空文字
    updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : "",
  };
};

/* =====================
   JSONに保存
   ===================== */

// AccessLog型のデータをJSONファイルに保存する関数
const saveLog = (log: AccessLog): void => {
  fs.writeFileSync(
    FILE_PATH,

    // { count, updatedAt } をJSONに変換
    // null, 2 は「見やすく整形する」指定
    JSON.stringify(log, null, 2),
  );
};

/* =====================
   起動時に読み込み
   ===================== */

// サーバー起動時にJSONから読み込んだデータを
// メモリ（変数 log）に保持する
let log: AccessLog = loadLog();

/* =====================
   現在のアクセス数取得
   ===================== */

// GET /api/access/log
// 今のアクセス数と更新日時をそのまま返す
app.get("/api/access/log", (req: Request, res: Response) => {
  res.json(log);
});

/* =====================
   アクセス +1
   ===================== */

// POST /api/access
// アクセスがあったことを想定してカウントを増やす
app.post("/api/access", (req: Request, res: Response) => {
  // メモリ上のカウントを +1
  log.count++;

  // 更新日時を現在時刻にする
  log.updatedAt = new Date().toISOString();

  // 最新の状態をJSONファイルに保存
  saveLog(log);

  // 更新後のデータを返す
  res.json(log);
});

/* =====================
   リセット
   ===================== */

// POST /api/access/reset
// カウントを0に戻す
app.post("/api/access/reset", (req: Request, res: Response) => {
  // メモリ上のデータを初期化
  log = {
    count: 0,
    updatedAt: new Date().toISOString(),
  };

  // JSONファイルにも保存
  saveLog(log);

  // リセット後の状態を返す
  res.json(log);
});

/* =====================
   サーバー起動
   ===================== */

// ポート3000でAPIサーバーを起動
app.listen(3000, () => {
  console.log("Access Log API running");
});
