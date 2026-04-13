import { PostSummary, SortMode } from "@/lib/content/types";
import { PostCard } from "./PostCard";

const sortLabel: Record<SortMode, string> = {
  newest: "Mới nhất",
  oldest: "Cũ nhất",
  views: "Nhiều lượt xem",
  title: "Theo tiêu đề",
};

export function PostList({
  posts,
  q,
  sort,
  actionPath,
}: {
  posts: PostSummary[];
  q?: string;
  sort: SortMode;
  actionPath: "/" | "/posts";
}) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8">
      <header className="glass-panel mb-6 rounded-2xl p-5">
        <h1 className="text-4xl font-bold tracking-tight text-white">Bài viết mới nhất</h1>
        <p className="mt-2 text-sm text-indigo-100/75">{posts.length} bài</p>

        <form action={actionPath} className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-[1fr_220px]">
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
