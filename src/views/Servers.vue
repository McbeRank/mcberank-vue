<template>
	<div class="mb-4">
		<header-title>
			<template v-slot:title>서버 목록</template>
			<template v-slot:description>
				<realtime-number :number="onlineServers.length" />개의 서버가 온라인이며, <realtime-number :number="onlinePlayers" />명의 플레이어가 플레이중입니다
			</template>
		</header-title>

		<realtime-chart :servers="Object.values(selectedServers)" />

		<b-table small hover head-variant="dark" :fields="fields" :items="servers">
			<template v-slot:cell(rank)="data">
				<template v-if="data.item.online">
					{{ data.index + 1 }}
				</template>

				<template v-else>
					<b-icon icon="circle-fill" class="text-danger"></b-icon>
				</template>
			</template>

			<template v-slot:cell(name)="data">
				<div>
					<router-link :to="{ name: 'server', params: { slug: data.item.slug } }">
						{{ data.item.title || data.item.name }}
					</router-link>
				</div>
				<div>{{ data.item.title ? data.item.name : "" }}</div>
			</template>

			<template v-slot:cell(numplayers)="data">
				<realtime-number :number="data.item.numplayers" />
				<div></div>
			</template>

			<template v-slot:cell(compare)="data">
				<b-form-checkbox
					:checked="!!selectedServers[data.item.name]"
					@change="toggleServer(data.item)"
					:disabled="!selectedServers[data.item.name] && Object.values(selectedServers).length >= throttleSelect"
				/>
			</template>
		</b-table>
	</div>
</template>

<script>
import { mapGetters } from "vuex";
import store from "@/store";
import { FETCH_SERVERS } from "@/store/actions.type";
import HeaderTitle from "@/components/HeaderTitle";
import RealtimeChart from "@/components/RealtimeChart";
import RealtimeNumber from "@/components/RealtimeNumber";
import Realtime from "@/common/realtime";

export default {
	name: "servers",
	components: {
		HeaderTitle,
		RealtimeNumber,
		RealtimeChart
	},
	data() {
		return {
			realtimeHandler: null,
			fields: [
				{ key: "rank", label: "#", class: "col-rank" },
				{ key: "name", label: "서버" },
				{
					key: "numplayers",
					label: "동접",
					class: "col-numplayers text-right font-weight-bold"
				},
				{ key: "compare", label: "비교", class: "col-compare text-right" }
			],
			selectedServers: [],
			throttleSelect: 5
		};
	},
	created() {
		store.dispatch(FETCH_SERVERS).then(async () => {
			this.servers.slice(0, 3).forEach(server => {
				this.toggleServer(server);
			});

			this.realtimeHandler = new Realtime("Servers")
				.setInterval(() => {
					store.dispatch(FETCH_SERVERS);
				}, 5 * 1000)
				.start();
		});
	},
	destroyed() {
		this.realtimeHandler.stop();
	},
	computed: {
		...mapGetters(["servers", "onlineServers", "offlineServers"]),

		onlineServers() {
			return this.servers.filter(server => server.online);
		},

		onlinePlayers() {
			return this.servers.reduce((a, c) => a + c.numplayers, 0);
		}
	},
	methods: {
		toggleServer(server) {
			if (this.selectedServers[server.name]) {
				this.$delete(this.selectedServers, server.name);
			} else {
				this.$set(this.selectedServers, server.name, server);
			}
		}
	}
};
</script>

<style>
.col-rank {
	width: 2rem;
}

.col-numplayers {
	width: 4rem;
}

.col-compare {
	width: 3rem;
}
</style>
