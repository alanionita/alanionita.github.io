<script>
    const siteName = "Alan Ionita"
    let props = $props();
</script>

<svelte:head>
	<title>{siteName + " - " + props.text}</title>
</svelte:head>
