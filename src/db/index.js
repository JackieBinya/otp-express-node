import { Sequelize } from 'sequelize';
import dbConfig from './dbConfig.js';

const { DB_NAME, DB_PASSWORD, DB_DIALECT, DB_HOST, DB_USERNAME } = dbConfig;

const db = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
	host: DB_HOST,
	dialect: DB_DIALECT,
});

db.authenticate()
	.then(() => console.log('Connected DB......'))
	.catch((error) => console.error('Unable to connect to the DB', error));

export default db;
