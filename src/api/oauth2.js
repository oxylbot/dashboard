const oauth = require("../oauth2");
const express = require("express");
const ratelimit = require("../middleware/ratelimits");
const verify = require("../middleware/verify");

const router = express.Router(); // eslint-disable-line new-cap

router.post("/token", ratelimit({ max: 2, window: 60000 }), verify({
	type: "body",
	fields: {
		code: String
	}
}), async (req, res) => {
	try {
		const userToken = await oauth.generateUserToken(req.body.code);

		return res.status(200).json({ token: userToken });
	} catch(err) {
		if(err.status) {
			return res.status(err.status).json({ error: err.message });
		} else {
			return res.status(500).json({ error: "Internal server error" });
		}
	}
});

router.get("/users/@me", ratelimit({ max: 5, window: 5000 }), async (req, res) => {
	const auth = req.get("authorization");
	if(!auth) return res.status(401).json({ error: "No Authorization header" });

	try {
		const body = await oauth.request(auth, "users/@me");
		return res.status(200).json(body);
	} catch(err) {
		if(err.status) {
			return res.status(err.status).json({ error: err.message });
		} else {
			return res.status(500).json({ error: "Internal server error" });
		}
	}
});

router.get("/users/@me/guilds", ratelimit({ max: 5, window: 5000 }), async (req, res) => {
	const auth = req.get("authorization");
	if(!auth) return res.status(401).json({ error: "No Authorization header" });

	try {
		const body = await oauth.request(auth, "users/@me/guilds");

		return res.status(200).json(body);
	} catch(err) {
		if(err.status) {
			return res.status(err.status).json({ error: err.message });
		} else {
			return res.status(500).json({ error: "Internal server error" });
		}
	}
});

module.exports = () => router;
