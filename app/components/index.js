import { faCogs, faExclamationCircle, faHome, faQuestionCircle, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import VueScrollReveal from "vue-scroll-reveal";

library.add(faCogs);
library.add(faExclamationCircle);
library.add(faHome);
library.add(faQuestionCircle);
library.add(faUserPlus);

export default Vue => {
	Vue.component("font-awesome-icon", FontAwesomeIcon);
	Vue.use(VueScrollReveal, {
		class: "scroll-reveal"
	});

	["Navbar"]
		.forEach(file => Vue.component(file.toLowerCase(), () => import(`./${file}.vue`)));
};
