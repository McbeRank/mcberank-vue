<template>
	<b-form @submit="onSubmit" novalidate>
		<b-alert variant="danger" :show="!!errorMessage">
			<h4 class="alert-heading">오류!</h4>
			<p>{{ errorMessage }}</p>
			<hr />
			<p class="mb-0">
				<router-link :to="{ name: 'servers' }">서버 목록</router-link>
			</p>
		</b-alert>

		<b-form-group label="서버 주소" label-for="input-host">
			<b-form-input id="input-host" v-model="form.host" type="text" required placeholder="주소 또는 IPv4" :disabled="requesting" />

			<b-form-invalid-feedback v-if="validation.host" force-show>
				{{ validation.host }}
			</b-form-invalid-feedback>
		</b-form-group>

		<b-form-group label="포트" label-for="input-port">
			<b-form-input id="input-port" v-model="form.port" type="text" required :disabled="requesting" />

			<b-form-invalid-feedback v-if="validation.port" force-show>
				{{ validation.port }}
			</b-form-invalid-feedback>
		</b-form-group>

		<b-button variant="primary" type="submit" :disabled="requesting" v-if="!requesting">확인</b-button>

		<b-spinner variant="primary" v-if="requesting" />
	</b-form>
</template>

<script>
export default {
	name: "server-form",
	props: {
		form: {
			type: Object,
			required: true,
			default: () => ({})
		},
		requesting: {
			type: Boolean,
			default: () => false
		},
		error: {
			type: Object,
			default: () => ({})
		}
	},
	computed: {
		validation() {
			return this.error.errors || {};
		},

		errorMessage() {
			if (this.error.name == "ValidationError") return "";
			if (this.error.message) return this.error.message;
			if (Object.keys(this.error).length) return this.error;
			return "";
		}
	},
	methods: {
		onSubmit(event) {
			event.preventDefault();
			this.$emit("submit", event);
		}
	}
};
</script>
