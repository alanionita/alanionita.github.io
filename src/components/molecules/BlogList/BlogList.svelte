<script>
	import Link from '../../atoms/Link.svelte';
</script>

<ul class="list">
    <li class="item">
        <Link to="/1" text="Life OS" />
        <aside>
            <time datetime="2021-03-28T19:00">Posted on - Sunday, 28th, March, 2021</time>
        </aside>
    </li>
    <li class="item">
        <Link to="/2" text="Raspberry Pi OS Study" />
        <aside>
            <time datetime="2021-03-21T19:00">Posted on - Sunday, 21st March, 2021</time>
        </aside>
    </li>
</ul>

<style module="true">
	.list {
		list-style: 'none';
		padding: 0;
	}
	.item {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		color: white;
		font-size: var(--fluid-type-h2);
		padding-bottom: 2rem;
	}
	.item:last-child {
		padding-bottom: 0rem;
	}
	.item > aside {
		color: var(--color-primary);
		font-weight: 700;
	}
	.item-link {
		text-decoration: underline;
	}
</style>
