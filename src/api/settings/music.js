const express = require("express");
const ratelimit = require("../../middleware/ratelimits");
const verify = require("../../middleware/verify");
const superagent = require("superagent");

const router = express.Router(); // eslint-disable-line new-cap

router.put("/", ratelimit({ max: 3, window: 5000 }), verify({
	type: "body",
	fields: {
		enabled: Boolean,
		voteSkip: Boolean,
		maxLength: {
			type: Number,
			optional: true,
			validate: input => {
				if(Number.isInteger(input)) return true;
				else throw new Error("Max length must be an integer");
			}
		}
	}
}), async (req, res) => {
	const resp = await superagent
		.put(`${req.app.locals.gatewayBaseURL}/settings/${req.params.guildId}/music`)
		.ok(({ status }) => status < 500)
		.send(req.verified);

	return res.status(200).json(resp.body);
});

module.exports = () => router;
