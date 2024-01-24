<script>
	import { page } from '$app/stores';
	export let to = '';
	export let text = '';
	export let class_name = 'link';
	export let active_on = '/';
</script>

<a class={class_name} href={to} data-active={$page.url.pathname === active_on}>
	<p>{text}</p>
</a>

<style>
	.link {
		margin: 0;
		padding: 0;
		width: 'auto';
		font-size: var(--fluid-type);
		font-weight: bold;
		text-decoration: none;
		color: var(--color-accent);
	}

	.link:hover,
	.link[data-active='true'] {
		text-decoration: underline;
		color: var(--color-tertiary);
	}
</style>
