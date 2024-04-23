<script lang="ts">
	import BlogListItem from './BlogListItem.svelte';

	let posts: Array<App.BlogListItem> = [
		{
			slug: '1',
			text: 'Life OS',
			datetime: '2021-03-28T19:00',
			datestr: 'Sunday, 28th, March, 2021'
		},
		{
			slug: '2',
			text: 'Raspberry Pi OS Study',
			datetime: '2021-03-21T19:00',
			datestr: 'Sunday, 21st March, 2021'
		},
		{
			slug: '3',
			text: 'Test',
			datetime: '2021-03-21T19:00',
			datestr: 'Sunday, 21st March, 2024'
		}
	];
</script>

<ul>
	{#each posts as post}
		<BlogListItem slug={post.slug} text={post.text} datetime={post.datetime} datestr={post.datestr} />
	{:else}
		<li>No blog posts found</li>
	{/each}
</ul>
