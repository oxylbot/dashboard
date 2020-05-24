export default store => [{
	name: "home",
	path: "/",
	component: () => import("../pages/Home.vue"),
	async beforeEnter(to, from, next) {
		if(from.name === null && to.query.code) {
			await store.dispatch("account/login", to.query.code);

			if(to.query.state) {
				return next({
					replace: true,
					path: decodeURIComponent(to.query.state)
				});
			} else if(to.query.guild_id) {
				return next({
					replace: true,
					name: "settings",
					params: { id: to.query.guild_id }
				});
			} else {
				return next({
					replace: true,
					name: "home"
				});
			}
		}

		return next();
	}
}, {
	name: "invite",
	path: "/invite",
	beforeEnter(to, from, next) {
		window.location.href = `https://discordapp.com/api/oauth2/authorize?client_id=${store.state.client.id}` +
			`&permissions=288418870&redirect_uri=${encodeURIComponent(store.state.client.redirectURI)}` +
			"&response_type=code&scope=bot%20identify%20guilds";
	}
}, {
	name: "login",
	path: "/login",
	beforeEnter(to, from, next) {
		let login = `https://discordapp.com/api/oauth2/authorize?client_id=${store.state.client.id}` +
			`&permissions=288418870&redirect_uri=${encodeURIComponent(store.state.client.redirectURI)}` +
			"&response_type=code&scope=identify%20guilds";

		if(from.name !== null) login += `&state=${encodeURIComponent(from.path)}`;

		window.location.href = login;
	}
}, {
	name: "logout",
	path: "/logout",
	beforeEnter(to, from, next) {
		store.dispatch("account/logout");

		if(from.name === null) {
			return next({
				replace: true,
				name: "home"
			});
		} else {
			return next({
				replace: true,
				path: from.path
			});
		}
	}
}, {
	name: "support",
	path: "/support",
	beforeEnter(to, from, next) {
		window.location.href = "http://discord.gg/9wkTDcE";
	}
}, {
	name: "status",
	path: "/status",
	component: () => import("../pages/Status.vue")
}, {
	name: "commands",
	path: "/commands",
	component: () => import("../pages/Commands.vue")
}, {
	name: "settings",
	path: "/settings/:id(\\d+)",
	component: () => import("../pages/Settings.vue"),
	children: [{
		name: "settings.censors",
		path: "censors",
		component: () => import("../pages/settings/Censors.vue")
	}, {
		name: "settings.channels",
		path: "channels",
		component: () => import("../pages/settings/Channels.vue")
	}, {
		name: "settings.modlog",
		path: "modlog",
		component: () => import("../pages/settings/ModLog.vue")
	}, {
		name: "settings.music",
		path: "music",
		component: () => import("../pages/settings/Music.vue")
	}, {
		name: "settings.permissions",
		path: "permissions",
		component: () => import("../pages/settings/Permissions.vue")
	}, {
		name: "settings.prefix",
		path: "prefix",
		component: () => import("../pages/settings/Prefix.vue")
	}, {
		name: "settings.reddit",
		path: "reddit",
		component: () => import("../pages/settings/Reddit.vue")
	}, {
		name: "settings.roles",
		path: "roles",
		component: () => import("../pages/settings/Roles.vue")
	}, {
		name: "settings.suggestions",
		path: "suggestions",
		component: () => import("../pages/settings/Suggestions.vue")
	}, {
		name: "settings.twitch",
		path: "twitch",
		component: () => import("../pages/settings/Twitch.vue")
	}, {
		name: "settings.userlog",
		path: "userlog",
		component: () => import("../pages/settings/UserLog.vue")
	}]
}, {
	name: "404",
	path: "*",
	component: () => import("../pages/404.vue")
}];
