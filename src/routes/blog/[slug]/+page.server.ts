import { getPost } from '$lib/posts';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
    const post = await getPost(params.slug);
    if (!post) error(404, 'Post Not found');
    return post
}