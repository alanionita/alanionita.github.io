// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
		interface BlogListItem {
			slug: string
			text: string
			datetime: string
			datestr: string
		}
		interface Post {
			[index: string]: any | null;
			id: string;
			title: string;
			updated: string;
			created: string;
			url: string;
			html: string;
			desc?: string;
			tags: string[]
		};
	}
}

export { };
