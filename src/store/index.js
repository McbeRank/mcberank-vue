import Vue from "vue";
import Vuex from "vuex";

import server from "./modules/server";
import plugin from "./modules/plugin";
import stats from "./modules/stats";

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		server,
		plugin,
		stats
	}
});
