import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Digital Garden",
  description: "Danh sach bai viet va trang doc bai bang Next.js 16",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
