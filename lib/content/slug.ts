export function toSlug(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function slugFromPermalink(permalink?: string): string | null {
  if (!permalink) return null;
  const cleaned = permalink.replace(/^\/+|\/+$/g, "");
  if (!cleaned) return null;
  const parts = cleaned.split("/").filter(Boolean);
  return parts[parts.length - 1] ?? null;
}
