<template>
	<b-navbar toggleable="md" type="dark" variant="dark" sticky>
		<b-container>
			<b-navbar-brand>
				<router-link class="d-flex align-items-center" :to="{ name: 'root' }">
					<img src="favicon.png" width="32px" />
					<span class="font-weight-light">MCBE Rank</span>
				</router-link>
			</b-navbar-brand>

			<b-navbar-toggle target="navbar-collapse">
				<template v-slot:default="{ expanded }">
					<b-icon v-if="expanded" icon="chevron-bar-up" />
					<b-icon v-else icon="chevron-bar-down" />
				</template>
			</b-navbar-toggle>

			<b-collapse id="navbar-collapse" is-nav>
				<!-- link collection -->
				<b-navbar-nav>
					<b-nav-item v-for="route in routes" :key="route.name" :active="currentRoute == route.name">
						<router-link class="nav-link" :to="{ name: route.name }">
							{{ route.label }}
						</router-link>
					</b-nav-item>
				</b-navbar-nav>
			</b-collapse>
		</b-container>
	</b-navbar>
</template>

<script>
export default {
	name: "navigation",
	data() {
		return {
			routes: [
				{ name: "servers", label: "서버 목록" },
				{ name: "create-server", label: "서버 추가" },
				{ name: "query-server", label: "서버 확인" },
				{ name: "plugins", label: "플러그인 목록" }
			]
		};
	},
	computed: {
		currentRoute() {
			return this.$route.name;
		}
	}
};
</script>

<style scoped>
.navbar-brand a {
	text-decoration: none;
	color: white;
}
</style>
