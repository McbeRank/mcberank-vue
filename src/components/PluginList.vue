<template>
	<div class="mb-4">
		<b-form-group>
			<b-input-group size="sm">
				<b-form-input v-model="filterText" type="search" placeholder="검색할 플러그인을 입력하세요" />
				<b-input-group-append>
					<b-button :disabled="!filterText" @click="filterText = ''">초기화</b-button>
				</b-input-group-append>
			</b-input-group>
		</b-form-group>

		<b-table small hover head-variant="dark" :fields="fields" :items="pluginsVersionMapped" :filter="filterText">
			<template v-slot:cell(versions)="data">
				<tbody>
					<tr v-for="version in data.item.versions" :key="version.version">
						<td>{{ version.version }}</td>
						<td>{{ version.servers }}</td>
					</tr>
				</tbody>
			</template>
		</b-table>
	</div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
	name: "plugin",
	data() {
		return {
			fields: [
				{ key: "name", label: "플러그인", class: "col" },
				{ key: "versions", label: "버전/서버 수", class: "col-versions" },
				{
					key: "servers",
					label: "계",
					class: "col-servers text-right font-weight-bold"
				}
			],
			filterText: ""
		};
	},
	computed: {
		...mapGetters(["pluginsVersionMapped"])
	}
};
</script>

<style>
.col-versions {
	min-width: 8rem;
}

.col-servers {
	min-width: 1.5rem;
}
</style>
