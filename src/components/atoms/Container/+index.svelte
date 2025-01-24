<script>
	/**
	 * @typedef {Object} Props
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { children } = $props();
</script>

<section class="max-width">
	{@render children?.()}
</section>

<style module="true">
	.max-width {
		max-width: var(--max-width);
		width: -webkit-fill-available;
		margin: 0 auto;
		background-color: 'pink';
		
	}

	@media all and (max-width: 900px) {
		.max-width {
			padding-left: var(--padding);
			padding-right: var(--padding);
			max-width: var(--max-width-sm);
		}
	}

	@media all and (max-width: 1080px) {
		.max-width {
			max-width: var(--max-width-md);
		}
	}
</style>
