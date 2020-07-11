import axios from "axios";
import moment from "moment";

export const INTERVAL_1m = [1, "m"];
export const INTERVAL_5m = [5, "m"];
export const INTERVAL_10m = [10, "m"];
export const INTERVAL_30m = [30, "m"];
export const INTERVAL_1h = [1, "h"];
export const INTERVAL_3h = [3, "h"];
export const INTERVAL_6h = [6, "h"];
export const INTERVAL_1d = [1, "d"];

export const INTERVAL = {
	"1m": INTERVAL_1m,
	"5m": INTERVAL_5m,
	"10m": INTERVAL_10m,
	"30m": INTERVAL_30m,
	"1h": INTERVAL_1h,
	"3h": INTERVAL_3h,
	"6h": INTERVAL_6h,
	"1d": INTERVAL_1d
};

const StatsFetcher = {
	fetchStats: async function(serverSlug, from, to, samplingInterval) {
		from = moment(from).utc();
		to = moment(to).utc();
		const { data } = await axios.get("/api/stats/" + serverSlug + "/numplayers?from=" + from.format() + "&to=" + to.format() + "&samplingInterval=" + samplingInterval.join(""));

		data.from = moment(data.from);
		data.to = moment(data.to);
		return data;
	}
};

class StatsChunk {
	constructor(serverSlug, from, samplingInterval) {
		this.serverSlug = serverSlug;
		this.name = serverSlug;
		this.stats = [];
		this.from = from.clone();
		this.to = from.clone();

		this.samplingInterval = samplingInterval || INTERVAL_1m;
	}

	isToday() {
		return this.from.isSame(moment().startOf("day"));
	}

	start() {
		return this.from;
	}

	end() {
		return moment();
	}

	last() {
		return moment
			.min([this.end(), moment()])
			.clone()
			.startOf("minute");
	}

	isFullLoaded() {
		return this.to >= this.last();
	}

	setSamplingInterval(samplingInterval) {
		if (this.samplingInterval.join("") == samplingInterval.join("")) return;

		this.samplingInterval = samplingInterval;
		// need to full reload to get up/down sampled data
		this.to = this.from.clone();
		this.stats = [];
	}

	/**
	 * returns loaded parts
	 */
	async fullLoad(samplingInterval) {
		if (samplingInterval) this.setSamplingInterval(samplingInterval);

		if (this.isFullLoaded()) return;

		var from = this.to;
		var to = this.last();
		var interval = moment(0).add(...this.samplingInterval);
		var { server, result } = await StatsFetcher.fetchStats(this.serverSlug, from, to, this.samplingInterval);

		if (!this.isToday()) {
			var expectedLength = (to - from) / interval;
			for (var i = result.length; i < expectedLength; i++) {
				result.push(null);
			}
		}

		this.to = moment(from + interval * result.length);
		this.stats = this.stats.concat(result);
		this.name = server;

		return new StatsChunkResult(this, result, from, to);
	}

	getStats(from, to) {
		if (!from && !to) return this.stats;

		from = moment(from || 0);
		to = moment(to);

		// completely exclude range
		if (to < this.from || this.to <= from) return [];

		// completely include range
		if (from <= this.from && this.to < to) return this.stats;

		// intersect with range
		var interval = moment(0)
			.add(...this.samplingInterval)
			.valueOf();
		var from_i = Math.max(0, parseInt((from - this.from) / interval));
		var to_i = Math.min(this.stats.length, Math.ceil((to - this.from) / interval));

		// console.log("stats: ", this.from + from_i * interval, this.from + to_i * interval);
		// console.log("stats samplingInterval: ", this.samplingInterval.join(""));
		// console.log("stats length: ", this.stats.length);
		// console.log("stats sliced: ", to_i - from_i, `${from_i}~${to_i}`);
		return this.stats.slice(from_i, to_i);
	}
}

class StatsChunkDaily extends StatsChunk {
	constructor(serverSlug, day) {
		super(serverSlug, moment(day).startOf("day"));
	}

	end() {
		return this.from.clone().add(1, "days");
	}
}

class StatsChunkMonthly extends StatsChunk {
	constructor(serverSlug, month) {
		super(serverSlug, moment(month).startOf("month"), INTERVAL_1h);
	}

	end() {
		return this.from.clone().add(1, "month");
	}
}

class StatsChunkResult extends StatsChunk {
	constructor(createdBy, stats, from, to) {
		super(createdBy.serverSlug, from, createdBy.samplingInterval);

		this.name = createdBy.name;
		this.stats = stats;
		this.to = moment(to);

		// add label (['name', y1, y2, y3 ...])
		this.stats.unshift(this.name);
	}

	getAxisValues() {
		var interval = moment(0)
			.add(...this.samplingInterval)
			.valueOf();
		var from = Math.max(0, this.from - (this.from % interval));
		var to_i = Math.min(this.stats.length - 1, Math.ceil((this.to - this.from) / interval));
		var result = ["x"];
		for (var i = 0; i < to_i; i++) {
			result.push(from + i * interval);
		}
		// console.log("stats samplingInterval: ", this.samplingInterval.join(""));
		// console.log("axis: ", result[1], result[result.length - 1]);
		return result;
	}
}

export const StatsService = {
	chunks: {},

	adjustSamplingInterval: function(from, to) {
		var duration = moment.duration(moment(to) - from).asMinutes();

		if (duration < 500) {
			return INTERVAL_1m;
		} else if (duration < 2500) {
			return INTERVAL_5m;
		} else if (duration < 5000) {
			return INTERVAL_10m;
		} else if (duration < 10000) {
			return INTERVAL_30m;
		} else if (duration < 20000) {
			return INTERVAL_1h;
		}
		return INTERVAL_1h;
	},

	loadChunks: async function(serverSlug, from, to, samplingInterval) {
		var fromDay = from.clone().startOf("days");
		var toDay = to.clone().startOf("days");

		if (!this.chunks[serverSlug]) this.chunks[serverSlug] = {};

		var enumDays = [];
		enumDays.push(fromDay.clone());
		if (fromDay < toDay) {
			while (fromDay < toDay) enumDays.push(fromDay.add(1, "days").clone());
		}

		var waitFor = [];
		var requestedChunks = enumDays.map(day => {
			var chunk = this.chunks[day.format()];

			if (!(chunk instanceof StatsChunk)) {
				// if chunk is not exists, create one
				this.chunks[serverSlug][day.format()] = chunk = new StatsChunkDaily(serverSlug, day);

				if (chunk.isToday()) this.chunks[serverSlug].today = chunk;
			}
			// check if chunk is full loaded. if false, full load
			if (!chunk.isFullLoaded()) waitFor.push(chunk.fullLoad(samplingInterval));

			return chunk;
		});

		await Promise.all(waitFor);
		return requestedChunks;
	},

	getStats: async function(serverSlug, from, to, samplingInterval) {
		from = moment(from);
		to = moment(to);
		var chunks = await this.loadChunks(serverSlug, from, to, samplingInterval);

		// console.log(chunks);

		var result = chunks.map(chunk => chunk.getStats(from, to)).flat();
		console.log("stats manipulated: ", result);

		return new StatsChunkResult(chunks[0], result, from, to);
	},

	getRecentStats: async function(serverSlug) {
		if (!this.chunks[serverSlug] || !this.chunks[serverSlug].today) return;

		return await this.chunks[serverSlug].today.fullLoad();
	}
};

export default StatsService;
