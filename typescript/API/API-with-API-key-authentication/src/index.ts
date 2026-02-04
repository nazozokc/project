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
  namespace Express {}
}
