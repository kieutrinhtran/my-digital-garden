import { getAllPostSummaries, getTopNoteFolders } from "@/lib/content/content";
import { SortMode } from "@/lib/content/types";
import { PostList } from "@/components/posts/PostList";

function normalizeSort(input?: string): SortMode {
  if (input === "oldest" || input === "views" || input === "title") return input;
  return "newest";
}

export default function PostsPage({
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
    <PostList
      posts={posts}
      folders={folders}
      q={q}
      sort={sort}
      folder={folder}
      actionPath="/posts"
    />
  );
}
