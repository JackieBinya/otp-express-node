import { Model, DataTypes } from 'sequelize';
import db from '../db/index.js';

class OPT extends Model {}

OTP.init(
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
		ip: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		timestamps: true,
		sequelize: db,
		modelName: 'otp',
	}
);

export default OTP;
