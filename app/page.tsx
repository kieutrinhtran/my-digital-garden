import { getAllPostSummaries } from "@/lib/content/content";
import { SortMode } from "@/lib/content/types";
import { PostList } from "@/components/posts/PostList";
import { Hero3D } from "@/components/hero/Hero3D";

function normalizeSort(input?: string): SortMode {
  if (input === "oldest" || input === "views" || input === "title") return input;
  return "newest";
}

export default function HomePage({
  searchParams,
}: {
  searchParams: { q?: string; sort?: string };
}) {
  const q = searchParams.q || "";
  const sort = normalizeSort(searchParams.sort);
  const posts = getAllPostSummaries({ q, sort });

  return (
    <main className="pb-12">
      <Hero3D />
      <PostList posts={posts} q={q} sort={sort} actionPath="/" />
    </main>
  );
}
