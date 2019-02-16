export default [{
	name: "home",
	path: "/",
	component: () => import("../pages/Home.vue")
}, {
	name: "dashboard",
	path: "/dashboard",
	component: () => import("../pages/Dashboard.vue")
}, {
	name: "dashboard",
	path: "/dashboard/:id",
	component: () => import("../pages/Dashboard.vue")
}];
