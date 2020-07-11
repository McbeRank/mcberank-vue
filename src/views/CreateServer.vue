<template>
	<div>
		<header-title>
			<template v-slot:title>서버 추가</template>
			<template v-slot:description>서버를 목록에 추가합니다.</template>
		</header-title>

		<b-alert show variant="info">서버를 추가하려면 서버가 온라인이어야 합니다.</b-alert>

		<b-alert variant="success" :show="!!result.length">
			<h4 class="alert-heading">성공적으로 등록하였습니다.</h4>
			<p>{{ result }}</p>
			<hr />
			<p class="mb-0">
				<router-link :to="{ name: 'servers' }">서버 목록</router-link>
			</p>
		</b-alert>

		<server-form :form="form" :requesting="requesting" :error="error" @submit="onSubmit" />
	</div>
</template>

<script>
import axios from "axios";
import HeaderTitle from "@/components/HeaderTitle";
import ServerForm from "@/components/ServerForm";

export default {
	name: "create-server",
	components: {
		HeaderTitle,
		ServerForm
	},
	data() {
		return {
			form: { host: "", port: 19132 },
			requesting: false,
			error: {},
			result: ""
		};
	},
	methods: {
		async onSubmit() {
			this.requesting = true;
			this.error = {};
			this.result = "";

			try {
				const { data } = await axios.post("/api/servers", this.form);
				this.result = data.message || data;
			} catch (error) {
				this.error = error.response.data;
			} finally {
				this.requesting = false;
			}
		}
	}
};
</script>
