const express = require("express");
const router = express.Router(); // eslint-disable-line new-cap

const commands = require("./commands");
const oauth2 = require("./oauth2");
const settings = require("./settings/index");

router.use("/commands", commands());
router.use("/oauth2", oauth2());
router.use("/settings", settings());

router.all("*", (req, res) => {
	res.status(404).json({ error: "Not found" });
});

module.exports = () => router;
