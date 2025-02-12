import { getPost, getPosts } from '$lib/posts';
import { error } from '@sveltejs/kit';
import type { RouteParams } from './$types';
import { makeXMLItems, makeXMLOutline } from '$lib/rss-feed';
import fs from 'fs';


function makeXMLFeed(data: App.Post[]) {
    const itemsStr = makeXMLItems(data)!;
    const feedStr = makeXMLOutline(itemsStr);

    fs.writeFileSync(`${process.cwd()}/static/rss-feed.xml`, feedStr);
}

export function entries() {
    const posts = getPosts();
    const postSlugs: RouteParams[] = posts.reduce((acc, post) => {
        if (post.slug && post.slug.length > 0) {
            acc.push({ slug: post.slug })
            return acc;
        }
        return acc;
    }, [] as RouteParams[])

    makeXMLFeed(posts);
    return postSlugs;
}

export async function load({ params }) {
    const slug = params.slug!;
    if (!slug) error(404, 'Slug Not found');
    const post = await getPost(params.slug);
    if (!post) error(404, 'Post Not found');
    return post
}
