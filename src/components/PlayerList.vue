<template>
	<div class="mt-4">
		<b-form-group>
			<b-input-group size="sm">
				<b-form-input v-model="filterText" type="search" placeholder="검색할 플레이어를 입력하세요"></b-form-input>
				<b-input-group-append>
					<b-button :disabled="!filterText" @click="filterText = ''">지우기</b-button>
				</b-input-group-append>
			</b-input-group>
		</b-form-group>

		<b-table small hover head-variant="dark" :fields="fields" :items="server.players" :filter="filterText" :filter-function="filter" :show-empty="true" empty-text="플레이어 목록이 비어있습니다">
			<template v-slot:cell(player)="data">
				{{ data.item }}
			</template>
		</b-table>

		<b-alert :show="server.numplayers > 0 && server.players.length == 0" variant="warning">이 서버에서는 플레이어 목록을 공개하지 않는 것 같습니다.</b-alert>
	</div>
</template>

<script>
export default {
	name: "player-list",
	props: ["server"],
	data() {
		return {
			fields: [{ key: "player", label: "플레이어" }],
			filterText: ""
		};
	},
	methods: {
		filter: function(player, filterText) {
			return player.toLowerCase().indexOf(filterText.toLowerCase()) >= 0;
		}
	}
};
</script>
