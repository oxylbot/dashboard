import createRoutes from "./routes";
import VueRouter from "vue-router";

export default (Vue, store) => {
	Vue.use(VueRouter);

	return new VueRouter({
		mode: "history",
		routes: createRoutes(store)
	});
};
