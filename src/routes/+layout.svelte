<script lang="ts">
	import type { Snippet } from 'svelte';
	import Nav from '../components/atoms/Nav.svelte';
	
	interface Props {
		children: Snippet;
	}
	let { children } : Props = $props();
</script>

<main>
	<Nav />
	{@render children?.()}
</main>
