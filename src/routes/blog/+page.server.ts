import { getPosts } from '$lib/posts';
import { error } from '@sveltejs/kit';

export function load() {
    const posts = getPosts();
    if (!posts) error(404, 'Not found');
    return { posts }
}