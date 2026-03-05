/**
 * ================================
 *  Express + TypeScript
 *  APIキー認証 & RBAC 実装 解説
 * ================================
 *
 * このファイルは、元コードの構造・意図・設計思想を
 * 「めちゃくちゃ丁寧」に解説するためのドキュメントです。
 *
 * 主な機能：
 * - APIキー発行
 * - APIキー認証
 * - ロールベースアクセス制御（RBAC）
 * - JSONファイルによる簡易DB
 */


/* ============================================================
   1. import部分
============================================================ */

/**
 * express
 *  → Node.jsでWebサーバーを作るためのフレームワーク
 *
 * Request, Response, NextFunction
 *  → TypeScriptで型安全にするために使用
 */
import express, { Request, Response, NextFunction } from "express";

/**
 * fs (File System)
 *  → ファイル読み書き用
 *  → 今回はJSONを簡易データベースとして使う
 */
import fs from "fs";

/**
 * crypto
 *  → 安全なランダム文字列生成に使用
 *  → APIキー生成で使う
 */
import crypto from "crypto";



/* ============================================================
   2. Express初期化
============================================================ */

const app = express()

/**
 * JSONボディを自動パースするミドルウェア
 * req.body が使えるようになる
 */
app.use(express.json())



/* ============================================================
   3. 型定義（TypeScriptの重要ポイント）
============================================================ */

/**
 * RoleをUnion型で固定
 *
 * これにより：
 * - "read" | "write" | "admin" 以外はコンパイルエラー
 * - 型安全になる
 */
type Role = "read" | "write" | "admin"


/**
 * 1つのAPIキーの構造
 */
type ApiKey = {
  key: string        // 実際のキー文字列
  role: Role         // 権限
  createdAt: string  // 発行日時
}


/**
 * JSONファイル全体の構造
 */
type Store = {
  keys: ApiKey[]
}



/* ============================================================
   4. JSONファイル操作（簡易DB）
============================================================ */

/**
 * APIキー保存用ファイルパス
 */
const FILE_PATH = "./apiKeys.json"


/**
 * データ読み込み関数
 */
const loadStore = (): Store => {

  // ファイルが存在しない場合
  if (!fs.existsSync(FILE_PATH)) {
    return { keys: [] }
  }

  // JSON読み込み
  const raw = fs.readFileSync(FILE_PATH, "utf-8")

  // 型アサーションでStoreとして扱う
  return JSON.parse(raw) as Store
}


/**
 * データ保存関数
 */
const saveStore = (store: Store) => {
  fs.writeFileSync(
    FILE_PATH,
    JSON.stringify(store, null, 2) // 整形して保存
  )
}



/* ============================================================
   5. APIキー生成
============================================================ */

/**
 * crypto.randomBytes(24)
 *  → 24バイトの安全な乱数
 *
 * toString("hex")
 *  → 16進数文字列に変換
 *
 * 結果：
 * 48文字のランダムキーが生成される
 */
const generateApiKey = (): string => {
  return crypto.randomBytes(24).toString("hex")
}



/* ============================================================
   6. 認証ミドルウェア
============================================================ */

/**
 * ExpressのRequest型を拡張
 *
 * req.apiKey を安全に使えるようにする
 */
declare global {
  namespace Express {
    interface Request {
      apiKey?: ApiKey
    }
  }
}


/**
 * APIキー認証ミドルウェア
 *
 * 流れ：
 * 1. ヘッダーからx-api-key取得
 * 2. JSONから検索
 * 3. あれば req.apiKey に保存
 */
const apiKeyAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const key = req.header("x-api-key")

  // キー未指定
  if (!key) {
    return res.status(401).json({
      error: "API key required"
    })
  }

  const store = loadStore()

  // キー検索
  const apiKey = store.keys.find(k => k.key === key)

  // 存在しない
  if (!apiKey) {
    return res.status(403).json({
      error: "Invalid API key"
    })
  }

  // リクエストに保存
  req.apiKey = apiKey

  next()
}



/* ============================================================
   7. 権限ミドルウェア（RBAC）
============================================================ */

/**
 * Role階層を数値化
 *
 * read  = 1
 * write = 2
 * admin = 3
 *
 * こうすることで比較が可能になる
 */
const roleLevel: Record<Role, number> = {
  read: 1,
  write: 2,
  admin: 3
}


/**
 * requireRole関数
 *
 * required以上の権限があるかをチェック
 *
 * 例：
 * requireRole("write")
 * → write以上（write, admin）OK
 */
const requireRole = (required: Role) => {

  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

    if (!req.apiKey) {
      return res.status(500).json({
        error: "Auth missing"
      })
    }

    const userLevel = roleLevel[req.apiKey.role]
    const requiredLevel = roleLevel[required]

    // 権限不足
    if (userLevel < requiredLevel) {
      return res.status(403).json({
        error: "Permission denied"
      })
    }

    next()
  }
}



/* ============================================================
   8. ルーティング
============================================================ */


/**
 * APIキー発行エンドポイント
 *
 * POST /api-keys
 *
 * body:
 * {
 *   "role": "read"
 * }
 */
app.post("/api-keys", (req, res) => {

  const { role } = req.body as { role?: Role }

  // 不正ロールチェック
  if (!role || !["read", "write", "admin"].includes(role)) {
    return res.status(400).json({
      error: "Invalid role"
    })
  }

  const store = loadStore()

  const newKey: ApiKey = {
    key: generateApiKey(),
    role,
    createdAt: new Date().toISOString()
  }

  store.keys.push(newKey)
  saveStore(store)

  res.status(201).json({
    apiKey: newKey.key,
    role: newKey.role
  })
})



/**
 * read以上アクセス可能
 */
app.get(
  "/protected",
  apiKeyAuth,
  requireRole("read"),
  (req, res) => {
    res.json({ message: "readable data" })
  }
)


/**
 * write以上アクセス可能
 */
app.post(
  "/write",
  apiKeyAuth,
  requireRole("write"),
  (req, res) => {
    res.json({ message: "write success" })
  }
)


/**
 * adminのみアクセス可能
 */
app.delete(
  "/admin",
  apiKeyAuth,
  requireRole("admin"),
  (req, res) => {
    res.json({ message: "admin action executed" })
  }
)



/* ============================================================
   9. サーバー起動
============================================================ */

app.listen(3000, () => {
  console.log("server started")
})



/* ============================================================
   まとめ（設計の本質）
============================================================ */

/**
 * このコードは以下の設計パターンを実装している：
 *
 * 1. APIキー認証
 * 2. RBAC（Role Based Access Control）
 * 3. ミドルウェア分離設計
 * 4. 型安全設計
 *
 * 非常に綺麗な構造：
 *
 * [Request]
 *     ↓
 * apiKeyAuth（認証）
 *     ↓
 * requireRole（認可）
 *     ↓
 * handler（実処理）
 *
 * これは実務レベルの設計思想。
 */

