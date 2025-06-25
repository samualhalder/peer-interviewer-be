import express from "express";
import "express-async-errors";
import dotenv from "dotenv";
import index from "./startups/index";

dotenv.config();
const app = express();

index(app);
