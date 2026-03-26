import { resolve } from '$app/paths';

type FnGetSlug = () => string

export function makeBlogPostURL(getSlug: FnGetSlug) {
    const BLOG_ROUTE = '/blog'
    const url = resolve(`${BLOG_ROUTE}/[slug]`, {
        slug: getSlug()
    });

    return url
}
