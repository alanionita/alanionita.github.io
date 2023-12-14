<script>
	import { page } from '$app/stores';
</script>

<nav class="nav">
	<ul class="list">
		<li class="list-item">
			<a class="link" data-active={$page.url.pathname === '/'} href="/">./</a>
		</li>
		<li class="list-item">
			<a class="link" data-active={$page.url.pathname === '/blog/'} href="/blog">./blog</a>
		</li>
	</ul>
</nav>

<style module="true">
	.nav {
		width: 'auto';
		height: 10vh;
		text-align: right;
		background-color: transparent;
		padding-left: var(--padding);
		padding-right: var(--padding);
		margin-top: 5vh;
	}
	.list {
		list-style: none;
		padding: 0;
		display: flex;
		justify-content: flex-end;
		width: 100%;
	}

	.list-item {
		padding: 0;
	}
	.list-item:last-child {
		padding-left: 2rem;
	}
</style>
