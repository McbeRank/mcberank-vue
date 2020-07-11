<template>
	<div>
		<header-title>
			<template v-slot:title>플러그인 목록</template>
			<template v-slot:description>총 {{ pluginsVersionMapped.length }}종류의 플러그인이 사용중입니다</template>
		</header-title>

		<plugin-list />
	</div>
</template>

<script>
import HeaderTitle from "@/components/HeaderTitle";
import PluginList from "@/components/PluginList";
import store from "@/store";
import { FETCH_PLUGINS } from "@/store/actions.type";
import { mapGetters } from "vuex";

export default {
	name: "plugins",
	components: {
		HeaderTitle,
		PluginList
	},
	beforeRouteEnter(to, from, next) {
		Promise.all([store.dispatch(FETCH_PLUGINS)]).then(() => next());
	},
	computed: {
		...mapGetters(["pluginsVersionMapped"])
	}
};
</script>
