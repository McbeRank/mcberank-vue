import { FETCH_SERVER_STATS, FETCH_SERVER_STATS_RECENT } from "@/store/actions.type";
import { UPDATE_SERVER_STATS, UPDATE_SERVER_STATS_RECENT } from "@/store/mutations.type";
import StatsService from "@/common/stats.service";
import moment from "moment";

function updateStats(store, serverSlug, result) {
	if (!result.stats.length) return;
	if (!moment(store.from).isSame(result.from) || !moment(store.to).isSame(result.to) || (store.samplingInterval || []).join() != result.samplingInterval.join()) {
		store.from = result.from;
		store.to = result.to;
		store.samplingInterval = result.samplingInterval;
		store.axisValues = result.getAxisValues();
	}
	store[serverSlug] = result.getStats();
}

const state = {
	stats: {},
	recentStats: {}
};

const actions = {
	async [FETCH_SERVER_STATS](context, { serverSlug, from, to, samplingInterval }) {
		var result = await StatsService.getStats(serverSlug, from, to, samplingInterval);
		context.commit(UPDATE_SERVER_STATS, {
			serverSlug: serverSlug,
			result: result
		});
	},

	async [FETCH_SERVER_STATS_RECENT](context, { serverSlug }) {
		var result = await StatsService.getRecentStats(serverSlug);
		if (!result) result = { stats: [] };

		context.commit(UPDATE_SERVER_STATS_RECENT, {
			serverSlug: serverSlug,
			result: result
		});
	}
};

const mutations = {
	[UPDATE_SERVER_STATS](state, { serverSlug, result }) {
		updateStats(state.stats, serverSlug, result);
	},

	[UPDATE_SERVER_STATS_RECENT](state, { serverSlug, result }) {
		if (!result.stats.length) state.recentStats[serverSlug] = [];
		updateStats(state.recentStats, serverSlug, result);
	}
};

const getters = {
	stats(state) {
		return state.stats;
	},

	recentStats(state) {
		return state.recentStats;
	}
};

export default {
	state,
	actions,
	mutations,
	getters
};
