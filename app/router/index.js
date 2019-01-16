import routes from "./routes";
import VueRouter from "vue-router";

export default Vue => {
	Vue.use(VueRouter);
	return new VueRouter({
		mode: "history",
		routes: routes
	});
};
