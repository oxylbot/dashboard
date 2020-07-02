const express = require("express");
const ratelimit = require("../../middleware/ratelimits");
const superagent = require("superagent");
const verify = require("../../middleware/verify");

const router = express.Router(); // eslint-disable-line new-cap

router.post("/:id", ratelimit({ max: 1, window: 3000 }), verify({
	type: "body",
	fields: {
		enabledCommands: {
			type: Array,
			default: [],
			validate: input => {
				if(input.every(value => typeof value === "string")) {
					return true;
				} else {
					throw new Error("Enabled commands must be an array of strings");
				}
			}
		},
		disabledCommands: {
			type: Array,
			default: [],
			validate: input => {
				if(input.every(value => typeof value === "string")) {
					return true;
				} else {
					throw new Error("Disabled commands must be an array of strings");
				}
			}
		}
	}
}), async (req, res) => {
	const resp = await superagent
		.post(`${req.app.locals.gatewayBaseURL}/settings/${req.params.guildId}/permissions/`)
		.ok(({ status }) => status < 500)
		.send({
			roleId: req.params.id,
			enabledCommands: req.body.enabledCommands,
			disabledCommands: req.body.disabledCommands
		});

	res.status(200).json(resp.body);
});

router.put("/:id", ratelimit({ max: 3, window: 2000 }), verify({
	type: "body",
	minimumFields: 1,
	fields: {
		enabledCommands: {
			type: Array,
			default: [],
			validate: input => {
				if(input.every(value => typeof value === "string")) {
					return true;
				} else {
					throw new Error("Enabled commands must be an array of strings");
				}
			}
		},
		disabledCommands: {
			type: Array,
			default: [],
			validate: input => {
				if(input.every(value => typeof value === "string")) {
					return true;
				} else {
					throw new Error("Disabled commands must be an array of strings");
				}
			}
		}
	}
}), async (req, res) => {
	const resp = await superagent
		.put(`${req.app.locals.gatewayBaseURL}/settings/${req.params.guildId}/permissions/${req.params.id}`)
		.ok(({ status }) => status < 500)
		.send(req.verified);

	if(resp.status === 404) {
		return res.status(404).json({ error: "Role does not exist, or has no permissions set" });
	} else {
		return res.status(200).json(resp.body);
	}
});

router.delete("/:id", ratelimit({ max: 3, window: 5000 }), async (req, res) => {
	const resp = await superagent
		.delete(`${req.app.locals.gatewayBaseURL}/settings/${req.params.guildId}/permissions/${req.params.id}`)
		.ok(({ status }) => status < 500);

	if(resp.status === 404) {
		return res.status(404).json({ error: "Role does not exist, or has no permissions set" });
	} else {
		return res.status(204).end();
	}
});

module.exports = () => router;
