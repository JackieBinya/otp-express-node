import { Sequelize } from 'sequelize';
import dbConfig from './dbConfig.js';

const { DB_NAME, DB_PASSWORD, DB_DIALECT, DB_HOST, DB_USERNAME } = dbConfig;

console.log('🟢🟢🟢🟢', process.env.DB_DIALECT);

// const db = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
// 	host: DB_HOST,
// 	dialect: DB_DIALECT,
// });

const db = new Sequelize('my_test', 'my_test', 'my_test', {
	host: 'localhost',
	dialect: 'mysql',
});

db.authenticate()
	.then(() => console.log('Connected DB......'))
	.catch((error) => console.error('Unable to connect to the DB', error));

export default db;
