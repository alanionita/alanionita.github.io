<script lang="ts">
	import BlogPost from '../../../components/templates/BlogPost/+page.svelte';

	export let data;
</script>

<BlogPost postHtml={data.html} />
