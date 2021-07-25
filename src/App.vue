<template>
	<div id="app">
		<navigation />
		<b-container class="py-4">
			<router-view />
		</b-container>
		<Footer />
	</div>
</template>

<script>
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default {
	name: 'App',
	components: { Navigation, Footer },
};
</script>

<style>
/* font-awesome.css */
@import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css';
</style>
