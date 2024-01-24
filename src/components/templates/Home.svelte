<script>
	import Link from '../atoms/Link.svelte';
	import Segment from '../molecules/Segment/+index.svelte';
</script>

<Segment class="primary">
	<h1 class="primary-text">I'm Alan Ionita,</h1>
	<p class="primary-text">Software Developer from 53.483959, -2.244644.</p>
	<p class="primary-text">
		Working at <Link to="https://www.perceptual-robotics.com" text="Perceptual Robotics" />,
		<br />building industry 4.0 products.
	</p>
</Segment>
<Segment class="secondary">
	<h2 class="secondary-text">Production experience:</h2>
	<p class="secondary-text">Web + Cloud + Backend + Strategy + Embedded.</p>
</Segment>
<Segment class="tertiary">
	<h2 class="tertiary-text">Teaching experience:</h2>
	<ul class="tertiary-list">
		<li>
			<p class="tertiary-text">
				Instructor at <Link to="https://www.manchester.ac.uk/study/cpd/coding-bootcamp/" text="The University of Manchester" />
			</p>
			<p class="tertiary-text">Teaching Fullstack Web Development</p>
		</li>
		<li>
			<p class="tertiary-text">Mentor at <Link to="https://codebar.io" text="Codebar" /></p>
			<p class="tertiary-text">Free monthly programming workshops for diverse communities</p>
		</li>
		<li>
			<p class="tertiary-text">
				Co-organiser of <Link to="https://codeyourfuture.io" text="CodeYourFuture" />
			</p>
			<p class="tertiary-text">Non-profit coding school for refugees</p>
		</li>
	</ul>
</Segment>
<Segment class="secondary">
	<p class="secondary-text">
		Discover more on:<br /><Link to="https://www.linkedin.com/in/alanionita/" text="LinkedIn" />
	</p>
</Segment>
