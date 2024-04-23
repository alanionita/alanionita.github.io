<script lang="ts">
	import BlogPost from '../../../components/templates/BlogPost/+page.svelte';
	import { page } from '$app/stores';
	const slug: string = $page.params.slug || 'Not found';
</script>

<BlogPost slug={slug} />
