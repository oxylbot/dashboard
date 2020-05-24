import apiRequest from "../apiRequest";

export default {
	namespaced: true,
	state: {
		synced: false,
		commands: {},
		id: null,
		redirectURI: null
	},
	mutations: {
		setSynced(state) {
			state.synced = true;
		},
		setCommands(state, commands) {
			state.commands = commands;
		},
		setOAuth2Info(state, info) {
			state.id = info.clientId;
			state.redirectURI = info.redirectURI;
		}
	},
	actions: {
		async sync({ commit, state }) {
			if(!state.synced) {
				const { body: commands } = await apiRequest({ path: "commands" });
				const { body: oauth2Info } = await apiRequest({ path: "ouath2/info" });

				commit("setCommands", commands);
				commit("setOAuth2Info", oauth2Info);
				commit("setSynced");
			}

			return true;
		}
	}
};
