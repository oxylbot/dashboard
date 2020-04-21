import apiRequest from "../apiRequest";

export default {
	namespaced: true,
	state: {
		id: null,
		avatar: null,
		discriminator: null,
		username: null,
		token: localStorage.getItem("token"),
		synced: false,
		guilds: []
	},
	getters: {
		avatar: state => {
			if(state.avatar) {
				return `https://cdn.discordapp.com/avatars/${state.id}/${state.avatar}.${state.avatar.startsWith("a_") ? "gif" : "png"}?size=128`;
			} else {
				return `https://cdn.discordapp.com/embed/avatars/${parseInt(state.discriminator) % 5}.png`;
			}
		}
	},
	mutations: {
		setSynced(state, value) {
			state.synced = value;
		},
		logout(state) {
			localStorage.removeItem("token");

			state.id = null;
			state.avatar = null;
			state.discriminator = null;
			state.username = null;
			state.token = null;
			state.guilds = [];
		},
		setToken(state, token) {
			localStorage.token = token;
			state.token = token;
		},
		updateData(state, payload) {
			state.id = payload.id;
			state.avatar = payload.avatar;
			state.discriminator = payload.discriminator;
			state.username = payload.username;
			state.guilds = payload.guilds;
		}
	},
	actions: {
		async sync({ commit, state }) {
			if(!state.synced) {
				if(state.token) {
					try {
						const { body: user } = await apiRequest({
							path: "oauth2/users/@me",
							headers: {
								Authorization: state.token
							}
						});

						const { body: guilds } = await apiRequest({
							path: "oauth2/users/@me/guilds",
							headers: {
								Authorization: state.token
							}
						});

						commit("updateData", {
							...user,
							guilds
						});
					} catch(err) {
						if(err.resp && [400, 401, 500].includes(err.resp.status)) commit("logout");
					}
				}

				commit("setSynced", true);
			}

			return true;
		},
		async login({ commit, dispatch }, code) {
			try {
				const { body: { token } } = await apiRequest({
					path: "oauth2/token",
					method: "POST",
					body: { code }
				});

				commit("setToken", token);
				commit("setSynced", false);
			} catch(err) {
				if(err.resp && [400, 401, 500].includes(err.resp.status)) commit("logout");
			}


			dispatch("sync");
		}
	}
};
