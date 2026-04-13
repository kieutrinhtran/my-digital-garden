import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";
import { NoteFolder, PostDetail, PostFrontmatter, PostSummary, SortMode } from "./types";
import { slugFromPermalink, toSlug } from "./slug";

const CONTENT_ROOT = path.join(process.cwd(), "src", "site", "notes");

function toFolderKey(parts: string[]): string {
  return parts.map((segment) => segment.trim().toLowerCase()).join("/");
}

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

function scanDirectories(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const result: string[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const fullPath = path.join(dir, entry.name);
    result.push(fullPath);
    result.push(...scanDirectories(fullPath));
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
  const relative = path.relative(CONTENT_ROOT, filePath);
  const relativeDir = path.dirname(relative);
  const parts = relativeDir === "." ? [] : relativeDir.split(path.sep).filter(Boolean);
  const folderName = parts.length > 0 ? parts[parts.length - 1] : "Khac";
  const folderSlug = parts.length > 0 ? toFolderKey(parts) : "khac";

  return {
    summary: { slug, title, description, date, tags, folderSlug, folderName },
    markdownBody: content,
  };
}

function sortPosts(posts: PostSummary[], sort: SortMode): PostSummary[] {
  const copy = [...posts];
  copy.sort((a, b) => {
    if (sort === "oldest") return +new Date(a.date) - +new Date(b.date);
    if (sort === "title") return a.title.localeCompare(b.title, "vi");
    return +new Date(b.date) - +new Date(a.date);
  });
  return copy;
}

export function getAllPostSummaries(opts?: {
  q?: string;
  sort?: SortMode;
  folder?: string;
}): PostSummary[] {
  const sort = opts?.sort || "newest";
  const query = (opts?.q || "").trim().toLowerCase();
  const folder = (opts?.folder || "").trim().toLowerCase();
  const files = scanMarkdownFiles(CONTENT_ROOT);
  const posts = files.map((filePath) => parsePostFile(filePath).summary);
  const withFolder = folder
    ? posts.filter(
        (post) => post.folderSlug === folder || post.folderSlug.startsWith(`${folder}/`),
      )
    : posts;
  const filtered = query
    ? withFolder.filter((post) =>
        `${post.title} ${post.description}`.toLowerCase().includes(query),
      )
    : withFolder;
  return sortPosts(filtered, sort);
}

export function getTopNoteFolders(): NoteFolder[] {
  const directories = scanDirectories(CONTENT_ROOT);
  const folderMap = new Map<string, NoteFolder>();

  for (const dirPath of directories) {
    const relative = path.relative(CONTENT_ROOT, dirPath);
    const parts = relative.split(path.sep).filter(Boolean);
    if (parts.length === 0) continue;

    const slug = toFolderKey(parts);
    if (folderMap.has(slug)) continue;

    folderMap.set(slug, {
      slug,
      name: parts.join(" / "),
      depth: parts.length - 1,
    });
  }

  return [...folderMap.values()].sort((a, b) => {
    if (a.depth !== b.depth) return a.depth - b.depth;
    return a.name.localeCompare(b.name, "vi");
  });
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  const files = scanMarkdownFiles(CONTENT_ROOT);
  for (const filePath of files) {
    const { summary, markdownBody } = parsePostFile(filePath);
    if (summary.slug !== slug) continue;

    const html = await remark()
      .use(remarkGfm)
      .use(remarkMath, { singleDollarTextMath: false })
      .use(remarkRehype)
      .use(rehypeKatex)
      .use(rehypeStringify)
      .process(markdownBody);

    return {
      ...summary,
      contentHtml: String(html),
    };
  }
  return null;
}
