<script lang="ts">
	import PageTitle from '../../../components/atoms/PageTitle.svelte';
	import BlogPost from '../../../components/templates/BlogPost.svelte';

	interface Props {
		data: {
			title: string;
			html: string;
		};
	}

	let { data }: Props = $props();
	
</script>

<PageTitle text={data.title} />
<BlogPost pHtml={data.html} />
