const express = require("express");
const ratelimit = require("../../middleware/ratelimits");
const verify = require("../../middleware/verify");
const superagent = require("superagent");

const router = express.Router({ mergeParams: true })); // eslint-disable-line new-cap

router.put("/", ratelimit({ max: 3, window: 5000 }), verify({
	type: "body",
	fields: {
		overwrite: Boolean,
		prefix: {
			optional: true,
			type: String,
			validate: input => {
				if(input.length > 20) throw new Error("Prefix must be less than 20 characters");
				else return true;
			}
		}
	}
}), async (req, res) => {
	const resp = await superagent
		.put(`${req.app.locals.gatewayBaseURL}/settings/${req.params.guildId}/prefix`)
		.ok(({ status }) => status < 500)
		.send(req.verified);

	return res.status(200).json(resp.body);
});

module.exports = () => router;

