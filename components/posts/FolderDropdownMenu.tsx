"use client";

import Link from "next/link";
import { useState } from "react";
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

  const isParentActive =
    activeFolder === parentSlug || activeFolder.startsWith(`${parentSlug}/`);

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
          role="menu"
          className="absolute left-0 top-9 z-[100] max-h-[min(70vh,24rem)] min-w-56 overflow-y-auto rounded-xl border border-white/20 bg-slate-900/95 p-2 shadow-2xl backdrop-blur"
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
