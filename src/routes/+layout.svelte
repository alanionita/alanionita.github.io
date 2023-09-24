<nav>
	<a href="/">Home</a>
	<a href="/blog">Blog</a>
</nav>
<main>
<slot></slot>
</main>
<style>
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
