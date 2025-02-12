import {parse, format} from 'date-fns'

const SITE_LINK = "https://alanionita.github.io/portfolio--svelte";

export function makeXMLOutline(items: string): string {
    const xmlEncoding = "UTF-8";
    const xmlLang = "en-GB";
    const title = "Alan Ionita - Fullstack developer porfolio, React, AWS, Typescript, bun";
    const description = "Latest blog posts";

    return `<?xml version="1.0" encoding="${xmlEncoding}"?>
        <rss version="2.0">
            <channel>
                <title>${title}</title>
                <link>${SITE_LINK}</link>
                <description>${description}</description>
                <language>${xmlLang}</language>
                <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
                ${items!}
            </channel>
        </rss>`;
}

export function makeXMLItems(data: App.Post[]): string {
    return data.map((post: App.Post) => {
        const dateObj = parse(post.created, 'dd/MM/yyyy', new Date());
        const rfc822DateStr = format(dateObj, 'EEE, dd MMM yyyy HH:mm:ss XX');
        return `<item>
            <title>${post.title}</title>
            <link>${SITE_LINK}/blog/${post.url}</link>
            <pubDate>${rfc822DateStr}</pubDate>
            <author>Alan Ionita</author>
            ${post.desc ? `<description>${post.desc}</description>` : ''}
            <content:encoded>
                <![CDATA[
                    ${post.html || ""}
                ]]>
            </content:encoded>
        </item>`
    }).join("")
}
