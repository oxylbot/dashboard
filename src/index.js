const api = require("./api/index");
const express = require("express");
const expressWinston = require("express-winston");
const logger = require("./logger");
const path = require("path");

const app = express();

const isDevelopment = process.env.NODE_ENV === "development";

app.locals.gatewayBaseURL = `http://gateway:${process.env.GATEWAY_SERVICE_PORT}`;

app.enable("trust proxy");
app.disable("etag");
app.disable("x-powered-by");
app.set("env", process.env.NODE_ENV);

app.use(express.json());
app.use(expressWinston.logger({ winstonInstance: logger }));
app.use(express.static(
	path.resolve(__dirname, "..", "build"),
	{ maxAge: isDevelopment ? 0 : 31536000000 }
));

app.use("/api", api());
app.get("*", (req, res) => {
	res.header("cache-control", "no-cache, no-store, must-revalidate");
	res.status(200).sendFile(path.resolve(__dirname, "..", "build", "app.html"));
});

app.use(expressWinston.errorLogger({ winstonInstance: logger }));
app.listen(process.env.DASHBOARD_SERVICE_PORT, () => {
	logger.info(`REST API listening on port ${process.env.DASHBOARD_SERVICE_PORT}`);
});

process.on("unhandledRejection", error => {
	logger.error(error.message, { error });
	process.exit(1);
});
