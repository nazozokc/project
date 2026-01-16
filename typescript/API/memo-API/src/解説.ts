// Express本体と、型（Request, Response）を読み込む
import express, { Request, Response } from "express";

// Expressアプリを作成
const app = express();

// JSON形式のリクエストボディを自動で解析するミドルウェア
// これがないと req.body が undefined になる
app.use(express.json());

// メモ1件の「型（設計図）」を定義
type Memo = {
  id: number; // メモの一意なID
  text: string; // メモ本文
  tags: string[]; // タグ（複数）
  createdAt: string; // 作成日時（ISO文字列）
};

// メモを保存する配列（DB代わり）
// 「Memo型の配列しか入らない」とTypeScriptが保証
let memos: Memo[] = [];

// 次に使うID（自動インクリメント）
let nextId = 1;

/* =========================
   メモ一覧取得
   ========================= */
app.get("/api/memos", (req: Request, res: Response) => {
  // 今あるメモ全部をJSONで返す
  res.json(memos);
});

/* =========================
   メモ1件取得
   ========================= */
app.get("/api/memos/:id", (req: Request, res: Response) => {
  // URLの :id を数値に変換
  const id = Number(req.params.id);

  // IDが一致するメモを探す
  const memo = memos.find((m) => m.id === id);

  // 見つからなかった場合
  if (!memo) {
    return res.status(404).json({ error: "not found" });
  }

  // 見つかったメモを返す
  res.json(memo);
});

/* =========================
   メモ作成
   ========================= */
app.post("/api/memos", (req: Request, res: Response) => {
  // req.body の中身を「こういう形だ」と明示
  const { text, tags } = req.body as {
    text?: string;
    tags?: string[];
  };

  // text がなければエラー
  if (!text) {
    return res.status(400).json({ error: "text required" });
  }

  // 新しいメモを作成
  const memo: Memo = {
    id: nextId++, // IDを割り当てて増やす
    text, // 本文
    tags: Array.isArray(tags) ? tags : [], // tagsが配列でなければ空配列
    createdAt: new Date().toISOString(), // 現在時刻
  };

  // メモを保存
  memos.push(memo);

  // 作成成功（201）と作成したメモを返す
  res.status(201).json(memo);
});

/* =========================
   メモ更新
   ========================= */
app.put("/api/memos/:id", (req: Request, res: Response) => {
  // 更新対象のID取得
  const id = Number(req.params.id);

  // 対象メモを探す
  const memo = memos.find((m) => m.id === id);

  // なければ404
  if (!memo) {
    return res.status(404).json({ error: "not found" });
  }

  // textが文字列なら更新
  if (typeof req.body.text === "string") {
    memo.text = req.body.text;
  }

  // tagsが配列なら更新
  if (Array.isArray(req.body.tags)) {
    memo.tags = req.body.tags;
  }

  // 更新後のメモを返す
  res.json(memo);
});

/* =========================
   メモ削除
   ========================= */
app.delete("/api/memos/:id", (req: Request, res: Response) => {
  // 削除対象ID
  const id = Number(req.params.id);

  // 削除前の件数
  const before = memos.length;

  // 指定ID以外のメモだけ残す
  memos = memos.filter((m) => m.id !== id);

  // 件数が変わってなければ削除失敗
  if (before === memos.length) {
    return res.status(404).json({ error: "not found" });
  }

  // 削除成功（返すものなし）
  res.status(204).end();
});

/* =========================
   サーバー起動
   ========================= */
app.listen(3000, () => {
  console.log("Memo API (TS) running");
});
