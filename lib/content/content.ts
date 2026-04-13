import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { PostDetail, PostFrontmatter, PostSummary, SortMode } from "./types";
import { slugFromPermalink, toSlug } from "./slug";

const CONTENT_ROOT = path.join(process.cwd(), "src", "site", "notes");

function scanMarkdownFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const result: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      result.push(...scanMarkdownFiles(fullPath));
      continue;
    }
    if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
      result.push(fullPath);
    }
  }

  return result;
}

function parsePostFile(filePath: string): { summary: PostSummary; markdownBody: string } {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const fm = data as PostFrontmatter;
  const basename = path.basename(filePath, ".md");
  const slug =
    fm.slug ||
    slugFromPermalink(fm.permalink) ||
    toSlug((fm.title || basename).trim());
  const title = (fm.title || basename).trim();
  const plain = content.replace(/[#>*_\-\[\]\(\)`]/g, " ").replace(/\s+/g, " ").trim();
  const description = (fm.description || plain.slice(0, 180)).trim();
  const date = fm.date || fm.updated || new Date().toISOString();
  const tags = Array.isArray(fm.tags) ? fm.tags : [];
  const views = Number(fm.views || 0);

  return {
    summary: { slug, title, description, date, tags, views },
    markdownBody: content,
  };
}

function sortPosts(posts: PostSummary[], sort: SortMode): PostSummary[] {
  const copy = [...posts];
  copy.sort((a, b) => {
    if (sort === "views") return b.views - a.views;
    if (sort === "oldest") return +new Date(a.date) - +new Date(b.date);
    if (sort === "title") return a.title.localeCompare(b.title, "vi");
    return +new Date(b.date) - +new Date(a.date);
  });
  return copy;
}

export function getAllPostSummaries(opts?: { q?: string; sort?: SortMode }): PostSummary[] {
  const sort = opts?.sort || "newest";
  const query = (opts?.q || "").trim().toLowerCase();
  const files = scanMarkdownFiles(CONTENT_ROOT);
  const posts = files.map((filePath) => parsePostFile(filePath).summary);
  const filtered = query
    ? posts.filter((post) =>
        `${post.title} ${post.description}`.toLowerCase().includes(query),
      )
    : posts;
  return sortPosts(filtered, sort);
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  const files = scanMarkdownFiles(CONTENT_ROOT);
  for (const filePath of files) {
    const { summary, markdownBody } = parsePostFile(filePath);
    if (summary.slug !== slug) continue;

    const html = await remark()
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypeStringify)
      .process(markdownBody);

    return {
      ...summary,
      contentHtml: String(html),
    };
  }
  return null;
}
