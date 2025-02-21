<script lang="ts">
	import { page } from '$app/state';

	interface Props {
		to: string;
		text: string;
		class_name?: string;
		active_on?: string;
	}

	let { to, text, class_name = 'link', active_on = '/' }: Props = $props();
</script>

<a class={class_name} href={to} data-active={page.url.pathname === active_on}>
	{text}
</a>

<style module="true">
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
		color: var(--color-yellow-aaa);
	}
	.link--nav-text {
		margin: 0;
	}

	.link--nav:hover,
	.link--nav[data-active='true'] {
		text-decoration: underline;
		color: var(--color-yellow-aaa);
	}
	.link--highlight {
		margin: 0;
		padding: 0;
		width: 'auto';
		font-size: var(--fluid-type);
		font-weight: bold;
		text-decoration: none;
		color: var(--color-yellow-aaa);
	}
	.link--highlight:hover {
		text-decoration: underline;
		color: var(--color-yellow-aaa);
	}
</style>
