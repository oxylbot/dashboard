const express = require("express");
const ratelimit = require("../../middleware/ratelimits");
const verify = require("../../middleware/verify");
const superagent = require("superagent");

const router = express.Router(); // eslint-disable-line new-cap

router.put("/roleme", ratelimit({ max: 3, window: 5000 }), verify({
	type: "body",
	fields: {
		roles: {
			type: Array,
			default: [],
			validate: input => {
				if(input.every(value => /\d+/.test(value))) {
					throw new Error("Roles must be an array of snowflakes");
				} else {
					return true;
				}
			}
		}
	}
}), async (req, res) => {
	const resp = await superagent
		.put(`${req.app.locals.gatewayBaseURL}/settings/${req.params.guildId}/roleme`)
		.ok(({ status }) => status < 500)
		.send(req.verified);

	return res.status(200).json(resp.body);
});

router.put("/autorole", ratelimit({ max: 3, window: 5000 }), verify({
	type: "body",
	fields: {
		roles: {
			type: Array,
			default: [],
			validate: input => {
				if(input.every(value => /\d+/.test(value))) {
					return true;
				} else {
					throw new Error("Roles must be an array of snowflakes");
				}
			}
		}
	}
}), async (req, res) => {
	const resp = await superagent
		.put(`${req.app.locals.gatewayBaseURL}/settings/${req.params.guildId}/autorole`)
		.ok(({ status }) => status < 500)
		.send(req.verified);

	return res.status(200).json(resp.body);
});


router.put("/autorole/bots", ratelimit({ max: 3, window: 5000 }), verify({
	type: "body",
	fields: {
		roles: {
			type: Array,
			default: [],
			validate: input => {
				if(input.every(value => /\d+/.test(value))) {
					return true;
				} else {
					throw new Error("Roles must be an array of snowflakes");
				}
			}
		}
	}
}), async (req, res) => {
	const resp = await superagent
		.put(`${req.app.locals.gatewayBaseURL}/settings/${req.params.guildId}/autorole/bots`)
		.ok(({ status }) => status < 500)
		.send(req.verified);

	return res.status(200).json(resp.body);
});


module.exports = () => router;
