import express, { Request, Response } from "express";
import fs from "fs";
import crypto from "crypto";

const app = express();
app.use(express.json());

/*
  ============================
  型定義
  ============================
*/

// ユーザー情報
type User = {
  id: number;
  username: string;
  password: string;
};

// 認証トークン情報
type AuthToken = {
  token: string;
  userId: number;
  createdAt: string;
};

// 保存するファイル
const USER_FILE = "./users.json";
const TOKEN_FILE = "./tokens.json";

/*
  ============================
  ユーティリティ関数
  ============================
*/

// ファイルが存在しない場合は空配列を返す
const loadUsers = (): User[] => {
  if (!fs.existsSync(USER_FILE)) {
    return [];
  }

  const data = fs.readFileSync(USER_FILE, "utf-8");
  return JSON.parse(data) as User[];
};

const loadTokens = (): AuthToken[] => {
  if (!fs.existsSync(TOKEN_FILE)) {
    return [];
  }

  const data = fs.readFileSync(TOKEN_FILE, "utf-8");
  return JSON.parse(data) as AuthToken[];
};

// 配列ごと保存する
const saveUsers = (users: User[]): void => {
  fs.writeFileSync(USER_FILE, JSON.stringify(users, null, 2));
};

const saveTokens = (tokens: AuthToken[]): void => {
  fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens, null, 2));
};

/*
  ============================
  メモリ上のデータ
  ============================
*/

// 起動時にファイル → メモリへ読み込む
let users: User[] = loadUsers();
let tokens: AuthToken[] = loadTokens();

// ID 自動採番用
let nextUserId =
  users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;

/*
  ============================
  API
  ============================
*/

// トークン一覧を取得（デバッグ用）
app.get("/api/token", (_req: Request, res: Response) => {
  res.json(tokens);
});

/*
  ログイン & トークン発行
*/
app.post("/api/token", (req: Request, res: Response) => {
  /*
    req.body は「何が入っているか分からない」
    → TypeScript に構造を教える
  */
  const body = req.body as {
    username?: string;
    password?: string;
  };

  const { username, password } = body;

  // 実行時チェック（型チェックとは別）
  if (!username || !password) {
    return res.status(400).json({
      error: "username and password required",
    });
  }

  // ユーザー作成（本来は既存チェックやハッシュ化が必要）
  const newUser: User = {
    id: nextUserId++,
    username,
    password,
  };

  users.push(newUser);
  saveUsers(users);

  // ランダムなトークン生成
  const newToken: AuthToken = {
    token: crypto.randomUUID(),
    userId: newUser.id,
    createdAt: new Date().toISOString(),
  };

  tokens.push(newToken);
  saveTokens(tokens);

  /*
    レスポンスは1回だけ
    res.json(a, b) はできない
  */
  res.status(201).json({
    userId: newUser.id,
    token: newToken.token,
  });
});

/*
  トークン削除
*/
app.delete("/api/token/:token", (req: Request, res: Response) => {
  const tokenValue = req.params.token;

  const beforeLength = tokens.length;

  // 指定トークン以外を残す
  tokens = tokens.filter(t => t.token !== tokenValue);
  saveTokens(tokens);

  if (tokens.length === beforeLength) {
    return res.status(404).json({ error: "token not found" });
  }

  // 204 は「中身なし」
  res.status(204).end();
});

/*
  ============================
  起動
  ============================
*/

app.listen(3000, () => {
  console.log("API server running on http://localhost:3000");
});

