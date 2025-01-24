<script lang="ts">
	import BlogPost from '../../../components/templates/BlogPost/+page.svelte';

	let { data } = $props();
</script>

<BlogPost postHtml={data.html} />
