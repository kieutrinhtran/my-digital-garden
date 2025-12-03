const { getGraph } = require("../../helpers/linkUtils");
const { getFileTree } = require("../../helpers/filetreeUtils");
const { userComputed } = require("../../helpers/userUtils");
const { getNextPreviousNotes } = require("../../helpers/navigationUtils");
const { getRelatedPosts } = require("../../helpers/relatedPosts");
const { generatePostHeatmap, generateMonthHeatmap, generateWeekHeatmap, groupByWeeks } = require("../../helpers/postHeatmap");

// Cache cho graph và filetree để tránh tính toán lại
const graphCache = new Map();
const filetreeCache = new Map();

module.exports = {
  graph: async (data) => {
    // Luôn tính graph vì graph.njk cần nó, nhưng cache để tối ưu
    const cacheKey = JSON.stringify(data.collections?.note?.map(n => n.url).sort() || []);
    if (graphCache.has(cacheKey)) {
      return graphCache.get(cacheKey);
    }
    const graph = await getGraph(data);
    graphCache.set(cacheKey, graph);
    return graph;
  },
  filetree: (data) => {
    // Cache filetree để không tính lại cho mỗi page
    const cacheKey = JSON.stringify(data.collections?.note?.map(n => n.url).sort() || []);
    if (filetreeCache.has(cacheKey)) {
      return filetreeCache.get(cacheKey);
    }
    const filetree = getFileTree(data);
    filetreeCache.set(cacheKey, filetree);
    return filetree;
  },
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
  // Post Heatmap - chỉ tính cho index page để tối ưu performance
  postHeatmap: (data) => {
    // Chỉ tính cho homepage/index page
    if (data.tags && data.tags.indexOf("gardenEntry") === -1 && data.url !== "/") {
      return null;
    }
    
    const notes = data.collections.note || [];
    
    // Year view (1 year) - chỉ tính view này cho dev mode để nhanh hơn
    const yearData = generatePostHeatmap(notes);
    const yearWeeks = groupByWeeks(yearData.data);
    
    // Month và Week views chỉ tính trong production
    let monthData = null;
    let monthWeeks = [];
    let weekData = null;
    let weekWeeks = [];
    
    if (process.env.ELEVENTY_ENV === "prod" || process.env.NODE_ENV === "production") {
      monthData = generateMonthHeatmap(notes);
      monthWeeks = groupByWeeks(monthData.data);
      weekData = generateWeekHeatmap(notes);
      weekWeeks = groupByWeeks(weekData.data);
    }
    
    return {
      year: {
        weeks: yearWeeks,
        maxCount: yearData.maxCount,
        totalDays: yearData.totalDays,
        startDate: yearData.startDate,
        endDate: yearData.endDate
      },
      month: monthData ? {
        weeks: monthWeeks,
        maxCount: monthData.maxCount,
        totalDays: monthData.totalDays,
        startDate: monthData.startDate,
        endDate: monthData.endDate
      } : null,
      week: weekData ? {
        weeks: weekWeeks,
        maxCount: weekData.maxCount,
        totalDays: weekData.totalDays,
        startDate: weekData.startDate,
        endDate: weekData.endDate
      } : null,
      // Default view (year) for backward compatibility
      weeks: yearWeeks,
      maxCount: yearData.maxCount,
      totalDays: yearData.totalDays,
      startDate: yearData.startDate,
      endDate: yearData.endDate
    };
  }
};
