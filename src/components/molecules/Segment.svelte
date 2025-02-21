<script lang="ts">
	import type { Snippet } from 'svelte';
	import Container from '../atoms/Container.svelte';

	interface Props {
		children: Snippet;
		type: 'primary' | 'secondary' | 'tertiary' | 'post';
		className?: string;
	}
	let { type, children, className }: Props = $props();
</script>

<!-- HTML Markup -->
<div class="bg-{type}">
	<Container>
		<article class="sgm-{type} {className}">
			{@render children?.()}
		</article>
	</Container>
</div>

<style module="true">
	/* Segment styles */

	.sgm-primary {
		display: flex;
		flex-flow: column;
		background-color: var(--color-primary);
		padding-top: 35vh;
		padding-bottom: 15vh;
		height: auto;
		color: var(--color-text);
		text-align: left;
		font-size: var(--fluid-type);
		margin-bottom: 1.5em;
	}

	.sgm-secondary {
		background-color: var(--color-secondary);
		display: flex;
		flex-flow: column nowrap;
		height: auto;
		justify-content: center;
		padding: 12rem 0;
	}

	.sgm-tertiary {
		background-color: var(--color-primary);
		display: flex;
		flex-flow: column;
		height: auto;
		justify-content: flex-start;
		padding: 10rem 0;
		text-align: right;
	}

	.sgm-post {
		background-color: var(--color-primary);
		display: flex;
		flex-flow: column nowrap;
		height: fit-content;
		justify-content: center;
		padding: 12rem 0;
	}

	.p-article {
		padding: 4rem 0rem;
	}

	@media screen and (min-width: 1025px) and (max-width: 2200px) {
		.p-article {
			padding: 0rem 8rem;
		}
	}
</style>
