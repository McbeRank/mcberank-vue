<template>
	<span><slot /></span>
</template>

<script>
import moment from 'moment';

export default {
	name: 'reactive-time',
	data() {
		return {
			criteriaTime: null,
		};
	},
	mounted() {
		this.criteriaTime = moment.min(moment(), moment(this.$el.innerHTML));
		this.$el.innerHTML = this.criteriaTime.fromNow();
		setInterval(() => {
			this.$el.innerHTML = this.criteriaTime.fromNow();
		}, 5000);
	},
};
</script>
