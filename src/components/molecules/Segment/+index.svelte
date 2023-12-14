<script>
	import Container from '../../atoms/Container/+index.svelte';

	let class_name = '';
	export { class_name as class };
</script>

<!-- HTML Markup -->
<div class="inner--{class_name}">
	<Container>
		<article class="segment {class_name}">
			<slot />
		</article>
	</Container>
</div>

<!-- Styles  -->
<style module="true">
	@import './styles.css';
</style>
