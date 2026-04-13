import Link from "next/link";
import { NoteFolder, PostSummary, SortMode } from "@/lib/content/types";
import { FolderDropdownMenu } from "./FolderDropdownMenu";
import { PostCard } from "./PostCard";

const sortLabel: Record<SortMode, string> = {
  newest: "Mới nhất",
  oldest: "Cũ nhất",
  title: "Theo tiêu đề",
};

export function PostList({
  posts,
  folders,
  q,
  sort,
  folder,
  actionPath,
}: {
  posts: PostSummary[];
  folders: NoteFolder[];
  q?: string;
  sort: SortMode;
  folder?: string;
  actionPath: "/" | "/posts";
}) {
  const activeFolder = folder || "";
  const parentFolders = folders
    .filter((item) => item.depth === 0)
    .sort((a, b) => a.name.localeCompare(b.name, "vi"));
  const getChildren = (parentSlug: string) =>
    folders
      .filter((item) => item.depth === 1 && item.slug.startsWith(`${parentSlug}/`))
      .sort((a, b) => a.name.localeCompare(b.name, "vi"));
  const getRelativeName = (parentName: string, childName: string) =>
    childName.startsWith(`${parentName} / `)
      ? childName.slice(parentName.length + 3)
      : childName;

  const createFolderHref = (folderValue: string) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (sort) params.set("sort", sort);
    if (folderValue) params.set("folder", folderValue);
    const query = params.toString();
    return query ? `${actionPath}?${query}` : actionPath;
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="sticky top-4 z-40 mb-4">
        <nav className="glass-panel flex flex-wrap items-center gap-2 rounded-2xl px-3 py-3">
          <Link
            href={createFolderHref("")}
            className={`shrink-0 rounded-full px-3 py-1 text-xs ${
              activeFolder === "" ? "bg-white/25 text-white" : "bg-white/10 text-indigo-100/80"
            }`}
          >
            Tất cả
          </Link>
          {parentFolders.map((parent) => {
            const children = getChildren(parent.slug);
            if (children.length === 0) {
              return (
                <Link
                  key={parent.slug}
                  href={createFolderHref(parent.slug)}
                  className={`shrink-0 rounded-full px-3 py-1 text-xs ${
                    activeFolder === parent.slug
                      ? "bg-white/25 text-white"
                      : "bg-white/10 text-indigo-100/80"
                  }`}
                >
                  {parent.name}
                </Link>
              );
            }

            const menuItems = [
              { slug: parent.slug, label: `Tất cả trong ${parent.name}` },
              ...children.map((child) => ({
                slug: child.slug,
                label: getRelativeName(parent.name, child.name),
              })),
            ];

            return (
              <FolderDropdownMenu
                key={parent.slug}
                parentName={parent.name}
                parentSlug={parent.slug}
                parentHref={createFolderHref(parent.slug)}
                items={menuItems}
                activeFolder={activeFolder}
                q={q}
                sort={sort}
                actionPath={actionPath}
              />
            );
          })}
        </nav>
      </div>

      <header className="glass-panel mb-6 rounded-2xl p-5">
        <h1 className="text-4xl font-bold tracking-tight text-white">Bài viết mới nhất</h1>
        <p className="mt-2 text-sm text-indigo-100/75">{posts.length} bài</p>

        <form action={actionPath} className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-[1fr_220px]">
          {folder ? <input type="hidden" name="folder" value={folder} /> : null}
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Tìm bài viết..."
            className="rounded-xl border border-white/20 bg-black/25 px-4 py-2 text-sm text-white outline-none placeholder:text-indigo-100/40"
          />
          <select
            name="sort"
            defaultValue={sort}
            className="rounded-xl border border-white/20 bg-black/25 px-3 py-2 text-sm text-white outline-none"
          >
            {(Object.keys(sortLabel) as SortMode[]).map((mode) => (
              <option key={mode} value={mode} className="bg-slate-900">
                {sortLabel[mode]}
              </option>
            ))}
          </select>
        </form>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
