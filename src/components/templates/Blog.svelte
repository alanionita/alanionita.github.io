<script>
	import Segment from '../molecules/Segment/+index.svelte';
	import BlogList from '../atoms/BlogList/BlogList.svelte';
</script>

<Segment class="secondary">
	<h1 class="secondary-text">Crystallising thoughts,<br />through writing.</h1>
	<!-- <p class="secondary-text">Back to <a class="link" href="/">./home</a></p> -->
</Segment>
<Segment class="tertiary less-padding">
	<BlogList/>
</Segment>
