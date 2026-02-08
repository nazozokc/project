// Express本体と、型（Request / Response / NextFunction）をimport
// 👉 TypeScriptで「req, res が何者か」を明確にするため
import express, { Request, Response, NextFunction } from "express";

// JSONファイルを読み込むためのNode標準モジュール
import fs from "fs";

// Expressアプリ本体を作成
const app = express();

// JSONリクエストボディを自動でパースするmiddleware
// 👉 req.body が undefined にならないようにする
app.use(express.json());

/* =========================
   型定義ゾーン
========================= */

// APIキー1つ分の構造を定義
// 👉 string型で雑に扱わず「意味のある塊」にする
type ApiKey = {
  key: string; // 実際のAPIキー文字列
  createdAt: string; // 作成日時（ISO文字列想定）
};

// JSONファイル全体の構造
// 👉 将来 keys 以外の情報を足しても壊れない
type ApiKeyStore = {
  keys: ApiKey[];
};

/* =========================
   JSON操作ゾーン（保存の責務）
========================= */

// APIキーを保存しているJSONファイルのパス
// 👉 マジック文字列を直接書かない
const FILE_PATH = "./apiKeys.json";

// JSONファイルを読み込んで、型付きで返す関数
const loadApiKeys = (): ApiKeyStore => {
  // ファイルを同期的に読み込む
  // 👉 今は学習用なので同期でOK（非同期は後）
  const raw = fs.readFileSync(FILE_PATH, "utf-8");

  // JSON.parse は型情報を失うので
  // 👉 「これは ApiKeyStore だ」と TypeScript に教える
  return JSON.parse(raw) as ApiKeyStore;
};

/* =========================
   認証ゾーン（middleware）
========================= */

// ExpressのRequest型を拡張する宣言
// 👉 req.apiKey を安全に使えるようにする
declare global {
  namespace Express {
    interface Request {
      apiKey?: ApiKey;
    }
  }
}

// APIキー認証用 middleware
const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
  // HTTPヘッダーから x-api-key を取得
  const key = req.header("x-api-key");

  // APIキーが送られていない場合
  if (!key) {
    // 👉 「認証情報が無い」＝ 401
    return res.status(401).json({ error: "API key required" });
  }

  // JSONからAPIキー一覧を取得
  const store = loadApiKeys();

  // 送られてきたキーと一致するものを探す
  const apiKey = store.keys.find((k) => k.key === key);

  // 見つからなかった場合
  if (!apiKey) {
    // 👉 「認証情報はあるが無効」＝ 403
    return res.status(403).json({ error: "Invalid API key" });
  }

  // 認証に成功したAPIキー情報を req に載せる
  // 👉 後続の処理は「もう認証済み」として扱える
  req.apiKey = apiKey;

  // 次の middleware / route handler へ進む
  next();
};

/* =========================
   処理ゾーン（route）
========================= */

// 認証が必要なエンドポイント
app.get("/protected", apiKeyAuth, (req, res) => {
  // apiKeyAuth を通過しているので
  // 👉 req.apiKey は存在すると「論理的に」保証されている
  res.json({
    message: "protected data",
    usedKey: req.apiKey?.key,
  });
});

// サーバー起動
app.listen(3000, () => {
  console.log("server started");
});
