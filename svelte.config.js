import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */

const config = {
	kit: {
		adapter: adapter({
			// default options are shown. On some platforms
			// these options are set automatically — see below
			pages: 'build',
			assets: 'build',
			fallback: '404.html',
			precompress: true, // TODO: toggle on/off and compare
			strict: true
		}),
		paths: {
			// base: process.env.NODE_ENV === "prod" ? process.env.BASE_PATH : "",
		},
		prerender: {
			crawl: true,
			entries: ["*"]		
		}		
	},
	preprocess: [vitePreprocess()]
};

export default config;
