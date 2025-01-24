<script>
	import Container from '../../atoms/Container/+index.svelte';

	/**
	 * @typedef {Object} Props
	 * @property {string} [class]
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { class: class_name = '', children } = $props();
	
</script>

<!-- HTML Markup -->
<div class="inner--{class_name}">
	<Container>
		<article class="segment {class_name}">
			{@render children?.()}
		</article>
	</Container>
</div>
