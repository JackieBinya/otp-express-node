import { Model, DataTypes } from 'sequelize';
import db from '../db/index.js';

class ResetOtp extends Model {}

ResetOtp.init(
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

ResetOtp.sync()
	.then(() => console.log('ResetOTP TABLE created...'))
	.catch((error) => console.log(error));

// ResetOtp.drop()
// .then(() => console.log('ResetOTP TABLE dropped...'))
// .catch((error) => console.log(error));

export default ResetOtp;
