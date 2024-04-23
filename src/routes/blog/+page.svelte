<script>
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import Blog from '../../components/templates/Blog.svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	// Creates a posts state
	const posts = writable();
	$: posts.set(data.posts);

	// Defines a posts context
	setContext('posts', posts);
</script>

<Blog/>
