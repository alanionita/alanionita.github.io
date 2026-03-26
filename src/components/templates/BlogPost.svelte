<script lang="ts">
	import { initHighlight } from '$lib/code-highlight';
	import Segment from '../molecules/Segment.svelte';
	import 'highlight.js/styles/monokai.min.css';
	import { onMount } from 'svelte';

	interface Props {
		pHtml?: string;
	}

	let { pHtml = '' }: Props = $props();

	onMount(() => {
		initHighlight()
	});
</script>

<Segment type="post" className="p-article">
	<section class="content">
		{@html pHtml}
	</section>
</Segment>
