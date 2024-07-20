<script lang="ts">
	import Segment from '../../molecules/Segment/+index.svelte';
	export let slug: string = '';
	export let postHtml: string = '';
</script>

<Segment class="secondary">
	<p class="secondary-text">Back to <a class="link" href="/blog">./blog</a></p>
	<h1 class="secondary-text">{slug}</h1>
	<!-- TODO: add sanitising logic for postHtml -->
	<section class="content">
		{@html postHtml}
	</section>
</Segment>

<style>
	.content {
		margin: 6rem 0 0 0;
		padding: 0;
		width: auto;
		color: var(--color-text);
		font-size: var(--fluid-type-post);
	}

	/* Custom Svelte way to style these dynamically generated @html elements */
	.content :global(blockquote) {
		display: block;
		border-width: 2px 0;
		border-style: solid;
		border-color: #eee;
		padding: 1rem 2rem 0.5em;
		margin: 1rem 0rem 1rem 3rem;
		position: relative;
		color: var(--color-primary);
		font-size: var(--fluid-type-post);
		font-weight: 700;
		font-style: italic;
		background-color: var(--color-accent);
	}

	/* Custom Svelte way to style these dynamically generated @html elements */
	.content :global(blockquote:before) {
		content: '\201C';
		position: absolute;
		top: 0em;
		left: 50%;
		transform: translate(-50%, -50%);
		background: var(--color-primary);
		width: 3rem;
		height: 2rem;
		font: 3rem 'PT Sans', sans-serif;
		color: var(--color-text);
		text-align: center;
	}

	/* Custom Svelte way to style these dynamically generated @html elements */
	.content :global(h2),
	.content :global(h3),
	.content :global(h4) {
		width: 75%;
		text-align: left;
		font-weight: bold;
		font-size: var(--fluid-type-h2);
		line-height: 1.2em;
	}

	/* Custom Svelte way to style these dynamically generated @html elements */
	.content :global(ul) {
		margin: 0;
		padding: 0;
		padding-left: 5%;
		width: 75%;
		color: var(--color-text);
		list-style-type: disc;
		text-align: left;
		font-weight: bold;
		font-size: var(--fluid-type-post);
		font-weight: 400;
	}
</style>
