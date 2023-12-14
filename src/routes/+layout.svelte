<script>
	import Nav from '../components/atoms/Nav.svelte';
</script>

<main>
	<Nav />
	<slot />
</main>

<style>
	@import '../global.css';

	:global(body) {
		padding: 0;
		margin: 0;
		font-family: 'Input', sans-serif;
		line-height: 1.2;
	}
</style>
