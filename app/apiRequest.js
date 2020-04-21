export default request;

async function request(options) {
	options.headers = options.headers || {};
	options.method = options.method || "GET";

	if(options.body) {
		options.headers["Content-Type"] = "application/json";
		options.body = JSON.stringify(options.body);
	}

	if(options.query) {
		options.path += (options.path.includes("?") ? "&" : "?") + Object.entries(options.query)
			.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
			.join("&");
	}

	const resp = await fetch(`${window.origin}/api/${options.path}`, options);
	Object.defineProperty(resp, "body", {
		value: await resp.json(),
		writable: false
	});

	if(!resp.ok) {
		const error = new Error(`API Request Error ${options.path}: ${resp.status} ${resp.statusText}: ${JSON.stringify(resp.body)}`);
		error.resp = resp;

		throw error;
	} else {
		return resp;
	}
}
