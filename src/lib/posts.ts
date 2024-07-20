import fs from "fs";
import path from "path";
import frontmatter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
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

export function getPosts(): Array<App.Post> {
    const files = fs.readdirSync(POSTS_DIR);

    function getFrontmatterData(file: string) {
        const id = file.replace(/\.md$/, "");
        const fullPath = path.join(POSTS_DIR, file);
        const { data } = frontmatter.read(fullPath);
        return {
            id,
            ...data,
        } as App.Post;
    }

    const posts = files.map(getFrontmatterData);
    // Sort posts by date
    return posts.sort(dateSortDecending);
}

export async function getPost(id: string): Promise<App.Post> {
    const postPath = path.join(POSTS_DIR, `${id}.md`);

    const { content, data } = frontmatter.read(postPath);

    const { title, desc, updated, created } = data;

    const postHtml = await remark()
        .use(html, { sanitize: true })
        .process(content);
    return {
        id,
        html: postHtml.toString(),
        title,
        desc,
        updated,
        created
    }
}
