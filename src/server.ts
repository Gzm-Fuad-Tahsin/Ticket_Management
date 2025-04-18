/* eslint-disable no-console */
import { Server } from "http";
import app from "./app";
import config from "./app/config";
import mongoose from "mongoose";

let server: Server;

async function main() {
  try {
    console.log(config.database_URL);
    await mongoose.connect(config.database_URL as string);
    server = app.listen(config.PORT || 4000, () => {
      console.log(`App listening on port ${config.PORT}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

main();

// //for asynchronus
// process.on('unhandledRejection', () => {
//   console.log('UnhandledRejection is detected, shutting down the server');
//   if (server) {
//     server.close(() => {
//       process.exit(1);
//     });
//   }
//   process.exit(1);
// });

// //for synchronus
// process.on('uncaughtException', () => {
//   console.log('uncaughtException is detected, shutting down the server');
//   process.exit(1);
// });
