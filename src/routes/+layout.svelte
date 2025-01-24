<script>
	import Nav from '../components/atoms/Nav.svelte';
	/**
	 * @typedef {Object} Props
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { children } = $props();
</script>

<main>
	<Nav />
	{@render children?.()}
</main>
