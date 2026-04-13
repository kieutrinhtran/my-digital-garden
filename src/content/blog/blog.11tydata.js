// Blog content configuration - Optimized for Obsidian workflow
// Copy .md files from Obsidian directly here
require("dotenv").config();
const settings = require("../../helpers/constants");

const allSettings = settings.ALL_NOTE_SETTINGS;

module.exports = {
  tags: ["blog", "note"],
  eleventyComputed: {
    layout: (data) => {
      // Projects use project layout
      if (data.layout === "project" || 
          (data.tags && (data.tags.includes("project") || data.tags.includes("portfolio")))) {
        return "layouts/project.njk";
      }
      return "layouts/note.njk";
    },
    permalink: (data) => {
      // Auto-generate permalink from filename if not provided
      if (data.permalink) {
        return data.permalink;
      }
      // Generate from title or filename
      const slug = require("@sindresorhus/slugify");
      const title = data.title || data.page?.fileSlug || "";
      return `/blog/${slug(title)}/`;
    },
    // Auto-extract và validate frontmatter
    title: (data) => {
      return data.title || data.page?.fileSlug || "Untitled";
    },
    date: (data) => {
      // Support multiple date formats from Obsidian
      if (data.date) {
        return new Date(data.date);
      }
      if (data.created) {
        return new Date(data.created);
      }
      if (data["file-ctime"]) {
        return new Date(data["file-ctime"]);
      }
      // Default to file creation time
      return data.page?.fileCreatedTime || new Date();
    },
    updated: (data) => {
      if (data.updated) {
        return new Date(data.updated);
      }
      if (data.modified) {
        return new Date(data.modified);
      }
      if (data["file-mtime"]) {
        return new Date(data["file-mtime"]);
      }
      return data.page?.fileModifiedTime || new Date();
    },
    tags: (data) => {
      // Ensure tags is always an array
      if (Array.isArray(data.tags)) {
        return data.tags;
      }
      if (typeof data.tags === 'string') {
        return data.tags.split(',').map(t => t.trim()).filter(t => t);
      }
      return data.tags ? [data.tags] : ["blog"];
    },
    description: (data) => {
      // Auto-generate description from content if not provided
      if (data.description) {
        return data.description;
      }
      if (data.excerpt) {
        return data.excerpt;
      }
      // Will be generated from content in template
      return null;
    },
    image: (data) => {
      // Support multiple image field names
      return data.image || data.thumbnail || data.cover || null;
    },
    settings: (data) => {
      const noteSettings = {};
      allSettings.forEach((setting) => {
        let noteSetting = data[setting];
        let globalSetting = process.env[setting];

        let settingValue =
          noteSetting || (globalSetting === "true" && noteSetting !== false);
        noteSettings[setting] = settingValue;
      });
      return noteSettings;
    },
  },
};
