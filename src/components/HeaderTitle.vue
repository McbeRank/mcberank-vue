<template>
	<header class="mb-3">
		<h2 class="display-5 font-weight-normal">
			<slot name="title" />
		</h2>
		<h6 class="mb-4 font-weight-light">
			<slot name="description" />
		</h6>
	</header>
</template>

<script>
export default {
	name: "header-title"
};
</script>
