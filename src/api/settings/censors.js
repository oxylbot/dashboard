const express = require("express");
const ratelimit = require("../../middleware/ratelimits");
const superagent = require("superagent");
const verify = require("../../middleware/verify");

const router = express.Router({ mergeParams: true }); // eslint-disable-line new-cap

router.post("/", ratelimit({ max: 1, window: 5000 }), verify({
	type: "body",
	fields: {
		name: {
			type: String,
			validate: input => {
				if(input.length > 64) throw new Error("Name must be less than 64 characters");
				else return true;
			}
		},
		description: {
			type: String,
			validate: input => {
				if(input.length > 512) throw new Error("Description must be less than 512 characters");
				else return true;
			}
		},
		duration: {
			type: Number,
			optional: true,
			validate: input => {
				if(Number.isInteger(input)) return true;
				else throw new Error("Duration must be an integer");
			}
		},
		regex: String,
		whitelistedRoles: {
			type: Array,
			default: [],
			validate: input => {
				if(input.every(value => /\d+/.test(value))) {
					return true;
				} else {
					throw new Error("Duration must be an integer");
				}
			}
		}
	}
}), async (req, res) => {
	const resp = await superagent
		.post(`${req.app.locals.gatewayBaseURL}/settings/${req.params.guildId}/censors`)
		.ok(({ status }) => status < 500)
		.send({
			name: req.body.name,
			description: resp.body.description,
			duration: req.body.duration,
			regex: req.body.regex,
			whitelistedRoles: req.body.whitelistedRoles
		});

	res.status(200).json(resp.body);
});

router.patch("/:id", ratelimit({ max: 3, window: 5000 }), verify({
	type: "body",
	minimumFields: 1,
	fields: {
		name: {
			type: String,
			validate: input => {
				if(input.length > 64) throw new Error("Name must be less than 64 characters");
				else return true;
			}
		},
		description: {
			type: String,
			validate: input => {
				if(input.length > 512) throw new Error("Description must be less than 512 characters");
				else return true;
			}
		},
		duration: {
			type: Number,
			validate: input => {
				if(Number.isInteger(input)) return true;
				else throw new Error("Duration must be an integer");
			}
		},
		regex: String,
		whitelistedRoles: {
			type: Array,
			default: [],
			validate: input => {
				if(input.every(value => /\d+/.test(value))) {
					return true;
				} else {
					throw new Error("Whitelisted roles must be an array of snowflakes");
				}
			}
		}
	}
}), async (req, res) => {
	const resp = await superagent
		.patch(`${req.app.locals.gatewayBaseURL}/settings/${req.params.guildId}/censors/${req.params.id}`)
		.ok(({ status }) => status < 500)
		.send(req.verified);

	if(resp.status === 404) {
		return res.status(404).json({ error: "Censor does not exist" });
	} else {
		return res.status(200).json(resp.body);
	}
});

router.delete("/:id", ratelimit({ max: 3, window: 5000 }), async (req, res) => {
	const resp = await superagent
		.delete(`${req.app.locals.gatewayBaseURL}/settings/${req.params.guildId}/censors/${req.params.id}`)
		.ok(({ status }) => status < 500);

	if(resp.status === 404) {
		return res.status(404).json({ error: "Censor does not exist" });
	} else {
		return res.status(204).end();
	}
});

module.exports = () => router;
