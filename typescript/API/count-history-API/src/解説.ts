// Express本体と、型定義（Request / Response）を読み込む
import express, { Request, Response } from "express";

// Node.js標準のファイル操作モジュール
import fs from "fs";

// Expressアプリを作成
const app = express();

// JSON形式のリクエストボディを自動で解析できるようにする
// これがないと req.body が undefined になる
app.use(express.json());

/* =====================
   設定
   ===================== */

// カウントを保存するJSONファイルのパス
// このファイルが「簡易データベース」代わり
const FILE_PATH = "./count.json";

/* =====================
   JSONから読み込む
   ===================== */

// JSONファイルからカウントを読み込む関数
function loadCount(): number {
  // ファイルが存在しない場合（初回起動など）
  if (!fs.existsSync(FILE_PATH)) {
    // まだ保存データがないので 0 からスタート
    return 0;
  }

  // JSONファイルを文字列として読み込む
  const data = fs.readFileSync(FILE_PATH, "utf-8");

  // 文字列 → JavaScriptオブジェクトに変換
  const parsed = JSON.parse(data);

  // parsed.count が number ならそれを使う
  // それ以外（壊れたJSONなど）の場合は 0 にする
  return typeof parsed.count === "number" ? parsed.count : 0;
}

/* =====================
   JSONに保存
   ===================== */

// 現在のカウントをJSONファイルに保存する関数
function saveCount(count: number) {
  fs.writeFileSync(
    FILE_PATH,
    // { count: 数値 } という形でJSON化
    // null, 2 は「見やすく整形する」ため
    JSON.stringify({ count }, null, 2),
  );
}

/* =====================
   起動時に読み込み
   ===================== */

// サーバー起動時にJSONからカウントを読み込む
// これにより「再起動しても値が残る」
let count: number = loadCount();

/* =====================
   現在のカウント取得
   ===================== */

// GET /api/count
// 現在のカウント値を取得するAPI
app.get("/api/count", (req: Request, res: Response) => {
  // { count: 数値 } の形で返す
  res.json({ count });
});

/* =====================
   +1
   ===================== */

// POST /api/count/increment
// カウントを +1 するAPI
app.post("/api/count/increment", (req: Request, res: Response) => {
  // メモリ上のカウントを増やす
  count++;

  // 変更後の値をJSONファイルに保存
  saveCount(count);

  // 最新のカウントを返す
  res.json({ count });
});

/* =====================
   -1
   ===================== */

// POST /api/count/decrement
// カウントを -1 するAPI
app.post("/api/count/decrement", (req: Request, res: Response) => {
  // メモリ上のカウントを減らす
  count--;

  // 変更後の値をJSONに保存
  saveCount(count);

  // 最新のカウントを返す
  res.json({ count });
});

/* =====================
   リセット
   ===================== */

// POST /api/count/reset
// カウントを 0 に戻すAPI
app.post("/api/count/reset", (req: Request, res: Response) => {
  // カウントを初期値に戻す
  count = 0;

  // JSONファイルにも反映
  saveCount(count);

  // リセット後の値を返す
  res.json({ count });
});

/* =====================
   サーバー起動
   ===================== */

// ポート3000でサーバーを起動
app.listen(3000, () => {
  console.log("Counter API with JSON storage running");
});
