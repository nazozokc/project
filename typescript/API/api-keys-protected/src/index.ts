import express, { Request, Response, NextFunction } from "express";
import fs from "fs";
import crypto from "crypto";

const app = express();
app.use(express.json());

type ApiKey = {
  key: string;
  createdAt: string;
}

type ApiKeyStore = {
  keys: ApiKey[];
}

const FILE_PATH = "./apikeys.json";

const loadApiKeys = (): ApiKeyStore => {
  if (!fs.readFileSync(FILE_PATH)) {
    return { keys: [] }
  }

  const raw = fs.readFileSync(FILE_PATH, "utf-8");
  return JSON.parse(raw) as ApiKeyStore;
};

const saveApiKeys = (store: ApiKeyStore): void => {
  fs.writeFileSync(FILE_PATH, JSON.stringify(store, null, 2))
};

const generateApiKey = (): string => {
  return crypto.randomBytes(24).toString("hex")
}

declare global {
  namespace Express {
    interface Request {
      apiKey?: ApiKey
    }
  }
}

const ApiKeyAuth = {
  req: Request,
  res: Response,
  next: NextFunction
} => {
  const key = req.header("x-api-key")

  if (!key) {
    return res.status(401).json({ error: "API key required" })
  }

  const store = loadApiKeys()
  const apiKey = store.keys.find(k => k.key === key);

  if (!apiKey) {
    return res.status(403).json({ error: "Invalid API key" })
  }

  req.apiKey = apiKey;
  next()
};

app.post("/api-keys", (req, res) => {
  const store = loadApiKeys();

  const newKey: ApiKey = {
    key: generateApiKey(),
    createdAt: new Date().toISOString()
  }

  store.keys.push(newKey);
  saveApiKeys(store);

  res.status(201).json({ apiKey: newKey.key })
})
