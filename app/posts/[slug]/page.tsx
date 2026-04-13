import Link from "next/link";
import { notFound } from "next/navigation";
import { TocOutline } from "@/components/posts/TocOutline";
import { getAllPostSummaries, getPostBySlug } from "@/lib/content/content";

export async function generateStaticParams() {
  return getAllPostSummaries().map((post) => ({ slug: post.slug }));
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 md:py-10">
      <TocOutline />
      <article className="glass-panel rounded-2xl p-6 md:p-10">
        <Link href="/" className="text-sm text-indigo-100/80 hover:text-white">
          ← Quay về danh sách bài viết
        </Link>
        <h1 className="mt-4 text-3xl font-bold leading-tight text-white md:text-4xl">{post.title}</h1>
        <p className="mt-2 text-sm text-indigo-100/70">{new Date(post.date).toLocaleDateString("vi-VN")}</p>

        <div
          className="article-content mt-8"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </article>
    </main>
  );
}
