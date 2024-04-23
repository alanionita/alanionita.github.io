<script lang='ts'>
    import Segment from '../../molecules/Segment/+index.svelte';
    export let slug:string = '';
</script>

<Segment class="secondary">
	<h1 class="secondary-text">{slug}</h1>
    <h2 class="secondary-text">Test blog post</h2>
	<p class="secondary-text">Back to <a class="link" href="/blog">./blog</a></p>
</Segment>


