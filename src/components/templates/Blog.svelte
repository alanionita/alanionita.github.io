<script lang="ts">
	import Segment from '../molecules/Segment.svelte';
	import BlogListItem from '../atoms/BlogListItem.svelte';
	interface Props {
		posts: App.Post[];
	}

	let { posts }: Props = $props();
</script>

<Segment class="secondary">
	<h1 class="secondary-text">Crystallising thoughts,<br />through writing.</h1>
</Segment>
<Segment class="tertiary less-padding">
	<ul>
		{#each posts as post}
			<BlogListItem slug={post.url} text={post.title} created={post.created} tags={post.tags} />
		{:else}
			<li>No blog posts found</li>
		{/each}
	</ul>
</Segment>
