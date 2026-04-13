import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPostSummaries, getPostBySlug } from "@/lib/content/content";

export async function generateStaticParams() {
  return getAllPostSummaries().map((post) => ({ slug: post.slug }));
}

export default async function PostDetailPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8">
      <article className="glass-panel rounded-2xl p-6 md:p-8">
        <Link href="/" className="text-sm text-indigo-100/80 hover:text-white">
          ← Quay về danh sách bài viết
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-white md:text-4xl">{post.title}</h1>
        <p className="mt-2 text-sm text-indigo-100/70">
          {new Date(post.date).toLocaleDateString("vi-VN")} · {post.views} views
        </p>

        <div
          className="prose prose-invert mt-8 max-w-none prose-headings:text-white prose-p:text-indigo-50/90"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </article>
    </main>
  );
}
