// ================================
// Express本体と型を読み込む
// ================================
// express → Webサーバーを作るためのフレームワーク
// Request, Response → TypeScript用の型（req, res の中身を安全に扱える）
import express, { Request, Response } from "express";

// fs → Node.js標準のファイル操作モジュール
// JSONファイルを読み書きするために使う
import fs from "fs";

// ================================
// Expressアプリを作成
// ================================
const app = express();

// JSON形式のリクエストボディを使えるようにする
// これがないと req.body が undefined になる
app.use(express.json());

// ================================
// いいね履歴1件分の「型」定義
// ================================
// LikeHistory は「いいね1回分の記録」を表す
// count → 何回目のいいねか
// time  → いいねした時刻（ISO文字列）
type LikeHistory = {
  count: number;
  time: string;
};

// ================================
// 保存先ファイルのパス
// ================================
// このファイルにいいね履歴を保存する
const FILE_PATH = "./likes.json";

// ================================
// JSONファイルから履歴を読み込む関数
// ================================
function loadLikes(): LikeHistory[] {
  // ファイルが存在しない場合
  if (!fs.existsSync(FILE_PATH)) {
    // まだ履歴がないので空配列を返す
    return [];
  }

  // ファイルを文字列として読み込む
  const data = fs.readFileSync(FILE_PATH, "utf-8");

  // JSON文字列 → JavaScriptの配列に変換して返す
  return JSON.parse(data);
}

// ================================
// JSONファイルに履歴を保存する関数
// ================================
function saveLikes(likes: LikeHistory[]) {
  // 配列 → JSON文字列に変換
  // null, 2 を指定するとインデント付きで見やすくなる
  fs.writeFileSync(FILE_PATH, JSON.stringify(likes, null, 2));
}

// ================================
// サーバー起動時に履歴を読み込む
// ================================
// サーバーが落ちても、次回起動時に
// likes.json の中身がここに復元される
let likes: LikeHistory[] = loadLikes();

// ================================
// 履歴取得API
// GET /api/like
// ================================
app.get("/api/like", (req: Request, res: Response) => {
  // 現在メモリ上にあるいいね履歴をそのまま返す
  res.json(likes);
});

// ================================
// いいねAPI
// POST /api/like
// ================================
app.post("/api/like", (req: Request, res: Response) => {
  // 次のいいね回数
  // 配列の長さ + 1 = 今回のいいね番号
  const nextCount = likes.length + 1;

  // 新しいいいね記録を作成
  const record: LikeHistory = {
    count: nextCount,
    // 現在時刻をISO形式の文字列に変換
    time: new Date().toISOString(),
  };

  // メモリ上の配列に追加
  likes.push(record);

  // ファイルに保存（ここ重要）
  // これをしないと再起動時に消える
  saveLikes(likes);

  // 追加した記録をレスポンスとして返す
  res.json(record);
});

// ================================
// リセットAPI
// POST /api/like/reset
// ================================
app.post("/api/like/reset", (req: Request, res: Response) => {
  // 履歴を空にする
  likes = [];

  // 空の状態をファイルにも保存
  saveLikes(likes);

  // リセット完了メッセージ
  res.json({ message: "reset ok" });
});

// ================================
// サーバー起動
// ================================
app.listen(3000, () => {
  // http://localhost:3000 でアクセス可能
  console.log("Like API with JSON storage running");
});
