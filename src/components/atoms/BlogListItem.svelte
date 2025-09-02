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

	let reqProps: {[key: string]: string | string[]} = {slug, text, created, tags};

	for (const prop in reqProps) {
		if (!reqProps[prop]) throw Error(`Err [BlogListItem]: Missing Prop: ${prop}`)
	}

	let datetime = parse(created, 'dd/MM/yyyy', new Date());
	let datestr = format(datetime, 'EEEE, dd MMMM yyyy');
	
	let allTags = tags.join(', ')
</script>

<li>
	<Link to="{base}/blog/{slug}" {text} class_name="highlight" />
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
		color: var(--color-secondary);
		font-size: var(--fluid-type-h2);
		padding-bottom: 2rem;
	}
	li:last-child {
		padding-bottom: 0rem;
	}
	
	aside {
		display: flex;
		width: 100%;
		flex-direction: column;
		text-align: left;
		/* align-items: flex-end; */
		/* justify-content: flex-end; */
	}
	aside > * {
			
	}
	aside > time {
		/* color: var(--color-primary); */
		/* text-align: right; */
		font-weight: 300;
		color: var(--color-text);
	}
	aside > span {
		text-align: left;
		font-size: var(--fluid-type-post);
		font-weight: 300;
		color: var(--color-text);
	}
</style>
