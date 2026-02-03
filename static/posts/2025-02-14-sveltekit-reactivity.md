---
title: SveleteKit - reactivity quirk
url: 2025-02-14-sveltekit-reactivity
desc: ''
updated: 14/02/2025
created: 14/02/2025
tags: ['web', 'frontend', 'svelte-js']
---

# SveleteKit - reactivity quirk

Svelte is great for heavy web scenarios: maps, visualizations, animations etc. And it's common that most of these scenarios depend on Web API. 

Most of the times we use the `$app/environment` browser designation to allow for server process to fully complete, and then execute the Web API components, as gate by `browser` designation. 

eg. Map example 

```svelte
<script lang="ts">
	import { browser } from '$app/environment';
	import Map from '$lib/components/map.svelte';
</script>


{#if !browser}
	<h2>Loading map...</h2>
{:else}
	<Map bind:lat bind:lng />
{/if}
```

In Svelte this behavior works correctly to bypass any server process required. Ultimately this is a premature optimization in Svelte because it is largely browser-dependent.

From here on you may notice that Svelte and SvelteKit are used interchangeably. Svelte mentions above are the only place where they can ONLY mean the Svelte frontend library.

## Sveltekit

To expand on the Map example, it's common that Map libraries include `IntersectionObservers`, or `ResizeObservers`, or other Web APIs required for complex interaction. 

The above example of browser gating will fail when implemented within a SvelteKit application, usually with the error that `X API cannot be found`, causing confusion.

Why is a browser gated piece of code still running on the server? Who is running? These are questions I've yet to answer. 

However there is a way to avoid this behavior and bypass the errors. 

## Svelte / Page options

Official documentation on page options -> https://svelte.dev/docs/kit/page-options

> You can control each of these on a page-by-page basis by exporting options from +page.js or +page.server.js, or for groups of pages using a shared +layout.js or +layout.server.js.

Within that +layout.ts file we need to focus on 2 page options specifically:
- ssr
- csr

## Svelte / Page options / ssr

> Normally, SvelteKit renders your page on the server first and sends that HTML to the client where it’s hydrated. If you set ssr to false, it renders an empty ‘shell’ page instead. This is useful if your page is unable to be rendered on the server (because you use browser-only globals like document for example), but in most situations it’s not recommended (see appendix).

Turning this option off does indeed fix the problem of browser-dependencies being run outside of a browser gate.

```svelte
// +layout.ts
export const ssr = false;

```

But the following notice in the docs sounds concerning and mysterious.

> Even with ssr set to false, code that relies on browser APIs should be imported in your +page.svelte or +layout.svelte file instead. This is because page options can be overridden and need to be evaluated by importing your +page.js or +layout.js file on the server (if you have a runtime) or at build time (in case of prerendering).

What does importing mean here? In the majority of cases where this becomes a problem, we experience the problem when importing from an external module, which depends on Web APIs within.

Map example again: lib/components/map.svelte

```svelte
// Map.svelte
<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import WebMap from '@arcgis/core/WebMap';
	import MapView from '@arcgis/core/views/MapView';

	let mapView: MapView | undefined = $state();
	let mapContainer: HTMLDivElement | undefined = $state();
    	let { lng = $bindable(), lat = $bindable() } = $props();

	onMount(() => {
		// Initialize the map only in the browser
		mapView = new MapView({
			container: mapContainer
			center: [lng, lat]
		})
		
	});

	onDestroy(() => {
		if (mapView) {
			mapView.destroy();
		}
	});
</script>

{#if !browser}
    <p>Loading map...</p>
{:else}
    <div bind:this={mapContainer} class="arcgic-map"></div>
{/if}

```

This example will trigger a `ResizeObserver` error, even though we have gated the code within the browser. 

The errors is triggered within an ARCGIS SDK library. 

Again what does importing mean here? We have technically imported the code and gated it correctly. And since the Map component is imported by the `+page.svelte` that should pass the criteria outlined. 

What else is needed? 

Do we have to import the offending API itself? Surely not, since that would also require up to shadow the existing Web API (when available) with an manually imported one. 

## Svelte / Page options / csr

> Ordinarily, SvelteKit hydrates your server-rendered HTML into an interactive client-side-rendered (CSR) page. Some pages don’t require JavaScript at all — many blog posts and ‘about’ pages fall into this category. In these cases you can disable CSR:

This setting is not technically a requirement, but is a bit of configuration that translates what we want to expect: we want the Map page to always run Javascript because it contains an external module that has it's own features and requirements.

```svelte
// +layout.ts
export const ssr = false;
export const csr = true; 
```

## Svelte / Page options / prerender

This is a counter intuitive naming. Although it does configure prerendering, the purpose for using it is nuanced. 

In our case we can't prerender a Map page, since they usually involved regular requests for: loading, zooming, fetching tiles etc. All managed by external libraries.

But we do want to prerender the page itself. 

Map pages are usually a code injection scenario: we inject our dynamic element into a static HTML. This is a one-way binding, in other words we inject the map and only interact with it there on.

Sometimes we may have a dynamic element that is external to the map and is tied to it in some way: a filter that changes as the map changes, a banner that updates as we move the map, a sector select that moves the map as we change sectors. All of which are still code injection scenarios, with 2-way bind.

Both scenarios are compatible with prerendering: since we only want to route to be prerendered, and the html by proxy.

Routes with prerender true are excluded from manifests, so our server is tiny.

In my use case I want dynamic Maps within static files, no servers involved. 

All routes are default `prerendered = true` and the Svelte `adapter-static` is used. 

```svelte     
// +layout.ts
export const ssr = false;
export const csr = true;
export const prerender = true;
```

Of note prerender can also be 'auto', where you want popular routes to be pre-rendered and historic content to be server-rendered. 

Unclear at what scale this is required, because a server rendering content is probably more maintenance and resource-heavy than fully static build. 

The fully static build takes longer to compile, but once deployed it's essentially free. With CI/CD and strong hardware this long compile time is a minor negative point.

Either way, the "auto" option is there.

For larger prerendered builds it's important to also consider `entries`. These need to pre-build to ensure the best prerendering performance. I will cover them in a future post.

## Summary

Strange behavior and even stranger docs, however the configuration above does produce the expected results. 

In hindsight I'd expect the handling of CSR and SSR to be more consistent, but with most frameworks preferring 'server' options it's to be expected that CSR behavior is not quite there by default.
