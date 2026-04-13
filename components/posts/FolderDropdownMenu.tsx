"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { SortMode } from "@/lib/content/types";

type Item = {
  slug: string;
  label: string;
};

type Props = {
  parentName: string;
  parentSlug: string;
  parentHref: string;
  items: Item[];
  activeFolder: string;
  q?: string;
  sort: SortMode;
  actionPath: "/" | "/posts";
};

function buildFolderHref(
  folderValue: string,
  q: string | undefined,
  sort: SortMode,
  actionPath: string,
): string {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (sort) params.set("sort", sort);
  if (folderValue) params.set("folder", folderValue);
  const query = params.toString();
  return query ? `${actionPath}?${query}` : actionPath;
}

export function FolderDropdownMenu({
  parentName,
  parentSlug,
  parentHref,
  items,
  activeFolder,
  q,
  sort,
  actionPath,
}: Props) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelPos, setPanelPos] = useState({ top: 0, left: 0 });

  const isParentActive =
    activeFolder === parentSlug || activeFolder.startsWith(`${parentSlug}/`);

  const updatePosition = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const gap = 6;
    const panelWidth = panelRef.current?.offsetWidth ?? 224;
    const maxLeft = Math.max(8, window.innerWidth - panelWidth - 8);
    const left = Math.min(Math.max(8, rect.left), maxLeft);
    const top = rect.bottom + gap;
    setPanelPos({ top, left });
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;

    const onScrollOrResize = () => {
      updatePosition();
    };

    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative shrink-0">
      <div
        className={`flex items-center rounded-full text-xs ${
          isParentActive ? "bg-white/25 text-white" : "bg-white/10 text-indigo-100/80"
        }`}
      >
        <Link href={parentHref} className="rounded-l-full px-3 py-1">
          {parentName}
        </Link>
        <button
          type="button"
          ref={triggerRef}
          aria-expanded={open}
          aria-haspopup="menu"
          onClick={() => {
            setOpen((v) => !v);
          }}
          className="rounded-r-full px-2 py-1 hover:bg-white/10"
        >
          {open ? "▴" : "▾"}
        </button>
      </div>

      {open ? (
        <div
          ref={panelRef}
          role="menu"
          className="fixed z-[100] max-h-[min(70vh,24rem)] min-w-56 overflow-y-auto rounded-xl border border-white/20 bg-slate-900/95 p-2 shadow-2xl backdrop-blur"
          style={{ top: panelPos.top, left: panelPos.left }}
        >
          {items.map((item) => (
            <Link
              key={item.slug}
              role="menuitem"
              href={buildFolderHref(item.slug, q, sort, actionPath)}
              onClick={() => setOpen(false)}
              className={`block rounded-lg px-2 py-1.5 text-xs ${
                activeFolder === item.slug
                  ? "bg-white/20 text-white"
                  : "text-indigo-100/85 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
