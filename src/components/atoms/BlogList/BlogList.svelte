<script>
	import BlogListItem from './BlogListItem.svelte';

	import { getContext } from 'svelte';

	const posts = getContext('posts');
</script>

<ul>
	{#each $posts as post}
		<BlogListItem slug={post.url} text={post.title} created={post.created} />
	{:else}
		<li>No blog posts found</li>
	{/each}
</ul>
