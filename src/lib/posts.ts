import fs from "fs";
import path from "path";
import frontmatter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import remarkImages from 'remark-images'
import { parse } from 'date-fns'

function dateSortDecending(a: App.Post, b: App.Post) {
    const aCreated = parse(a.created, 'dd/MM/yyyy', new Date())
    const bCreated = parse(b.created, 'dd/MM/yyyy', new Date())

    if (aCreated < bCreated) {
        return 1;
    } else {
        return -1;
    }
};

const POSTS_DIR = path.join(process.cwd(), "static", "posts");

export async function getPosts(): Promise<App.Post[]> {
    const files = fs.readdirSync(POSTS_DIR);

    async function getFrontmatterData(file: string) {
        const id = file.replace(/\.md$/, "");
        const fullPath = path.join(POSTS_DIR, file);
        const { data, content } = frontmatter.read(fullPath);
        const postHtml = await remark()
            .use(html, { sanitize: true })
            .process(content);
        
        return {
            id,
            html: postHtml.toString(),
            ...data,
        } as App.Post;
    }

    const posts = await Promise.all(files.map(getFrontmatterData));
    // Sort posts by date
    return posts.sort(dateSortDecending);
}

export async function getPost(id: string): Promise<App.Post> {
    const files = fs.readdirSync(POSTS_DIR);

    const filename: string = files.filter(path => path.includes(id))[0]!;

    const postPath = path.join(POSTS_DIR, `${filename}`);

    const { content, data } = frontmatter.read(postPath);

    const fixesImageLinks = content.replace("/%sveltekit.assets%25", 'static')

    const { title, desc, updated, created, url, tags } = data;

    const postHtml = await remark()
        .use(remarkImages)
        .use(html, { sanitize: true })
        .process(fixesImageLinks);
    return {
        id,
        html: postHtml.toString(),
        title,
        desc,
        updated,
        created,
        url,
        tags
    }
}
