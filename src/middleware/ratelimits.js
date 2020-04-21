const Redis = require("ioredis");

const redis = new Redis({
	port: +process.env.REDIS_SERVICE_PORT,
	host: "redis",
	family: 4,
	db: +process.env.REDIS_RATELIMIT_DATABASE,
	maxRetriesPerRequest: null,
	reconnectOnError(error) {
		return error.message.startsWith("connect ETIMEDOUT");
	}
});

redis.on("error", error => {
	if(error.message.startsWith("connect ETIMEDOUT")) redis.connect();
});

// { max: 5, window: 5000 }
module.exports = options => {
	let resetAt = Date.now() + options.window;
	setInterval(() => resetAt = Date.now() + options.window, options.window);

	return async (req, res, next) => {
		const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
		const keyPrefix = `${req.baseUrl}:${ip}`;

		const exists = await redis.exists(`${keyPrefix}:used`);
		const requestsUsed = exists ? await redis.get(`${keyPrefix}:used`) : 0;

		res.set("X-RateLimit-Limit", options.max);
		res.set("X-RateLimit-Remaining", requestsUsed === options.max ? 0 : options.max - requestsUsed - 1);
		res.set("X-RateLimit-Reset", resetAt / 1000);

		if(requestsUsed === options.max) {
			res.set("Retry-After", (resetAt - Date.now()) / 1000);

			return res.status(429).json({ message: "You are being rate limited" }).end();
		} else {
			if(exists) await redis.incr(`${keyPrefix}:used`);
			else await redis.set(`${keyPrefix}:used`, requestsUsed + 1, "PX", resetAt - Date.now());

			return next();
		}
	};
};

