"use client";

import { useEffect, useState } from "react";

type TocItem = {
  id: string;
  text: string;
  level: number;
};

function toId(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function TocOutline() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<TocItem[]>([]);

  useEffect(() => {
    const root = document.querySelector(".article-content");
    if (!root) return;

    const headings = Array.from(root.querySelectorAll("h2, h3")) as HTMLHeadingElement[];
    const mapped = headings
      .map((heading) => {
        const text = heading.textContent?.trim() || "";
        if (!text) return null;

        if (!heading.id) {
          heading.id = toId(text);
        }

        return {
          id: heading.id,
          text,
          level: Number(heading.tagName.replace("H", "")),
        } as TocItem;
      })
      .filter((item): item is TocItem => item !== null);

    const timer = window.setTimeout(() => {
      setItems(mapped);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const hasItems = items.length > 0;
  if (!hasItems) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Mở mục lục"
        className="glass-panel fixed bottom-5 right-5 z-50 rounded-full px-4 py-2 text-sm font-semibold text-white hover:bg-white/20"
      >
        ☰ Mục lục
      </button>

      {open ? (
        <aside className="glass-panel fixed right-5 top-20 z-50 w-72 rounded-2xl p-4 text-sm text-indigo-100">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-white">Outline</h3>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-1 text-indigo-100 hover:bg-white/10"
            >
              ✕
            </button>
          </div>
          <nav className="max-h-[55vh] overflow-auto pr-1">
            <ul className="space-y-2">
              {items.map((item) => (
                <li key={item.id} className={item.level === 3 ? "pl-4" : ""}>
                  <a
                    href={`#${item.id}`}
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-2 py-1 hover:bg-white/10 hover:text-white"
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      ) : null}
    </>
  );
}
