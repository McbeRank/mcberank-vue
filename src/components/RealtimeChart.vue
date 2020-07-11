<template>
	<b-overlay :show="isLoading" opacity="0.75" rounded="sm">
		<b-card no-body class="mb-4 py-3">
			<div id="chart" />

			<div class="d-flex justify-content-center">
				<b-form-group class="my-0">
					<b-form-radio-group size="sm" v-model="selectedRange">
						<b-form-radio value="6 h">6시간</b-form-radio>
						<b-form-radio value="1 d">1일</b-form-radio>
						<b-form-radio value="3 d">3일</b-form-radio>
						<b-form-radio value="7 d">7일</b-form-radio>
					</b-form-radio-group>
				</b-form-group>
			</div>
		</b-card>
	</b-overlay>
</template>

<script>
import { FETCH_SERVER_STATS, FETCH_SERVER_STATS_RECENT } from "@/store/actions.type";
import Realtime from "@/common/realtime";
import StatsService from "@/common/stats.service";
import { mapGetters } from "vuex";
import c3 from "c3";
import moment from "moment";

export default {
	name: "realtime-chart",
	props: {
		servers: {
			type: Array,
			required: true,
			default() {
				return [];
			}
		}
	},
	data() {
		return {
			chart: {},
			realtimeHandler: null,
			promiseChain: new Promise(resolve => resolve()),
			isLoading: true,
			selectedRange: null,
			samplingInterval: null,
			data: { columns: [["x", 0]], x: "x" },
			from: null,
			options: {
				point: {
					show: false
				},
				transition: {
					duration: 100
				},
				size: {
					height: 400
				},
				axis: {
					x: {
						type: "timeseries",
						show: false,
						tick: {
							fit: false
						}
					},
					y: {
						show: false,
						min: 0,
						tick: {},
						padding: { bottom: 10 }
					}
				},
				grid: {
					x: { show: false },
					y: {
						show: false,
						lines: [
							// { value: 0, text: '0'},
							// { value: 10, text: '10'},
							// { value: 25, text: '25'},
							// { value: 50, text: '50'},
							// { value: 100, text: '100'},
							// { value: 200, text: '200'}
						]
					}
				},
				zoom: {
					enabled: true
				},
				subchart: {
					show: false,
					size: { height: 20 }
				}
			}
		};
	},
	mounted() {
		this.chart = c3.generate({
			bindto: "#chart",
			data: this.data,
			...this.options
		});

		// set this value will load chart
		this.selectedRange = "6 h";

		// delayed loading
		this.realtimeHandler = new Realtime("TimeChart")
			.setInterval(() => {
				this.updateChart();
			}, 10 * 1000)
			.start();
	},
	destroyed() {
		this.realtimeHandler.stop();
	},
	computed: {
		...mapGetters(["stats", "recentStats"])
	},
	watch: {
		selectedRange(newSelectedRange) {
			this.from = moment().subtract(...newSelectedRange.split(" "));
		},

		from() {
			this.loadChart({
				load: this.servers,
				unload: true
			});
		},

		servers(newServers, oldServers) {
			var unload = oldServers.filter(server => !newServers.some(s => s.slug == server.slug));
			var load = newServers.filter(server => !oldServers.some(s => s.slug == server.slug));

			if (unload.length || load.length)
				this.loadChart({
					load: load,
					unload: unload.map(server => server.name)
				});
		},

		data: {
			handler(newData) {
				this.chart.load(newData);
			},
			deep: true
		}
	},
	methods: {
		async loadStats(servers) {
			// call IIFE for pass params to async function
			this.samplingInterval = StatsService.adjustSamplingInterval(this.from);
			await ((from, samplingInterval) => {
				// fetch stats data
				return Promise.all(
					servers.map(server => {
						return this.$store.dispatch(FETCH_SERVER_STATS, {
							serverSlug: server.slug,
							from: from,
							samplingInterval: samplingInterval
						});
					})
				);
			})(this.from, this.samplingInterval);
		},

		loadChart({ load, unload }) {
			if (load.length == 0 && unload.length == 0) return;

			// call IIFE for pass params to async function
			((load, unload) => {
				this.promiseChain = this.promiseChain.then(async () => {
					this.isLoading = true;

					var servers = load;
					await this.loadStats(servers);

					var columns = servers.map(server => this.stats[server.slug]);
					if (columns.length) columns.unshift(this.stats.axisValues);

					this.chart.load({
						x: "x",
						columns: columns,
						unload: unload || true
					});

					this.isLoading = false;
					if (columns.length) console.log(`Chart was loaded (data length=${columns[0].length - 1})`, columns);

					await new Promise(resolve => setTimeout(resolve, this.options.transition.duration + 100));
				});
			})(load, unload);
		},

		async updateStats(servers) {
			await Promise.all(
				servers.map(server => {
					return this.$store.dispatch(FETCH_SERVER_STATS_RECENT, {
						serverSlug: server.slug
					});
				})
			);
		},

		updateChart() {
			this.promiseChain = this.promiseChain.then(async () => {
				await this.updateStats(this.servers);
				if (!Object.keys(this.recentStats).length) return;

				var columns = this.servers.map(server => this.recentStats[server.slug]).filter(data => data.length > 1);
				if (!columns.length) return;

				columns.unshift(this.recentStats.axisValues);

				this.chart.flow({
					x: "x",
					columns: columns
				});

				console.log(`Chart was updated (data length=${columns[0].length - 1})`, columns);

				await new Promise(resolve => setTimeout(resolve, this.options.transition.duration + 100));
			});
		}
	}
};
</script>

<style scoped>
.c3-ygrid-line > line {
	stroke-dasharray: 3 3;
}

.c3-line {
	stroke-width: 2px;
}

.c3-chart-line.c3-focused .c3-line {
	stroke-width: 3px !important;
}
</style>
