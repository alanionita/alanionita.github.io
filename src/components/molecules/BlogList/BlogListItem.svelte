<script>
	import Link from '../../atoms/Link.svelte';
    export let to = '';
	export let text = '';
	export let datetime = '';
	export let datestr = '';
</script>

<li>
    <Link to={to} text={text} />
    <aside>
        <time datetime={datetime}>Posted on - {datestr}</time>
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
</style>
