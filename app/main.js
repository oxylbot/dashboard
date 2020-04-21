import createRouter from "./router/index";
import createStore from "./store/index";
import pace from "pace-progress";
import registerComponents from "./components/index";
import Vue from "vue";

pace.start();

registerComponents(Vue);

(async () => {
	const store = await createStore(Vue);

	window.app = new Vue({
		el: "#app",
		store,
		router: createRouter(Vue, store)
	});
})();

