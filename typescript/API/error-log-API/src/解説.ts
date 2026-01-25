import express, { Request, Response } from "express"; // express本体と型をインポート
import fs from "fs"; // ファイル操作用モジュール

const app = express(); // Expressアプリの作成
app.use(express.json()); // JSON形式のリクエストボディを自動でパース

// =====================
// 型定義（TypeScriptの肝）
// =====================
type ErrorLog = {
  id: number;                     // 各エラーの識別用ID
  message: string;                // エラーメッセージ
  level: "error" | "warn" | "info"; // エラーレベル
  time: string;                   // 発生日時（ISO文字列）
};

// JSONファイルの保存先パス
const FILE_PATH = "./errors.json";

// =====================
// JSONファイルから読み込み
// =====================
const loadErrors = (): ErrorLog[] => {
  if (!fs.existsSync(FILE_PATH)) return []; // ファイルがなければ空配列を返す

  const data = fs.readFileSync(FILE_PATH, "utf-8"); // ファイル読み込み（文字列）
  return JSON.parse(data) as ErrorLog[];            // JSON文字列 → JSオブジェクトに変換＆型アサーション
};

// =====================
// JSONファイルに保存
// =====================
const saveErrors = (errors: ErrorLog[]): void => {
  fs.writeFileSync(
    FILE_PATH,
    JSON.stringify(errors, null, 2) // JSONに変換してファイルに保存（見やすく整形）
  );
};

// =====================
// メモリ上のエラー配列
// =====================
let errors: ErrorLog[] = loadErrors(); // 起動時にファイルから読み込み
let nextId = errors.length 
  ? Math.max(...errors.map(e => e.id)) + 1 // すでにデータがあれば最大ID+1
  : 1;                                     // 初回は1から

// =====================
// エラー一覧取得 API
// GET /api/error
// =====================
app.get("/api/error", (req: Request, res: Response) => {
  res.json(errors); // メモリ上の配列をそのまま返す
});

// =====================
// 新しいエラー追加 API
// POST /api/error
// body: { message: string, level: "error" | "warn" | "info" }
// =====================
app.post("/api/error", (req: Request, res: Response) => {
  // req.body の型を教える（message, levelがあるかもしれない）
  const { message, level } = req.body as {
    message?: string;
    level?: "error" | "warn" | "info";
  };

  // バリデーション: 必須項目がない場合は400返す
  if (!message || !level) {
    return res.status(400).json({ error: "message and level are required" });
  }

  // 新しいエラーオブジェクト作成
  const newError: ErrorLog = {
    id: nextId++,            // 自動でID振る
    message,                 // リクエストから取得
    level,                   // リクエストから取得
    time: new Date().toISOString(), // 現在時刻をISO形式で
  };

  errors.push(newError);    // メモリ上の配列に追加
  saveErrors(errors);       // ファイルに保存

  res.status(201).json(newError); // 作成したオブジェクトを返す（201 Created）
});

// =====================
// 特定のエラー削除 API
// DELETE /api/error/:id
// =====================
app.delete("/api/error/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);           // URLパラメータを数字に変換
  const before = errors.length;               // 削除前の長さ
  errors = errors.filter(e => e.id !== id);   // 指定ID以外を残す
  saveErrors(errors);                         // ファイルに保存

  if (before === errors.length) {             // 削除できなかった場合
    return res.status(404).json({ error: "not found" });
  }

  res.status(204).end();                      // 成功したら204 No Content
});

// =====================
// サーバー起動
// =====================
app.listen(3000, () => {
  console.log("ErrorLog API running on http://localhost:3000");
});

