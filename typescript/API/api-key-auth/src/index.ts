import express, { Request, Response, NextFunction } from "express";
import fs from "fs";

const app = express();
app.use(express.json());

type ApiKey = {
  key: string;
  createAt: string;
};

type ApiKeyStore = {
  keys: ApiKey[];
};

const FILE_PATH = "./apikeys.json";

const loadApiKeys = (): ApiKeyStore => {
  const raw = fs.readFileSync(FILE_PATH, "utf-8");
  return JSON.parse(raw) as ApiKeyStore;
};

declare global {
  namespace Express {
    interface Request {
      apikey?: ApiKey;
    }
  }
}

const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
  const key = req.header("x-api-key");

  if (!key) {
    return res.status(401).json({ error: "API key required" });
  }

  const store = loadApiKeys();
  const apiKey = store.keys.find((k) => k.key === key);

  if (!apiKey) {
    return res.status(403).json({ error: "Invalid API key" });
  }

  req.apiKey = apiKey;
  next();
};

app.get("/protected", apiKeyAuth, (req, res) => {
  res.json({
    messages: "protected data",
    usedKey: req.apiKey?.key,
  });
});

app.listen(3000, () => {
  console.log("enable!!");
});
