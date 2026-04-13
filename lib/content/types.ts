export type SortMode = "newest" | "oldest" | "views" | "title";

export type PostFrontmatter = {
  title?: string;
  date?: string;
  updated?: string;
  description?: string;
  slug?: string;
  tags?: string[];
  permalink?: string;
  views?: number;
};

export type PostSummary = {
  slug: string;
  title: string;
  description: string;
  date: string;
  views: number;
  tags: string[];
  folderSlug: string;
  folderName: string;
};

export type PostDetail = PostSummary & {
  contentHtml: string;
};

export type NoteFolder = {
  slug: string;
  name: string;
};
