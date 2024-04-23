<script>
	import Segment from '../molecules/Segment/+index.svelte';
	import Link from '../atoms/Link.svelte';
</script>

<Segment class="secondary">
	<h1 class="secondary-text">Crystallising thoughts,<br />through writing.</h1>
	<p class="secondary-text">Back to <a class="link" href="/">./home</a></p>
</Segment>
<Segment class="tertiary less-padding">
	<ul class="list">
		<li class="list-item">
			<Link to="/1" text="Life OS" />
			<aside>
				<time datetime="2021-03-28T19:00">Posted on - Sunday, 28th, March, 2021</time>
			</aside>
		</li>
		<li class="list-item">
			<Link to="/2" text="Raspberry Pi OS Study" />
			<aside>
				<time datetime="2021-03-21T19:00">Posted on - Sunday, 21st March, 2021</time>
			</aside>
		</li>
	</ul>
</Segment>

<style module="true">
	.list {
		list-style: 'none';
		padding: 0;
	}
	.list-item {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		color: white;
		font-size: var(--fluid-type-h2);
		padding-bottom: 2rem;
	}
	.list-item:last-child {
		padding-bottom: 0rem;
	}
	.list-item > aside {
		color: var(--color-primary);
		font-weight: 700;
	}
	.list-item-link {
		text-decoration: underline;
	}
</style>
