import { getAllPostSummaries, getTopNoteFolders } from "@/lib/content/content";
import { SortMode } from "@/lib/content/types";
import { PostList } from "@/components/posts/PostList";
import { Hero3D } from "@/components/hero/Hero3D";

export const dynamic = "force-dynamic";

function normalizeSort(input?: string): SortMode {
  if (input === "oldest" || input === "title") return input;
  return "newest";
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sort?: string; folder?: string }>;
}) {
  const params = await searchParams;
  const q = params.q || "";
  const sort = normalizeSort(params.sort);
  const folder = params.folder || "";
  const posts = getAllPostSummaries({ q, sort, folder });
  const folders = getTopNoteFolders();

  return (
    <main className="pb-12">
      <Hero3D />
      <PostList posts={posts} folders={folders} q={q} sort={sort} folder={folder} actionPath="/" />
    </main>
  );
}
