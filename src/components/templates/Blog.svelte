<script lang="ts">
	import BlogListItem from '../atoms/BlogListItem.svelte';
	import Container from '../atoms/Container.svelte';
	interface Props {
		posts: App.Post[];
	}

	let { posts }: Props = $props();
</script>

<div class="bg-primary">
	<Container>
		<header class="head--blog">
			<h1>Crystallising thoughts,<br />through writing.</h1>
		</header>
	</Container>
</div>

<div class="bg-secondary py-4">
	<Container>
		<ul class="list--blog">
			{#each posts as post}
				<BlogListItem slug={post.url} text={post.title} created={post.created} tags={post.tags} />
			{:else}
				<li>No blog posts found</li>
			{/each}
		</ul>
	</Container>
</div>

<style module="true">
	.head--blog {
		align-items: flex-end;
		display: flex;
		flex-flow: column nowrap;
		height: 10rem;
		justify-content: center;
		padding: 10rem 0;
		color: var(--color-primary)
	}
	.head--blog > h1 {
		color: var(--color-text);
		text-align: right;
		font-size: var(--fluid-type);
	}
	.list--blog{
		padding: 5rem 0;
	}
</style>
