const crypto = require("crypto");
const Redis = require("ioredis");
const superagent = require("superagent");

const redis = new Redis({
	port: +process.env.REDIS_SERVICE_PORT,
	host: "redis",
	family: 4,
	db: +process.env.REDIS_OAUTH2_DATABASE,
	maxRetriesPerRequest: null,
	reconnectOnError(error) {
		return error.message.startsWith("connect ETIMEDOUT");
	}
});

redis.on("error", error => {
	if(error.message.startsWith("connect ETIMEDOUT")) redis.connect();
});

async function generateUserToken(code) {
	try {
		const { body } = await superagent.post("https://discordapp.com/api/oauth2/token")
			.type("form")
			.send({
				client_id: process.env.BOT_ID,
				client_secret: process.env.SECRET,
				grant_type: "authorization_code",
				code: code,
				redirect_uri: {
					development: "https://alpha.oxyl.org/",
					staging: "https://beta.oxyl.org/",
					production: "https://oxyl.org/"
				}[process.env.NODE_ENV]
			});

		const userToken = crypto.randomBytes(12).toString("hex");
		redis.set(`token:${userToken}`, JSON.stringify({
			accessToken: body.access_token,
			refreshToken: body.refresh_token,
			expiresAt: Date.now() + (body.expires_in * 1000)
		}));

		return userToken;
	} catch(err) {
		const error = new Error("Invalid Discord OAuth2 code");
		error.status = 400;

		throw error;
	}
}

async function getAccessToken(userToken) {
	userToken = `token:${userToken}`;
	if(!await redis.exists(userToken)) {
		const error = new Error("Invalid token");
		error.status = 401;

		throw error;
	}

	const token = JSON.parse(await redis.get(userToken));
	if(Date.now() >= token.expiresAt) {
		try {
			const { body } = await superagent.post("https://discordapp.com/api/oauth2/token")
				.type("form")
				.send({
					client_id: process.env.BOT_ID,
					client_secret: process.env.SECRET,
					grant_type: "refresh_token",
					refresh_token: token.refreshToken,
					redirect_uri: {
						development: "https://alpha.oxyl.org/",
						staging: "https://beta.oxyl.org/",
						production: "https://oxyl.org/"
					}[process.env.NODE_ENV]
				});

			redis.set(userToken, JSON.stringify({
				accessToken: body.access_token,
				refreshToken: body.refresh_token,
				expiresAt: Date.now() + (body.expires_in * 1000)
			}));

			return body.accessToken;
		} catch(err) {
			redis.del(userToken);

			const error = new Error("Invalid refresh token");
			error.status = 500;

			throw error;
		}
	} else {
		return token.accessToken;
	}
}

async function request(userToken, path) {
	const accessToken = await getAccessToken(userToken);

	const cachedResponse = await redis.get(`cache:${accessToken}:${path}`);
	if(cachedResponse) return JSON.parse(cachedResponse);

	const { body } = await superagent.get(`https://discordapp.com/api/${path}`)
		.set("Authorization", `Bearer ${accessToken}`);

	await redis.set(`cache:${accessToken}:${path}`, JSON.stringify(body), "PX", 1000 * 60 * 5);

	return body;
}

module.exports = { generateUserToken, request };
