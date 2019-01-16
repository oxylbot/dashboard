import createRouter from "./router/index";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import pace from "pace-progress";
import registerComponents from "./components/index";
import Vue from "vue";

library.add(faCoffee);
Vue.component("font-awesome-icon", FontAwesomeIcon);

pace.start();
registerComponents(Vue);

window.app = new Vue({
	el: "#app",
	router: createRouter(Vue)
});
