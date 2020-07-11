import { FETCH_SERVERS, FETCH_SERVER } from "@/store/actions.type";
import { SET_SERVERS, SET_SERVER } from "@/store/mutations.type";
import axios from "axios";

const state = {
	servers: [],
	server: {}
};

const actions = {
	async [FETCH_SERVERS](context) {
		const { data } = await axios.get("/api/servers");
		context.commit(SET_SERVERS, data);
	},

	async [FETCH_SERVER](context, serverSlug) {
		const { data } = await axios.get("/api/servers/" + serverSlug);
		context.commit(SET_SERVER, data);
	}
};

const mutations = {
	[SET_SERVERS](state, newServers) {
		state.servers = newServers;
	},

	[SET_SERVER](state, newServer) {
		state.server = newServer;
	}
};

const getters = {
	servers(state) {
		return state.servers;
	},

	onlineServers(state) {
		return state.servers.filter(server => server.online);
	},

	offlineServers(state) {
		return state.servers.filter(server => !server.online);
	},

	server(state) {
		return state.server;
	}
};

export default {
	state,
	actions,
	mutations,
	getters
};
