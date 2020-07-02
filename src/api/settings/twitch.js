const express = require("express");
const ratelimit = require("../../middleware/ratelimits");
const superagent = require("superagent");
const verify = require("../../middleware/verify");

const router = express.Router({ mergeParams: true })); // eslint-disable-line new-cap

router.post("/", ratelimit({ max: 1, window: 5000 }), verify({
	type: "body",
	fields: {
		channelName: {
			type: String,
			validate: input => {
				if(input.length > 32) throw new Error("Channel name must be less than 32 characters");
				else return true;
			}
		},
		channelId: {
			type: String,
			optional: true,
			validate: input => {
				if(/\d+/.test(input)) return true;
				else throw new Error("Channel ID must be a snowflake");
			}
		}
	}
}), async (req, res) => {
	const resp = await superagent
		.post(`${req.app.locals.gatewayBaseURL}/settings/${req.params.guildId}/twitch`)
		.ok(({ status }) => status < 500)
		.send({
			channelName: req.body.channelName,
			channelId: req.body.channelId
		});

	res.status(200).json(resp.body);
});

router.patch("/:id", ratelimit({ max: 3, window: 5000 }), verify({
	type: "body",
	minimumFields: 1,
	fields: {
		channelName: {
			type: String,
			validate: input => {
				if(input.length > 32) throw new Error("Channel name must be less than 32 characters");
				else return true;
			}
		},
		channelId: {
			type: String,
			optional: true,
			validate: input => {
				if(/\d+/.test(input)) return true;
				else throw new Error("Channel ID must be a snowflake");
			}
		}
	}
}), async (req, res) => {
	const resp = await superagent
		.patch(`${req.app.locals.gatewayBaseURL}/settings/${req.params.guildId}/twitch/${req.params.id}`)
		.ok(({ status }) => status < 500)
		.send(req.verified);

	if(resp.status === 404) {
		return res.status(404).json({ error: "Twitch feed does not exist" });
	} else {
		return res.status(200).json(resp.body);
	}
});

router.delete("/:id", ratelimit({ max: 3, window: 5000 }), async (req, res) => {
	const resp = await superagent
		.delete(`${req.app.locals.gatewayBaseURL}/settings/${req.params.guildId}/twitch/${req.params.id}`)
		.ok(({ status }) => status < 500);

	if(resp.status === 404) {
		return res.status(404).json({ error: "Twitch feed does not exist" });
	} else {
		return res.status(204).end();
	}
});

module.exports = () => router;

