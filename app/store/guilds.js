import apiRequest from "../apiRequest";
import Vue from "vue";

export default {
	namespaced: true,
	state: {},
	mutations: {
		add(state, guild) {
			Vue.set(state, guild.id, guild);
		},
		updateSetting(state, payload) {
			payload.path.split(".").reduce((setting, part, i, split) => {
				if(i === split.length - 1) Vue.set(setting, part, payload.value);
				return setting[part];
			}, state[payload.id].settings);
		},
		updateSettingArray(state, payload) {
			// payload.value requires 'id' attribute
			const array = state[payload.id].settings[payload.path];

			if(payload.action === "delete" && payload.value.id !== -1) {
				array.splice(array.findIndex(item => item.id === payload.value.id), 1);
			} else if(payload.action === "add") {
				array.push(payload.value);
			} else if(payload.action === "update") {
				array.splice(array.findIndex(item => item.id === payload.value.id), 1, payload.value);
			}
		}
	},
	actions: {
		sync: async ({ commit, state }, id) => {
			if(!state.hasOwnProperty(id)) {
				try {
					const { body: guild } = await apiRequest({ path: `settings/${id}` });

					commit("add", guild);
				} catch(err) {
					if(err.resp && err.resp.status === 404) {
						app.$router.push({ name: "invite" });
					}
				}
			}

			return state[id];
		}
	}
};
