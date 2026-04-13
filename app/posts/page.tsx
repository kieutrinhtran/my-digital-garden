import { getAllPostSummaries } from "@/lib/content/content";
import { SortMode } from "@/lib/content/types";
import { PostList } from "@/components/posts/PostList";

function normalizeSort(input?: string): SortMode {
  if (input === "oldest" || input === "views" || input === "title") return input;
  return "newest";
}

export default function PostsPage({
  searchParams,
}: {
  searchParams: { q?: string; sort?: string };
}) {
  const q = searchParams.q || "";
  const sort = normalizeSort(searchParams.sort);
  const posts = getAllPostSummaries({ q, sort });
  return <PostList posts={posts} q={q} sort={sort} actionPath="/posts" />;
}
