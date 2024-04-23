import fs from "fs";
import path from "path";
import frontmatter from "gray-matter";

function dateSortDecending(a: App.Post, b: App.Post) {
    if (a.created < b.created) {
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