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
		warningDuration: {
			type: Number,
			optional: true,
			validate: input => {
				if(!Number.isInteger(input)) throw new Error("Warning duration must be an integer");
				else return true;
			}
		}
	}
}), async (req, res) => {
	const resp = await superagent
		.patch(`${req.app.locals.gatewayBaseURL}/settings/${req.params.guildId}/mod-log`)
		.ok(({ status }) => status < 500)
		.send(req.verified);

	return res.status(200).json(resp.body);
});

router.post("/thresholds", ratelimit({ max: 1, window: 5000 }), verify({
	type: "body",
	fields: {
		trigger: {
			type: Number,
			validate: input => {
				if(input.length > 999) throw new Error("Amount of warns to trigger must be less than 999");
				if(input.length < 1) throw new Error("Amount of warns to trigger must be greater than 1");
				else return true;
			}
		},
		punishment: {
			type: String,
			validate: input => {
				if(!["mute", "ban", "kick", "softban"].includes(input)) throw new Error("Invalid punishment type");
				else return true;
			}
		},
		duration: {
			type: Number,
			optional: true,
			validate: input => {
				if(!Number.isInteger(input)) throw new Error("Duration must be an integer");
				else return true;
			}
		},
		whitelistedRoles: {
			type: Array,
			default: [],
			validate: input => {
				if(!input.every(value => /\d+/.test(value))) {
					throw new Error("Whitelisted roles must be an array of snowflakes");
				} else {
					return true;
				}
			}
		}
	}
}), async (req, res) => {
	const resp = await superagent
		.post(`${req.app.locals.gatewayBaseURL}/settings/${req.params.guildId}/mod-log/thresholds`)
		.ok(({ status }) => status < 500)
		.send({
			trigger: req.body.trigger,
			punishment: req.body.punishment,
			duration: req.body.duration,
			whitelistedRoles: req.body.whitelsitedRoles
		});

	res.status(200).json(resp.body);
});

router.patch("/thresholds/:id", ratelimit({ max: 3, window: 5000 }), verify({
	type: "body",
	minimumFields: 1,
	fields: {
		trigger: {
			type: Number,
			validate: input => {
				if(input.length > 999) throw new Error("Amount of warns to trigger must be less than 999");
				if(input.length < 1) throw new Error("Amount of warns to trigger must be greater than 1");
				else return true;
			}
		},
		punishment: {
			type: String,
			validate: input => {
				if(!["mute", "ban", "kick", "softban"].includes(input)) throw new Error("Invalid punishment type");
				else return true;
			}
		},
		duration: {
			type: Number,
			optional: true,
			validate: input => {
				if(!Number.isInteger(input)) throw new Error("Duration must be an integer");
				else return true;
			}
		},
		whitelistedRoles: {
			type: Array,
			default: [],
			validate: input => {
				if(!input.every(value => /\d+/.test(value))) {
					throw new Error("Whitelisted roles must be an array of snowflakes");
				} else {
					return true;
				}
			}
		}
	}
}), async (req, res) => {
	const resp = await superagent
		.patch(`${req.app.locals.gatewayBaseURL}/settings/${req.params.guildId}/mod-log/thresholds/${req.params.id}`)
		.ok(({ status }) => status < 500)
		.send(req.verified);

	if(resp.status === 404) {
		return res.status(404).json({ error: "Threshold does not exist" });
	} else {
		return res.status(200).json(resp.body);
	}
});

router.delete("/thresholds/:id", ratelimit({ max: 3, window: 5000 }), async (req, res) => {
	const resp = await superagent
		.delete(`${req.app.locals.gatewayBaseURL}/settings/${req.params.guildId}/mod-log/thresholds/${req.params.id}`)
		.ok(({ status }) => status < 500);

	if(resp.status === 404) {
		return res.status(404).json({ error: "Threshold does not exist" });
	} else {
		return res.status(204).end();
	}
});

module.exports = () => router;
