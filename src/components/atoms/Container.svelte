<script>
	/**
	 * @typedef {Object} Props
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { children } = $props();
</script>

<div class="max-width">
	{@render children?.()}
</div>

<style module="true">
	.max-width {
		padding-left: 0.5rem;
		padding-right: 0.5rem;
		max-width: var(--max-width-sm);
	}

	/* at Tablet */
	@media all and (min-width: 40rem) and (max-width: 48rem) {
		.max-width {
			max-width: var(--max-width-md);
		}
	}

	/* above Tablet */
	@media all and (min-width: 49rem) {
		.max-width {
			max-width: var(--max-width);
			width: -webkit-fill-available;
			margin: 0 auto;
		}
	}
</style>
