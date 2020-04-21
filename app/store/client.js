import apiRequest from "../apiRequest";

export default {
	namespaced: true,
	state: {
		synced: false,
		id: process.env.BOT_ID
	},
	mutations: {
		setSynced(state) {
			state.synced = true;
		},
		setCommands(state, commands) {
			state.commands = commands;
		}
	},
	actions: {
		async sync({ commit, state }) {
			if(!state.synced) {
				const { body: commands } = await apiRequest({ path: "commands" });

				commit("setCommands", commands);
				commit("setSynced");
			}

			return true;
		}
	}
};
