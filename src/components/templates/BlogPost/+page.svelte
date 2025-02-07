<script lang="ts">
	import Segment from '../../molecules/Segment/+index.svelte';
	import hljs from 'highlight.js/lib/core';
	import javascript from 'highlight.js/lib/languages/javascript';
	import yaml from 'highlight.js/lib/languages/yaml';
	import shell from 'highlight.js/lib/languages/shell';
	import 'highlight.js/styles/github.css';
	import { onMount } from 'svelte';
	interface Props {
		postHtml?: string;
	}

	let { postHtml = '' }: Props = $props();

	onMount(() => {
		hljs.registerLanguage('javascript', javascript);
		hljs.registerLanguage('yaml', yaml);
		hljs.registerLanguage('shell', shell);
		hljs.highlightAll();
	});
</script>

<Segment class="secondary article-padding">
	<section class="content">
		{@html postHtml}
	</section>
</Segment>
