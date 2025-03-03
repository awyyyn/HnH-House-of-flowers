export const environment = {
	CLIENT_URL: String(process.env.CLIENT_URL),
	SALT: Number(process.env.SALT),
	EMAIL: String(process.env.EMAIL),
	PASSWORD: String(process.env.PASSWORD),
	PORT: Number(process.env.PORT),
	ACCESS_SECRET: String(process.env.ACCESS_SECRET),
	REFRESH_SECRET: String(process.env.REFRESH_SECRET),
	PAYMONGO_SECRET: String(process.env.PAYMONGO_SECRET),
};
