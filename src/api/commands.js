const express = require("express");
const fs = require("fs");
const path = require("path");
const ratelimit = require("../middleware/ratelimits");
const verify = require("../middleware/verify");

const router = express.Router(); // eslint-disable-line new-cap
const commands = {};

const commandFilesDir = path.resolve(__dirname, "..", "..", "command-md-files");
fs.readdirSync(commandFilesDir).forEach(category => {
	const directory = path.resolve(commandFilesDir, category);

	if(!fs.lstatSync(directory).isDirectory()) return;

	commands[category] = fs.readdirSync(directory).reduce((paths, file) => {
		paths[path.basename(file, path.extname(file))] = path.resolve(directory, file);

		return paths;
	}, {});
});

router.get("/:category/:command", ratelimit({ max: 5, window: 3000 }), async (req, res) => {
	if(!commands.hasOwnProperty(req.params.category)) {
		res.status(404).json({ error: "Category not found" });
	} else if(!commands[req.query.category].hasOwnProperty(req.params.command)) {
		res.status(404).json({ error: "Command not found in category" });
	} else {
		const file = await fs.promises.readFile(commands[req.query.category][req.query.command], "utf8");

		res.status(200).json({ file });
	}
});

router.get("/", ratelimit({ max: 5, window: 5000 }), (req, res) => {
	res.status(200).json(Object.entries(commands).reduce((commandList, [category, pathMap]) => {
		commandList[category] = Object.keys(pathMap);

		return commandList;
	}, {}));
});

module.exports = () => router;
