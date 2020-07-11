import { FETCH_PLUGINS } from "@/store/actions.type";
import { SET_PLUGINS } from "@/store/mutations.type";
import axios from "axios";

const state = {
	plugins: [],
	pluginsVersionMapped: []
};

const actions = {
	async [FETCH_PLUGINS](context) {
		const { data } = await axios.get("/api/plugins");
		context.commit(SET_PLUGINS, data);
	}
};

const mutations = {
	[SET_PLUGINS](state, newPlugins) {
		state.plugins = newPlugins;

		var mapped = {};
		newPlugins.forEach(plugin => {
			if (!mapped[plugin.name])
				mapped[plugin.name] = {
					versions: []
				};

			mapped[plugin.name].versions.push({
				version: plugin.version,
				servers: plugin.servers
			});
		});

		state.pluginsVersionMapped = Object.keys(mapped)
			.map(name => ({
				name: name,
				servers: mapped[name].versions.reduce((a, c) => a + c.servers, 0),
				versions: mapped[name].versions
			}))
			.sort((a, b) => b.servers - a.servers);

		console.log(this.pluginsVersionMapped);
	}
};

const getters = {
	plugins(state) {
		return state.plugins;
	},

	pluginsVersionMapped(state) {
		return state.pluginsVersionMapped;
	}
};

export default {
	state,
	actions,
	mutations,
	getters
};
