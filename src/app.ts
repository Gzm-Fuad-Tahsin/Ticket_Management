// src/index.js
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import router from './app/router';
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";

dotenv.config();

const app: Express = express();

//parsers
app.use(express.json());

app.use('/api/v1', router);
const port = process.env.PORT || 3000;
// app.use(cookieParser());

/**------------ GLOBAL ERROR HANDLER -------------------*/
app.use(globalErrorHandler);

/** ------------ NOT FOUND URL ------------------- */
app.use(notFound as never);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});



// app.listen(port, () => {
//   console.log(`[server]: Server is running at http://localhost:${port}`);
// });
/**------------ GLOBAL ERROR HANDLER -------------------*/
app.use(globalErrorHandler);

/** ------------ NOT FOUND URL ------------------- */
app.use(notFound as never);
export default app;