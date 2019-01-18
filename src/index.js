const express = require("express");
const path = require("path");
// const superagent = require("superagent");

const app = express();

app.enable("trust proxy");
app.disable("etag");
app.disable("x-powered-by");
app.set("env", process.env.NODE_ENV);

app.use(express.json());
app.use(express.static(
	path.resolve(__dirname, "..", "build"),
	{ maxAge: process.env.NODE_ENV === "development" ? 0 : 31536000000 }
));

app.get("*", (req, res) => {
	res.header("cache-control", "no-cache, no-store, must-revalidate");
	res.status(200).sendFile(path.resolve(__dirname, "..", "build", "app.html"));
});

app.listen(process.env.DASHBOARD_PORT);
