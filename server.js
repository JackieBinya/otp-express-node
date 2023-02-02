import { app } from './app.js';
import * as dotenv from 'dotenv';
import db from './api/db/index.js';

dotenv.config();

const PORT = process.env.port;

const server = app.listen(PORT, () =>
	console.log(`App is running on ${process.env.port}`)
);

export default server;
