import { app } from './app.js';
import "dotenv/config";
import db from './db/index.js';

const server = app.listen(8080, () =>
  console.log(`App is running on ${process.env.port}`)
);

export default server;
