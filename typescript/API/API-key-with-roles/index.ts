import express, { Request, Response, NextFunction } from "express";
import fs from "fs";
import crypto from "crypto"

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

