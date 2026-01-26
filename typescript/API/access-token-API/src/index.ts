import express, { Request, Response } from "express";
import fs from "fs";
import crypto from "crypto";

const app = express();
app.use(express.json());

type User = {
  id: number;
  username: string;
  password: any;
};

type AuthToken = {
  token: string;
  userId: number;
  createdAt: string;
};
