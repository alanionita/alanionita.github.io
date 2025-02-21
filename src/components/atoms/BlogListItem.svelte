<script lang="ts">
	import { parse, format } from 'date-fns';
	import { base } from '$app/paths';
	import Link from './Link.svelte';
	interface Props {
		slug: string;
		text: string;
		created: string;
		tags: string[];
	}

	let { slug, text, created, tags }: Props = $props();

	let datetime = parse(created, 'dd/MM/yyyy', new Date());
	let datestr = format(datetime, 'EEEE, dd MMMM yyyy');
	let allTags = tags.join(', ')
</script>

<li>
	<Link to="{base}/blog/{slug}" {text} />
	<aside>
		<time datetime={datetime.toISOString()}>{datestr}</time>
		<span>
			Tags: {allTags}
		</span>
	</aside>
</li>

<style module="true">
	li {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		color: white;
		font-size: var(--fluid-type-h2);
		padding-bottom: 2rem;
	}
	li:last-child {
		padding-bottom: 0rem;
	}
	time {
		color: var(--color-primary);
		font-weight: 700;
	}
	aside {
		display: flex;
		flex-direction: column;
	}
	aside > * {
		width: 100%;
	}
	aside > span {
		text-align: left;
		font-size: var(--fluid-type-post);
		font-weight: 700;
		color: var(--color-primary)
	}
</style>
