<script lang="ts">
	import { parse, format } from 'date-fns';
	import Link from './Link.svelte';
	import { makeBlogPostURL } from '$lib/urls';

	interface Props {
		slug: string;
		text: string;
		created: string;
		tags: string[];
	}

	let { slug, text, created, tags }: Props = $props();
	
	type FnGetCreated = () => string

	function makeTimeISOStr(getCreated: FnGetCreated) : Date {
		const timeFormat = 'dd/MM/yyyy';
		const date = parse(getCreated(), timeFormat, new Date());
		return date
	}

	function makeDateString(getCreated: FnGetCreated) : string {
		const dateFormat = 'EEEE, dd MMMM yyyy';
		let datetime: Date = makeTimeISOStr(getCreated);
		return format(datetime, dateFormat);
	}
</script>

<li>
	<Link to={makeBlogPostURL(() => slug)} {text} class_name="highlight" />
	<aside>
		<time datetime={makeTimeISOStr(() => created).toISOString()}>
			{makeDateString(() => created)}
		</time>
		<span>
			Tags: {tags.join(', ')}
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
	}
	aside > time {
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
