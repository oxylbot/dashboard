import account from "./account";
import client from "./client";
import guilds from "./guilds";
import Vuex from "vuex";

export default async Vue => {
	Vue.use(Vuex);

	const store = new Vuex.Store({
		modules: {
			account,
			client,
			guilds
		}
	});

	await store.dispatch("client/sync");
	await store.dispatch("account/sync");

	return store;
};
