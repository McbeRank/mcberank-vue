<template>
	<span>{{ displayNumber }}</span>
</template>

<script>
export default {
	name: 'realtime-number',
	props: {
		number: {
			type: Number,
			required: true,
			default: 0,
		},
	},
	data() {
		return {
			displayNumber: 0,
			interval: false,
		};
	},
	mounted() {
		this.triggerNumberChanged();
	},
	destroyed() {
		clearInterval(this.interval);
	},
	watch: {
		number() {
			this.triggerNumberChanged();
		},
	},
	methods: {
		triggerNumberChanged() {
			clearInterval(this.interval);
			if (this.number == this.displayNumber) {
				return;
			}
			this.interval = setInterval(() => {
				if (this.displayNumber != this.number) {
					var change = (this.number - this.displayNumber) / 10;
					change = change >= 0 ? Math.ceil(change) : Math.floor(change);
					this.displayNumber = this.displayNumber + change;
				}
			}, 20);
		},
	},
};
</script>
