const express = require("express");
const ratelimit = require("../../middleware/ratelimits");
const verify = require("../../middleware/verify");
const superagent = require("superagent");

const router = express.Router(); // eslint-disable-line new-cap

router.put("/", ratelimit({ max: 3, window: 5000 }), verify({
	type: "body",
	fields: {
		enabled: Boolean,
		channelId: {
			type: String,
			optional: true,
			validate: input => {
				if(/\d+/.test(input)) throw new Error("Channel ID must be a snowflake");
				else return true;
			}
		},
		joinMessage: {
			optional: true,
			type: String,
			validate: input => {
				if(input.length > 2000) throw new Error("Join message must be less than 2000 characters");
				else return true;
			}
		},
		leaveMessage: {
			optional: true,
			type: String,
			validate: input => {
				if(input.length > 2000) throw new Error("Leave message must be less than 2000 characters");
				else return true;
			}
		}
	}
}), async (req, res) => {
	const resp = await superagent
		.put(`${req.app.locals.gatewayBaseURL}/settings/${req.params.guildId}/user-log`)
		.ok(({ status }) => status < 500)
		.send(req.verified);

	return res.status(200).json(resp.body);
});

module.exports = () => router;
