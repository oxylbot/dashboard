module.exports = settings => (req, res, next) => {
	req.verified = {}; // stripped object with nothing extra
	const toVerify = req[settings.type];

	let fieldsPresent = 0;
	const errors = [];
	for(const [field, options] of Object.entries(settings.fields)) {
		let value = toVerify[field];
		let defaultValue = null;
		let optional = false;
		let types = null;
		let validate = null;

		if(typeof options === "object" && options !== Object) {
			optional = !!options.optional || settings.minimumFields !== undefined;
			types = options.type;
			validate = options.validate || null;
			defaultValue = options.default || null;
		} else {
			types = options;
		}

		if(!Array.isArray(types)) types = [types];

		if(Object.prototype.hasOwnProperty.call(toVerify, field)) {
			fieldsPresent++;
		} else if(defaultValue) {
			value = defaultValue;
			fieldsPresent++;
		} else if(!optional) {
			errors.push(`Required field ${field} is missing`);
			continue;
		} else if(optional) {
			continue;
		}

		let valueType = null;
		if(typeof value === "string") {
			if(settings.type === "query") {
				if(!isNaN(value)) {
					value = parseFloat(value);
					valueType = Number;
				} else if(["true", "false"].includes(value)) {
					value = {
						true: true,
						false: false
					}[value];
					valueType = Boolean;
				} else {
					valueType = String;
				}
			} else {
				valueType = String;
			}
		} else if(typeof value === "number" && !isNaN(value)) {
			valueType = Number;
		} else if(typeof value === "boolean") {
			valueType = Boolean;
		} else if(typeof value === "object" && Array.isArray(value)) {
			valueType = Array;
		} else if(typeof value === "object" && value !== null) {
			valueType = Object;
		}

		if(!types.includes(valueType)) {
			errors.push(`Invalid type for field ${field}; expected ${types.join(", ")}`);
			continue;
		}

		if(validate) {
			try {
				validate(value);
			} catch(error) {
				errors.push(error.message);
				continue;
			}
		}

		toVerify[field] = value;
		req.verified[field] = value;
	}

	if(settings.minimumFields && fieldsPresent < settings.minimumFields) {
		return res.status(400).json({ error: `Required minimum of at least ${settings.minimumFields} field(s)` });
	} else if(fieldsPresent === 0 && settings.nextIfNone) {
		return next("route");
	} else if(errors.length) {
		return res.status(400).json({ errors });
	} else {
		return next();
	}
};
