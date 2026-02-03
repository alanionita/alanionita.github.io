<script lang="ts">
	import Segment from '../molecules/Segment.svelte';
	import hljs from 'highlight.js/lib/core';
	import javascript from 'highlight.js/lib/languages/javascript';
	import yaml from 'highlight.js/lib/languages/yaml';
	import bash from 'highlight.js/lib/languages/bash';
	import json from 'highlight.js/lib/languages/json';
	import graphql from 'highlight.js/lib/languages/graphql';
	import markdown from 'highlight.js/lib/languages/markdown';
	import php from 'highlight.js/lib/languages/php';
	import svelte from 'highlight.svelte'
	import 'highlight.js/styles/github.css';
	import { onMount } from 'svelte';

	interface Props {
		pHtml?: string;
	}

	let { pHtml = '' }: Props = $props();

	onMount(() => {
		hljs.registerLanguage('js', javascript);
		hljs.registerLanguage('yaml', yaml);
		hljs.registerLanguage('sh', bash);
		hljs.registerLanguage('json', json);
		hljs.registerLanguage('gql', graphql);
		hljs.registerLanguage('vtl', php);
		hljs.registerLanguage('md', markdown);
		hljs.registerLanguage('svelte', svelte);
		hljs.highlightAll();
	});
</script>

<Segment type="post" className="p-article">
	<section class="content">
		{@html pHtml}
	</section>
</Segment>
