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
		max-width: var(--max-width);
		width: -webkit-fill-available;
		margin: 0 auto;
	}

	@media all and (max-width: 900px) {
		.max-width {
			padding-left: 0.5rem;
			padding-right: 0.5rem;
			max-width: var(--max-width-sm);
		}
	}

	@media all and (max-width: 1080px) {
		.max-width {
			max-width: var(--max-width-md);
		}
	}
</style>
