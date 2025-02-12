import { getPosts } from '$lib/posts';
import { error } from '@sveltejs/kit';

export async function load() {
    const posts = await getPosts();
    if (!posts) error(404, 'Posts Not found');
    return { posts }
}
