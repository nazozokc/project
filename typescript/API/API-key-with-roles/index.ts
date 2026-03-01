import express, { Request, Response, NextFunction } from "express";
import fs from "fs";
import crypto from "crypto";

const app = express()
app.use(express.json())

type Role = "read" | "write" | "admin"

type ApiKey = {
  key: string;
  role: Role;
  createAt: string;
};

type Store = {
  keys: ApiKey[];
}


const FILE_PATH = "./apikeys.json";

const loadStore = (): Store => {
  if (!fs.existsSync(FILE_PATH)) {
    return { keys: [] }
  }

  const raw = fs.readFileSync(FILE_PATH, "utf-8");
  return JSON.parse(raw) as Store;
}

const saveStore = (store: Store) => {
  fs.writeFileSync(FILE_PATH, JSON.stringify(store, null, 2));
}

declare global {
  namespace Express {
    interface Request {
      Apikey?: ApiKey
    }
  }
}

const apiKeyAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const key = req.header("x-api-key")

  if (!key) {
    return res.status(401).json({ error: "API key required" })
  }

  const store = loadStore()
  const apiKey = store.keys.find(k => k.key === key)

  if (!apiKey) {
    return res.json(403).json({ error: "Invalid API key" })
  }

  req.apiKey = apiKey
  next()
}

const roleLevel: Record<Role, number> = {
  read: 1,
  write: 2,
  admin: 3
}

const requireRole = (required: Role) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.apiKey) {
      return res.status(500).json({ error: "Auth missing" })
    }

    const userLevel = roleLevel[req.apiKey.role];
    const requiredLevel = roleLevel[required];
  }

  if (userLevel < requiredLevel) {
    return res.status(403).json({ error: "Permisson denited" })
  };

  next()
};
}


app.post("/api-keys", (req, res) => {
  const { role } = req.body as { role?: Role }

  if (!role || !["read", "write", "admin"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" })
  }

  const store = loadStore()

  const newKey: ApiKey = {
    key: generateApiKey(),
    role,
    createAt: new Date().toISOString()
  }

  store.keys.push(newKey)
  saveStore(store)

  res.status(201).json({
    apiKey: newKey.key,
    role: newKey.role
  })
})

app.get("/protected", apiKeyAuth, requireRole("read"), (req, res) => {
  res.json({ message: "readable data" })
})

app.post("/write", apiKeyAuth, requireRole("write"), (req, res) => {
  res.json({ message: "write success" })
})

app.delete("/admin", apiKeyAuth, requireRole("admin"), (req, res) => {
  res.json({ message: "admin action executed" })
})

app.listen(3000, () => {
  console.log("enable!!")
})
