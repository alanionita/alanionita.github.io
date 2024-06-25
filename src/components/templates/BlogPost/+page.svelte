<script lang='ts'>
    import Segment from '../../molecules/Segment/+index.svelte';
    export let slug:string = '';
    export let postHtml:string = '';
</script>

<Segment class="secondary">
	<p class="secondary-text">Back to <a class="link" href="/blog">./blog</a></p>
	<h1 class="secondary-text">{slug}</h1>
    <!-- TODO: add sanitising logic for postHtml -->
    <section class="content">{@html postHtml}</section>
</Segment>


