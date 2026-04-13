import Link from "next/link";
import { PostSummary } from "@/lib/content/types";

export function PostCard({ post }: { post: PostSummary }) {
  return (
    <article className="glass-panel rounded-2xl p-5 transition hover:-translate-y-1 hover:border-white/40">
      <Link href={`/posts/${post.slug}`} className="block space-y-3 no-underline">
        <h2 className="text-xl font-semibold text-white">{post.title}</h2>
        <p className="line-clamp-3 text-sm text-indigo-100/80">{post.description}</p>
        <div className="flex items-center text-xs text-indigo-100/70">
          <span>{new Date(post.date).toLocaleDateString("vi-VN")}</span>
        </div>
      </Link>
    </article>
  );
}
