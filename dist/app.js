"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.js
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const router_1 = __importDefault(require("./app/router"));
dotenv_1.default.config();
const app = (0, express_1.default)();
//parsers
app.use(express_1.default.json());
app.use('/api/v1', router_1.default);
const port = process.env.PORT || 3000;
app.get("/", (req, res) => {
    res.send("Express + TypeScript Server");
});
app.get("/hello", (req, res) => {
    res.send("Express ");
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
