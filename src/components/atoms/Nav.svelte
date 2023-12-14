<script>
	import { page } from '$app/stores';

	console.log('pathname ::', $page.url.pathname);
</script>

<nav class="nav">
	<ul class="nav-list">
		<li class="nav-list-item">
			<a class="nav-link" data-active={$page.url.pathname === '/'} href="/">./</a>
		</li>
		<li class="nav-list-item">
			<a class="nav-link" data-active={$page.url.pathname === '/blog'} href="/blog">./blog</a>
		</li>
	</ul>
</nav>

<style>
	.nav {
		width: 'auto';
		height: 10vh;
		text-align: right;
		background-color: transparent;
		padding-left: var(--padding);
		padding-right: var(--padding);
		margin-top: 5vh;
	}
	.nav-list {
		list-style: none;
		padding: 0;
		display: flex;
		justify-content: flex-end;
		width: 100%;
	}

	.nav-list-item {
		padding: 0;
	}
	.nav-list-item:last-child {
		padding-left: 2rem;
	}
	.nav-link {
		margin: 0;
		padding: 0;
		width: 'auto';
		font-size: var(--fluid-type);
        font-weight: bold;
		text-decoration: none;
	}
	.nav-link:hover, .nav-link[data-active='true'] {
		text-decoration: underline;
		color: var(--color-gold);
	}
</style>
