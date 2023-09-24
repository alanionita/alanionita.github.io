<script>
	import Nav from '../components/Nav.svelte';
</script>

<main>
	<Nav/>
	<slot></slot>
</main>

<style>
/* Styles */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

:root {
	/* Vars */
	--padding: 10vw;
	--text-padding: 24px;
	--text-width: 100%;
	--text-width-tablet: 90%;
	--post-max-width: 800px;
	--color-dark-blue: #00171f;
	--color-navy: #003459;
	--color-turquise: #007ea7;
	--color-light-blue: #00a8e8;
	--color-grey: #cecece;
	--color-off-white: #f1f1f1;

	/* Fluid type */
	--fluid-type: min(max(1rem, 4vw), 40px);
	--fluid-type-h2: min(max(1rem, 4vw), 32px);
	--fluid-type-post: min(max(1rem, 4vw), 24px);
	--fluid-type-code: min(max(1rem, 4vw), 16px);
}

html,
body {
  padding: 0;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  line-height: 1.6;
}

* {
  box-sizing: border-box;
}

:global(body) {
	margin: 0;
}

a {
  color: #f4fffd;
}

a:hover {
  color: #f4fffdc7;
}

img {
  max-width: 100%;
  display: block;
}

/* Styling code blocks */
pre code {
  font-size: var(--fluid-type-code);
  font-weight: 400;
  text-align: left;
}

pre {
  width: 100%;
}
	.container {
  		position: relative;
  		text-align: center;
  		width: 100%;
  		height: 100vh;
		overflow-x: hidden;
  		display: flex;
  		flex-flow: column nowrap;
  		background-color: #00171f;
	}

	.header {
  		position: absolute;
  		width: 100%;
	}
main {                                    
	height: 100vh;
	display: flex;
	flex-flow: column;
	background-color: var(--color-dark-blue);
	padding-top: 15vh;
	padding-bottom: 15vh;
}
</style>
