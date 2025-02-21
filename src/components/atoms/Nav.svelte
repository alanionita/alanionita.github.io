<script>
	import Link from './Link.svelte';
	import { base } from '$app/paths';
</script>

<nav class="nav">
	<ul class="list">
		<li class="list-item">
			<Link class_name="nav" to="{base}/" text="./home" active_on="/" />
		</li>
		<li class="list-item">
			<Link class_name="nav" to="{base}/blog" text="./blog" active_on="/blog" />
		</li>
	</ul>
</nav>

<style module="true">
	.nav {
		width: auto;
		height: fit-content;
		text-align: right;
		background-color: transparent;
		margin: 0;
		padding: 2rem 2rem;
	}

	.list {
		list-style: none;
		padding: 0;
		display: flex;
		justify-content: flex-end;
		width: auto;
	}

	.list-item {
		padding: 0;
	}
	.list-item:last-child {
		padding-left: 2rem;
	}
</style>
