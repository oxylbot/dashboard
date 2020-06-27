const express = require("express");
const oauth = require("../../oauth2");
const ratelimit = require("../../middleware/ratelimits");
const superagent = require("superagent");

const router = express.Router(); // eslint-disable-line new-cap

const censors = require("./censors");
const channels = require("./channels");
const modLog = require("./modLog");
const music = require("./music");
const permissions = require("./permissions");
const prefix = require("./prefix");
const reddit = require("./reddit");
const roles = require("./roles");
const suggestions = require("./suggestions");
const twitch = require("./twitch");

router.use("/:id(\d+)", async (req, res, next) => {
	const auth = req.get("authorization");
	if(!auth) return res.status(401).json({ error: "No Authorization header" });

	try {
		const guilds = await oauth.request(auth, "users/@me/guilds");
		const guild = guilds.find(({ id }) => id === req.params.id);

		if(!guild) {
			return res.status(400).json({ error: "User is not in server" });
		} else if(!guild.owner && !(guild.permissions & 32)) {
			return res.status(403).json({ error: "User is not owner, nor do they have permission to manage guild" });
		}

		return next();
	} catch(err) {
		if(err.status) {
			return res.status(err.status).json({ error: err.message });
		} else {
			return res.status(500).json({ error: "Internal server error" });
		}
	}
});

router.use("/:guildId(\d+)/censors", censors());
router.use("/:guildId(\d+)/channels", channels());
router.use("/:guildId(\d+)/mod-log", modLog());
router.use("/:guildId(\d+)/music", music());
router.use("/:guildId(\d+)/permissions", permissions());
router.use("/:guildId(\d+)/prefix", prefix());
router.use("/:guildId(\d+)/reddit", reddit());
router.use("/:guildId(\d+)/roles", roles());
router.use("/:guildId(\d+)/suggestions", suggestions());
router.use("/:guildId(\d+)/twitch", twitch());


router.get("/:id(\d+)", ratelimit({ max: 3, window: 5000 }), async (req, res) => {
	const resp = await superagent.get(`${req.app.locals.gatewayBaseURL}/settings/${req.params.id}`)
		.ok(({ status }) => status < 500);

	if(resp.status === 404) {
		return res.status(404).json({ error: "Oxyl not in guild" });
	}

	// const guild = {
	// 	id: "254768930223161344",
	// 	name: "Oxyl Support",
	// 	icon: "55f43c27e5b592a5e97047ac088e0cce",
	// 	channels: [{ type: 0, name: "info", id: "254768930223161344" },
	// 		{ type: 0, name: "support", id: "254769467815362561" },
	// 		{ type: 0, name: "testing", id: "254769846892494848" },
	// 		{ type: 0, name: "github", id: "254770129361960960" },
	// 		{ type: 0, name: "general", id: "254770965018443776" },
	// 		{ type: 0, name: "announcements", id: "254771761646665728" },
	// 		{ type: 0, name: "server-log", id: "265998475831934977" },
	// 		{ type: 0, name: "updates", id: "270576454117359617" },
	// 		{ type: 0, name: "mod-log", id: "271790945383481354" },
	// 		{ type: 2, name: "♫♪ (96kbps)", id: "286653410139176961" },
	// 		{ type: 0, name: "staff", id: "287011135063064576" },
	// 		{ type: 2, name: "General", id: "293170404879761408" },
	// 		{ type: 0, name: "donors", id: "294898132896972810" },
	// 		{ type: 0, name: "status", id: "297575226093338625" },
	// 		{ type: 0, name: "translators", id: "310430529264549898" },
	// 		{ type: 0, name: "suggestions", id: "359458014585159680" },
	// 		{ type: 4, name: "info", id: "360568022429204480" },
	// 		{ type: 4, name: "discussion", id: "360568066050097165" },
	// 		{ type: 4, name: "logs", id: "360568095473008642" },
	// 		{ type: 4, name: "voice", id: "360568630653616139" },
	// 		{ type: 0, name: "beta", id: "441396938718314507" },
	// 		{ type: 0, name: "chat", id: "503757649049813006" },
	// 		{ type: 4, name: "developers", id: "503758833295032331" }],
	// 	roles: [{ color: 12745742, name: "Oxyl", id: "315586631895613441" },
	// 		{ color: 15277667, name: "Founder", id: "254775500336005120" },
	// 		{ color: 1752220, name: "Moderator", id: "286263263707004938" },
	// 		{ color: 5348183, name: "Developer", id: "279459162885193728" },
	// 		{ color: 9807270, name: "Support", id: "281084316308602881" },
	// 		{ color: 14870243, name: "egg", id: "377237943779065889" },
	// 		{ color: 0, name: "Patreon", id: "292658297058885633" },
	// 		{ color: 15844367, name: "Donator", id: "292657073987125249" },
	// 		{ color: 3066993, name: "Translators", id: "310429923321970688" },
	// 		{ color: 14973048, name: "Updates", id: "265293123821895680" },
	// 		{ color: 3447003, name: "No Logs", id: "287002160825368576" },
	// 		{ color: 14631490, name: "Muted", id: "269629626530136074" },
	// 		{ color: 0, name: "@everyone", id: "254768930223161344" }],
	// 	settings: {
	// 		censors: [{
	// 			id: 124128342,
	// 			name: "invite filter",
	// 			description: "stops people from posting invites",
	// 			punishment: "mute",
	// 			duration: 45678,
	// 			regex: "(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]",
	// 			whitelistedRoles: ["254775500336005120", "279459162885193728"]
	// 		}],
	// 		channels: {
	// 			enabled: true,
	// 			category: "360568066050097165"
	// 		},
	// 		modlog: {
	// 			enabled: true,
	// 			channel: "271790945383481354",
	// 			warningDuration: 43800,
	// 			thresholds: [{
	// 				trigger: 2,
	// 				id: 12456,
	// 				punishment: "mute",
	// 				duration: 45678,
	// 				whitelistedRoles: ["254775500336005120"]
	// 			}]
	// 		},
	// 		music: {
	// 			nowPlaying: true,
	// 			voteSkip: false,
	// 			maxLength: 5
	// 		},
	// 		permissions: {
	// 			["254775500336005120"]: {
	// 				enabledCommands: ["ban"],
	// 				disabledCommands: ["help"]
	// 			}
	// 		},
	// 		prefix: {
	// 			custom: "",
	// 			overwrite: false
	// 		},
	// 		reddit: [{
	// 			id: 124128342,
	// 			subreddit: "me_irl",
	// 			type: "hot",
	// 			channel: "254769846892494848"
	// 		}],
	// 		roles: {
	// 			autorole: ["265293123821895680"],
	// 			roleme: ["287002160825368576", "265293123821895680"],
	// 			autorolebot: ["286263263707004938"]
	// 		},
	// 		suggestions: {
	// 			enabled: true,
	// 			channel: "359458014585159680"
	// 		},
	// 		twitch: [{
	// 			id: 124128342,
	// 			channelName: "biinny",
	// 			discordChannel: "441396938718314507"
	// 		}]
	// 	}
	// };

	const guild = {
		id: resp.id,
		name: resp.name,
		icon: resp.icon,
		channels: resp.channels,
		roles: resp.roles,
		settings: resp.settings
	};

	return res.status(200).json(guild);
});

module.exports = () => router;
