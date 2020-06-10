import { faAddressCard, faAsterisk, faChartLine, faCheck, faChevronDown, faChevronRight, faChevronUp, faCogs, faEdit, faExclamationCircle, faHashtag, faHeadphonesAlt, faHome, faMicrophoneAlt, faPlusSquare, faQuestion, faQuestionCircle, faSignInAlt, faSyncAlt, faTasks, faThumbsUp, faTimes, faUserEdit, faUserPlus, faUserTag, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { faRedditAlien, faTwitch } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import VueScrollReveal from "vue-scroll-reveal";

library.add(
	faAddressCard, faAsterisk, faChartLine, faChevronDown, faChevronRight, faChevronUp, faCogs, faEdit,
	faExclamationCircle, faHashtag, faHeadphonesAlt, faMicrophoneAlt, faHome,
	faPlusSquare, faQuestion, faQuestionCircle, faRedditAlien, faSignInAlt, faSyncAlt, faTasks, faTwitch,
	faUserEdit, faUserPlus, faUserTag, faVolumeUp, faCheck, faTimes, faThumbsUp
);

export default Vue => {
	Vue.component("font-awesome-icon", FontAwesomeIcon);
	Vue.use(VueScrollReveal, {
		class: "scroll-reveal"
	});

	["ChannelSelector", "Duration", "Navbar", "RoleSelector"]
		.forEach(file => Vue.component(file.toLowerCase(), () => import(`./${file}.vue`)));
};
