<template>
	<div class="d-flex flex-column">
		<b-card class="text-center mb-3">
			<h1 class="display-3">
				<realtime-number :number="server.numplayers" />
			</h1>
			<small class="text-muted">현재 접속중인 유저</small>
		</b-card>

		<b-card class="flex-grow-1 mb-3">
			<dl>
				<div v-for="field in fields" :key="field.key">
					<dt class="small text-muted">{{ field.label }}</dt>
					<dd>{{ server[field.key] || '알 수 없음' }}</dd>
				</div>
			</dl>

			<template v-slot:footer>
				<small class="d-block text-muted">
					업데이트 : <reactive-time>{{ server.updatedAt }}</reactive-time>
				</small>
			</template>
		</b-card>

		<b-button variant="primary" :href="playLink" v-b-tooltip.hover title="클릭하여 접속하세요!"
		><b-icon icon="play-fill" /> 플레이</b-button
		>
	</div>
</template>

<script>
import ReactiveTime from '@/components/ReactiveTime';
import RealtimeNumber from '@/components/RealtimeNumber';

export default {
	name: 'server-descriptions',
	components: {
		ReactiveTime,
		RealtimeNumber,
	},
	props: ['server'],
	data() {
		return {
			fields: [
				{ key: 'name', label: '주소' },
				// { key: "ip", label: "아이피" },
				{ key: 'version', label: '클라이언트 버전' },
				{ key: 'engine', label: '엔진' },
			],
		};
	},
	computed: {
		playLink() {
			return `minecraft://?addExternalServer=${this.server.name}|${this.server.name}`;
		},
	},
};
</script>

<style scoped>
dl {
	margin-bottom: 0;
}

dd {
	margin-bottom: 1rem;
}

dl div:last-child dd {
	margin-bottom: 0;
}
</style>
