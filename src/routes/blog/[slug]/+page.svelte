<script lang="ts">
	import BlogPost from '../../../components/templates/BlogPost/+page.svelte';
	import { page } from '$app/stores';
	const slug: string = $page.params.slug || 'Not found';

	export let data;
</script>

<BlogPost slug={slug} postHtml={data.html}/>
