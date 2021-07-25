<template>
	<div>
		<header-title>
			<template v-slot:title>
				<b-icon icon="circle-fill" scale="0.6" :class="server.online ? 'text-success' : 'text-danger'"></b-icon>
				{{ server.title }}
			</template>
			<template v-slot:description>{{ server.name }}</template>
		</header-title>

		<b-row>
			<b-col md="4" class="mb-4">
				<server-descriptions class="h-100" :server="server" />
			</b-col>
			<b-col md="8" class="mb-4">
				<realtime-chart class="h-100 justify-content-center" :servers="[server]" />
			</b-col>
		</b-row>

		<hr />

		<h4>플레이어 목록</h4>
		<player-list :server="server" />
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import store from '@/store';
import { FETCH_SERVER } from '@/store/actions.type';
import HeaderTitle from '@/components/HeaderTitle';
import RealtimeChart from '@/components/RealtimeChart';
import ServerDescriptions from '@/components/ServerDescriptions';
import PlayerList from '@/components/PlayerList';
import Realtime from '@/common/realtime';

export default {
	name: 'server',
	props: ['slug'],
	data() {
		return {
			realtimeHandler: null,
		};
	},
	components: {
		HeaderTitle,
		RealtimeChart,
		ServerDescriptions,
		PlayerList,
	},
	beforeRouteEnter(to, from, next) {
		Promise.all([store.dispatch(FETCH_SERVER, to.params.slug)]).then(() => next());
	},
	created() {
		this.realtimeHandler = new Realtime('Server')
			.setInterval(() => {
				store.dispatch(FETCH_SERVER, this.slug);
			}, 5 * 1000)
			.start();
	},
	destroyed() {
		this.realtimeHandler.stop();
	},
	computed: {
		...mapGetters(['server']),
	},
};
</script>
