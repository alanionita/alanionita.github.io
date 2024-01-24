<script>
	import { page } from '$app/stores';
	export let to = '';
	export let text = '';
	export let class_name = 'link';
	export let active_on = '/';
</script>

<a class={class_name} href={to} data-active={$page.url.pathname === active_on}>
	{text}
</a>

<style>
	.link {
		display: inline;
		margin: 0;
		padding: 0;
		width: '100%';
		font-size: var(--fluid-type);
		font-weight: bold;
		text-decoration: none;
		color: var(--color-text);
	}
	.link-text {
		margin: 0;
	}

	.link:hover {
		text-decoration: underline;
	}
	.link--nav {
		margin: 0;
		padding: 0;
		width: 'auto';
		font-size: var(--fluid-type);
		font-weight: bold;
		text-decoration: none;
		color: var(--color-accent);
	}
	.link--nav-text {
		margin: 0;
	}

	.link--nav:hover,
	.link--nav[data-active='true'] {
		text-decoration: underline;
		color: var(--color-tertiary);
	}
</style>
