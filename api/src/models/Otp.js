import { Model, DataTypes } from 'sequelize';
import db from '../db/index.js';

class Otp extends Model {}

Otp.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		otp: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		is_used: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		created_at: {
			type: DataTypes.DATE,
			allowNull: false,
		},
	},
	{
		timestamps: false,
		sequelize: db,
		modelName: 'otp',
	}
);

Otp.sync()
	.then(() => console.log('OTP TABLE created...'))
	.catch((error) => console.log(error));

// Otp.drop()
// .then(() => console.log('OTP TABLE dropped...'))
// .catch((error) => console.log(error));

export default Otp;
