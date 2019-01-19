import { faCogs, faExclamationCircle, faHome, faQuestionCircle, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";

library.add(faCogs);
library.add(faExclamationCircle);
library.add(faHome);
library.add(faQuestionCircle);
library.add(faUserPlus);

export default Vue => {
	Vue.component("font-awesome-icon", FontAwesomeIcon);

	["Navbar"]
		.forEach(file => Vue.component(file.toLowerCase(), () => import(`./${file}.vue`)));
};
