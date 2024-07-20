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
		margin: 0;
		padding: 0;
		width: auto;
		color: var(--color-text);
		font-size: var(--fluid-type-post);
	}

	:global(blockquote) {
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

	:global(blockquote:before) {
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


	.post {
		height: auto;
		display: flex;
		flex-flow: column;
		padding-bottom: var(--padding);
		padding-top: calc(var(--padding) / 2);
		justify-content: center;
		align-items: flex-start;
		max-width: var(--post-max-width);
		/* background-color: transparent; */
		/* color: var(--color-text); */
	}
	.post > h2,
	.post > h3,
	.post > h4 {
		width: 75%;
		text-align: left;
		font-weight: bold;
		font-size: var(--fluid-type-h2);
		line-height: 1.2em;
	}

	.post > ul {
		margin: 0;
		padding: 0;
		padding-left: 5%;
		width: 75%;
		color: var(--color-text);
		text-align: left;
		font-weight: bold;
		font-size: var(--fluid-type-post);
		font-weight: 400;
	}

	.post > p + ul {
		margin-top: -1em;
		margin-bottom: 1em;
	}

	.post > p {
		margin: 0;
		padding: 0;
		width: 100%;
		color: var(--color-navy);
		text-align: left;
		font-weight: bold;
		font-size: var(--fluid-type-post);
		font-weight: 400;
	}

	.post > p {
		margin-bottom: calc(var(--text-padding));
	}

	.post > p:last-child {
		margin-bottom: 0;
	}
	.post > h2 > a,
	.post > h3 > a,
	.post > p > a {
		color: rgb(0, 52, 89);
		text-decoration: unset;
		font-weight: 600;
	}
	.post > h2 > a:hover,
	.post > h3 > a:hover,
	.post > p > a:hover {
		text-decoration: underline;
	}
</style>
