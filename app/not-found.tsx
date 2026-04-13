import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center px-4">
      <div className="glass-panel rounded-2xl p-8 text-center">
        <h1 className="text-3xl font-bold text-white">Không tìm thấy bài viết</h1>
        <p className="mt-3 text-indigo-100/80">Link có thể đã thay đổi theo URL scheme mới.</p>
        <Link href="/" className="mt-6 inline-block text-indigo-200 hover:text-white">
          Về trang chủ
        </Link>
      </div>
    </main>
  );
}
