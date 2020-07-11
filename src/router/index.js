import Vue from "vue";
import VueRouter from "vue-router";
import config from "@/common/config";

Vue.use(VueRouter);

export default new VueRouter({
	mode: "history",
	base: config.baseUrl,
	scrollBehavior() {
		return { x: 0, y: 0 };
	},
	routes: [
		{
			path: "/",
			name: "root",
			redirect: "/servers"
		},
		{
			path: "/servers",
			name: "servers",
			component: () => import("@/views/Servers")
		},
		{
			path: "/servers/new",
			name: "create-server",
			component: () => import("@/views/CreateServer")
		},
		{
			path: "/servers/:slug",
			name: "server",
			props: true,
			component: () => import("@/views/Server")
		},
		{
			path: "/query",
			name: "query-server",
			component: () => import("@/views/QueryServer")
		},
		{
			path: "/plugins",
			name: "plugins",
			component: () => import("@/views/Plugins")
		}
	]
});
