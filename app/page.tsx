import { getAllPostSummaries, getTopNoteFolders } from "@/lib/content/content";
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
  searchParams: { q?: string; sort?: string; folder?: string };
}) {
  const q = searchParams.q || "";
  const sort = normalizeSort(searchParams.sort);
  const folder = searchParams.folder || "";
  const posts = getAllPostSummaries({ q, sort, folder });
  const folders = getTopNoteFolders();

  return (
    <main className="pb-12">
      <Hero3D />
      <PostList posts={posts} folders={folders} q={q} sort={sort} folder={folder} actionPath="/" />
    </main>
  );
}
