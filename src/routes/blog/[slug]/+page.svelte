<script lang="ts">
	import PageTitle from '../../../components/atoms/PageTitle.svelte';
	import BlogPost from '../../../components/templates/BlogPost/+page.svelte';
	import { page } from "$app/stores";

	let { data } = $props();
</script>

<PageTitle text={data.title}/>
<BlogPost postHtml={data.html} />
