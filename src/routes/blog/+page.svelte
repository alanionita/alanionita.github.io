<script>
	import { run } from 'svelte/legacy';

	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import Blog from '../../components/templates/Blog.svelte';

	
	/**
	 * @typedef {Object} Props
	 * @property {import('./$types').PageData} data
	 */

	/** @type {Props} */
	let { data } = $props();

	// Creates a posts state
	const posts = writable();
	run(() => {
		posts.set(data.posts);
	});

	// Defines a posts context
	setContext('posts', posts);
</script>

<Blog/>
