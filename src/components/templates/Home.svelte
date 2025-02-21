<script>
	import Link from '../atoms/Link.svelte';
	import Segment from '../molecules/Segment.svelte';
</script>

<Segment type="primary">
	<h1 class="txt-1">I'm Alan Ionita,</h1>
	<p class="txt-1">Software Developer from 53.483959, -2.244644.</p>
	<p class="txt-1">Independently working on open-source projects</p>
</Segment>
<Segment type="secondary">
	<h2 class="txt-2">Production experience:</h2>
	<p class="txt-2">Web, Cloud, Backend, Strategy, Embedded,</p>
	<p class="txt-2">React, NextJS, Typescript, AWS, Python.</p>
</Segment>
<Segment type="tertiary">
	<h2 class="txt-3">Teaching experience:</h2>
	<ul class="list--exp">
		<li>
			<p class="txt-3">
				Instructor at <Link
					to="https://www.manchester.ac.uk/study/cpd/coding-bootcamp/"
					text="The University of Manchester"
					class_name="link--highlight"
				/>
			</p>
			<p class="txt-3">Teaching Fullstack Web Development</p>
		</li>
		<li>
			<p class="txt-3">
				Mentor at <Link to="https://codebar.io" text="Codebar" class_name="link--highlight" />
			</p>
			<p class="txt-3">Free monthly programming workshops for diverse communities</p>
		</li>
		<li>
			<p class="txt-3">
				Co-organiser of <Link
					to="https://codeyourfuture.io"
					text="CodeYourFuture"
					class_name="link--highlight"
				/>
			</p>
			<p class="txt-3">Non-profit coding school for refugees</p>
		</li>
	</ul>
</Segment>
<Segment type="secondary">
	<p class="txt-2">
		Discover more on:<br /><Link to="https://www.linkedin.com/in/alanionita/" text="LinkedIn" />
	</p>
</Segment>

<style>
	.list--exp {
		list-style: none;
		padding: 0;
	}

	.list--exp > li {
		list-style-type: none;
		margin: 2rem 0;
	}
</style>
