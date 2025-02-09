import { getPost, getPosts } from '$lib/posts';
import { error } from '@sveltejs/kit';
import type { RouteParams } from './$types';

export function entries() {
    const posts = getPosts();

    const postSlugs: RouteParams[] = posts.reduce((acc, post) => {
        if (post.slug && post.slug.length > 0) {
            acc.push({ slug: post.slug })
            return acc;
        }
        return acc;
    }, [] as RouteParams[])
    
    return postSlugs;
}

export async function load({ params }) {
    const slug = params.slug!;
    if (!slug) error(404, 'Slug Not found');
    const post = await getPost(params.slug);
    if (!post) error(404, 'Post Not found');
    return post
}
