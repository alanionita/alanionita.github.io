<script lang="ts">
	import BlogPost from '../../../components/templates/BlogPost/+page.svelte';
	import { page } from '$app/stores';

	export let data;
</script>

<BlogPost postHtml={data.html} />
