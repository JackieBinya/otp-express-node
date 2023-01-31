import { app } from './app.js';
import 'dotenv/config';
import db from './db/index.js';

const PORT = process.env.port;

const server = app.listen(port, () =>
	console.log(`App is running on ${process.env.port}`)
);

export default server;
