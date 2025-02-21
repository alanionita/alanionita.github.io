<script lang="ts">
	import Blog from '../../components/templates/Blog.svelte';
	import PageTitle from '../../components/atoms/PageTitle.svelte';

	interface Props {
		data: {
			posts: App.Post[];
		};
	}
	let { data }: Props = $props();
</script>

<PageTitle text="List of blog posts" />
<Blog posts={data.posts} />
