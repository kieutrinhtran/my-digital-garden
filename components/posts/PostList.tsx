import Link from "next/link";
import { NoteFolder, PostSummary, SortMode } from "@/lib/content/types";
import { PostCard } from "./PostCard";

const sortLabel: Record<SortMode, string> = {
  newest: "Mới nhất",
  oldest: "Cũ nhất",
  views: "Nhiều lượt xem",
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
      <header className="glass-panel mb-6 rounded-2xl p-5">
        <h1 className="text-4xl font-bold tracking-tight text-white">Bài viết mới nhất</h1>
        <p className="mt-2 text-sm text-indigo-100/75">{posts.length} bài</p>

        <nav className="mt-4 flex flex-wrap gap-2">
          <Link
            href={createFolderHref("")}
            className={`rounded-full px-3 py-1 text-xs ${
              activeFolder === "" ? "bg-white/25 text-white" : "bg-white/10 text-indigo-100/80"
            }`}
          >
            Tất cả
          </Link>
          {folders.map((item) => (
            <Link
              key={item.slug}
              href={createFolderHref(item.slug)}
              className={`rounded-full px-3 py-1 text-xs ${
                activeFolder === item.slug
                  ? "bg-white/25 text-white"
                  : "bg-white/10 text-indigo-100/80"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

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
