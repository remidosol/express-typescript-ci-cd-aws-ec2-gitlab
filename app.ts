import express, { Express, Request, Response } from "express";
import path from 'path';
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const host = process.env.HOST!;
const port = +process.env.PORT!;


app.listen(port, host, () => {
    console.log(`⚡️[server]: Server is running at http://${host}:${port}`);
});



app.get("/", (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});