<script lang="ts">
	import BlogListItem from './BlogListItem.svelte';

	export let posts: any;
</script>

<ul>
	{#each posts as post}
		<BlogListItem slug={post.url} text={post.title} datetime={post.datetime} datestr={post.datestr} />
	{:else}
		<li>No blog posts found</li>
	{/each}
</ul>
