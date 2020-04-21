try { require("dotenv").config(); } catch(err) { } // eslint-disable-line no-empty

const api = require("./api/index");
const express = require("express");
const path = require("path");

const app = express();

const isDevelopment = process.env.NODE_ENV === "development";

app.locals.gatewayBaseURL = `http://gateway:${process.env.GATEWAY_SERVICE_PORT}`;

app.enable("trust proxy");
app.disable("etag");
app.disable("x-powered-by");
app.set("env", process.env.NODE_ENV);

app.use(express.json());
app.use(express.static(
	path.resolve(__dirname, "..", "build"),
	{ maxAge: isDevelopment ? 0 : 31536000000 }
));

app.use("/api", api());
app.get("*", (req, res) => {
	res.header("cache-control", "no-cache, no-store, must-revalidate");
	res.status(200).sendFile(path.resolve(__dirname, "..", "build", "app.html"));
});

app.listen(process.env.DASHBOARD_SERVICE_PORT, isDevelopment ? "127.0.0.1" : "0.0.0.0");

process.on("unhandledRejection", err => {
	console.error(err.stack);
	process.exit(1);
});
