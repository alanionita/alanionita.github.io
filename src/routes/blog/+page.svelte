<script>
	import Blog from '../../components/templates/Blog.svelte';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<Blog posts={data.posts}/>
