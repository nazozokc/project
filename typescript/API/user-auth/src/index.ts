// Express 本体と、型（Request / Response）を読み込む
// Request / Response は「req と res が何者か」を TS に教えるためのもの
import express, { Request, Response } from "express";

// Express アプリを作る（API の土台）
const app = express();

// JSON を自動で解析できるようにする
// これが無いと req.body が undefined になる
app.use(express.json());

// =========================
// 型定義（データの設計図）
// =========================

// Todo 1件の形を決める
// id は number、text は string
type Todo = {
  id: number;
  text: string;
};

// POST /api/todos で送られてくる body の形
// text? の ? は「無いかもしれない」という意味
type CreateTodoBody = {
  text?: string;
};

// =========================
// データ置き場（仮）
// =========================

// Todo だけが入る配列
// TS が「変なもの入れるなよ」と見張ってくれる
let todos: Todo[] = [];

// 次に使う ID（自動で増える）
let nextId = 1;

// =========================
// GET /api/todos
// =========================

// Todo の一覧を返す API
app.get("/api/todos", (req: Request, res: Response) => {
  // todos は Todo[] 型なので
  // id と text を必ず持っていることが保証されている
  res.json(todos);
});

// =========================
// POST /api/todos
// =========================

// Todo を追加する API
app.post("/api/todos", (req: Request, res: Response) => {
  // req.body を「CreateTodoBody 型として扱う」と宣言
  // 実行時に変換されるわけではない（TS用の説明）
  const body = req.body as CreateTodoBody;

  // text が無い、または空ならエラー
  // 外部から来るデータは信用しない
  if (!body.text) {
    return res.status(400).json({ error: "text is required" });
  }

  // 新しい Todo を作る
  // Todo 型に合っていないと TS が怒る
  const todo: Todo = {
    id: nextId++, // 次のIDを使ってから +1
    text: body.text, // text は string であることが保証されている
  };

  // 配列に追加
  todos.push(todo);

  // 201 Created と一緒に作った Todo を返す
  res.status(201).json(todo);
});

// =========================
// DELETE /api/todos/:id
// =========================

// 指定した id の Todo を削除する API
app.delete("/api/todos/:id", (req: Request, res: Response) => {
  // URL パラメータは文字列なので number に変換
  const id = Number(req.params.id);

  // 削除前の個数を覚えておく
  const before = todos.length;

  // id が一致しないものだけ残す
  // 新しい配列を作るので安全
  todos = todos.filter((t) => t.id !== id);

  // 個数が変わっていない = その id は存在しなかった
  if (todos.length === before) {
    return res.status(404).json({ error: "not found" });
  }

  // 成功したが返すデータは無い → 204 No Content
  res.status(204).end();
});

// =========================
// サーバー起動
// =========================

// ポート3000で API を待ち受ける
app.listen(3000, () => {
  console.log("API running on http://localhost:3000");
});
