const { getGraph } = require("../../helpers/linkUtils");
const { getFileTree } = require("../../helpers/filetreeUtils");
const { userComputed } = require("../../helpers/userUtils");
const { getNextPreviousNotes } = require("../../helpers/navigationUtils");
const { getRelatedPosts } = require("../../helpers/relatedPosts");
const { generatePostHeatmap, groupByWeeks } = require("../../helpers/postHeatmap");

module.exports = {
  graph: async (data) => await getGraph(data),
  filetree: (data) => getFileTree(data),
  userComputed: (data) => userComputed(data),
  navigation: (data) => {
    // Chỉ tính navigation cho note pages (không phải homepage)
    if (data.tags && data.tags.indexOf("gardenEntry") !== -1) {
      return { next: null, previous: null };
    }
    return getNextPreviousNotes(data);
  },
  relatedPosts: (data) => {
    // Chỉ tính related posts cho note pages
    if (data.tags && data.tags.indexOf("gardenEntry") !== -1) {
      return [];
    }
    return getRelatedPosts(data, 5);
  },
  // SEO Meta
  seoMeta: (data) => {
    const siteBaseUrl = data.meta?.siteBaseUrl || "";
    const pageUrl = data.permalink || data.url || "";
    const fullUrl = siteBaseUrl + pageUrl;
    const title = data.title || data.page?.fileSlug || "";
    const description = data.description || 
      (data.content ? data.content.substring(0, 160).replace(/[#*\[\]()]/g, "").trim() : "") ||
      `${title} - ${data.meta?.siteName || "Digital Garden"}`;
    
    return {
      title: title,
      description: description,
      url: fullUrl,
      canonical: fullUrl,
      image: data.image || (siteBaseUrl + "/img/og-default.jpg"),
      type: data.tags?.includes("gardenEntry") ? "website" : "article",
      publishedTime: data.date ? new Date(data.date).toISOString() : null,
      modifiedTime: data.updated ? new Date(data.updated).toISOString() : null,
      author: data.author || data.meta?.siteName || "",
      tags: data.tags || []
    };
  },
  // Post Heatmap
  postHeatmap: (data) => {
    const notes = data.collections.note || [];
    const heatmapData = generatePostHeatmap(notes);
    const weeks = groupByWeeks(heatmapData.data);
    return {
      weeks: weeks,
      maxCount: heatmapData.maxCount,
      totalDays: heatmapData.totalDays,
      startDate: heatmapData.startDate,
      endDate: heatmapData.endDate
    };
  }
};
