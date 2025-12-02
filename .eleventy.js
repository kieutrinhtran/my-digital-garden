const slugify = require("@sindresorhus/slugify");
const markdownIt = require("markdown-it");
const fs = require("fs");
const matter = require("gray-matter");
// const faviconsPlugin = require("eleventy-plugin-gen-favicons"); // Disabled to avoid Windows file locking issues
const tocPlugin = require("eleventy-plugin-nesting-toc");
const { parse } = require("node-html-parser");
const htmlMinifier = require("html-minifier-terser");
const pluginRss = require("@11ty/eleventy-plugin-rss");

const { headerToId, namedHeadingsFilter } = require("./src/helpers/utils");
const {
  userMarkdownSetup,
  userEleventySetup,
} = require("./src/helpers/userSetup");

const Image = require("@11ty/eleventy-img");

// Image transformation cache to avoid reprocessing same images
const imageCache = new Map();

function transformImage(src, cls, alt, sizes, widths = ["500", "700", "auto"]) {
  // Check cache first
  const cacheKey = `${src}-${widths.join(",")}`;
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey);
  }

  const options = {
    widths: widths,
    formats: ["webp", "jpeg"],
    outputDir: "./dist/img/optimized",
    urlPath: "/img/optimized",
    // Cache images to improve performance
    cacheOptions: {
      duration: "30d",
      directory: ".cache",
      removeUrlQueryParams: false,
    },
  };

  try {
    // Use sync method for build-time optimization
    const metadata = Image.statsSync(src, options);
    imageCache.set(cacheKey, metadata);
    return metadata;
  } catch (error) {
    // Return null on error to prevent build failures
    console.warn(`Image transformation failed for ${src}:`, error.message);
    return null;
  }
}

function getAnchorLink(filePath, linkTitle) {
  const {attributes, innerHTML} = getAnchorAttributes(filePath, linkTitle);
  const attrsString = Object.entries(attributes)
    .map(([key, value]) => `${key}="${String(value).replace(/"/g, '&quot;')}"`)
    .join(" ");
  return `<a ${attrsString}>${innerHTML}</a>`;
}

// Cache for file metadata to avoid repeated file reads
const fileMetadataCache = new Map();

function getAnchorAttributes(filePath, linkTitle) {
  const cleanPath = filePath.replaceAll("&amp;", "&");
  let fileName = cleanPath;
  let header = "";
  let headerLinkPath = "";
  if (cleanPath.includes("#")) {
    const parts = cleanPath.split("#");
    fileName = parts[0];
    header = parts.slice(1).join("#");
    headerLinkPath = `#${headerToId(header)}`;
  }

  let noteIcon = process.env.NOTE_ICON_DEFAULT;
  const title = linkTitle || fileName;
  let permalink = `/notes/${slugify(filePath)}`;
  let deadLink = false;
  
  // Check cache first
  if (fileMetadataCache.has(fileName)) {
    const cached = fileMetadataCache.get(fileName);
    if (cached.deadLink) {
      deadLink = true;
    } else {
      permalink = cached.permalink;
      noteIcon = cached.noteIcon;
    }
  } else {
    try {
      const startPath = "./src/site/notes/";
      const fullPath = fileName.endsWith(".md")
        ? `${startPath}${fileName}`
        : `${startPath}${fileName}.md`;
      const file = fs.readFileSync(fullPath, "utf8");
      const frontMatter = matter(file);
      if (frontMatter.data.permalink) {
        permalink = frontMatter.data.permalink;
      }
      if (
        frontMatter.data.tags &&
        Array.isArray(frontMatter.data.tags) &&
        frontMatter.data.tags.indexOf("gardenEntry") !== -1
      ) {
        permalink = "/";
      }
      if (frontMatter.data.noteIcon) {
        noteIcon = frontMatter.data.noteIcon;
      }
      // Cache the result
      fileMetadataCache.set(fileName, { permalink, noteIcon, deadLink: false });
    } catch {
      deadLink = true;
      fileMetadataCache.set(fileName, { permalink, noteIcon, deadLink: true });
    }
  }

  if (deadLink) {
    return {
      attributes: {
        "class": "internal-link is-unresolved",
        "href": "/404",
        "target": "",
      },
      innerHTML: title,
    }
  }
  return {
    attributes: {
      "class": "internal-link",
      "target": "",
      "data-note-icon": noteIcon,
      "href": `${permalink}${headerLinkPath}`,
    },
    innerHTML: title,
  }
}

// Pre-compiled regex patterns for better performance
const tagRegex = /(^|\s|\>)(#[^\s!@#$%^&*()=+\.,\[{\]};:'"?><]+)(?!([^<]*>))/g;
const wikiLinkRegex = /\[\[(.*?\|.*?)\]\]/g;
const dataviewRegex = /\(\S+\:\:(.*)\)/g;

module.exports = function (eleventyConfig) {
  eleventyConfig.setLiquidOptions({
    dynamicPartials: true,
  });
  let markdownLib = markdownIt({
    breaks: true,
    html: true,
    linkify: true,
  })
    .use(require("markdown-it-anchor"), {
      slugify: headerToId,
    })
    .use(require("markdown-it-mark"))
    .use(require("markdown-it-footnote"))
    .use(function (md) {
      md.renderer.rules.hashtag_open = function (tokens, idx) {
        return '<a class="tag" onclick="toggleTagSearch(this)">';
      };
    })
    .use(require("markdown-it-mathjax3"), {
      tex: {
        inlineMath: [["$", "$"]],
      },
      options: {
        skipHtmlTags: { "[-]": ["pre"] },
      },
    })
    .use(require("markdown-it-attrs"))
    .use(require("markdown-it-task-checkbox"), {
      disabled: true,
      divWrap: false,
      divClass: "checkbox",
      idPrefix: "cbx_",
      ulClass: "task-list",
      liClass: "task-list-item",
    })
    .use(require("markdown-it-plantuml"), {
      openMarker: "```plantuml",
      closeMarker: "```",
    })
    .use(namedHeadingsFilter)
    .use(function (md) {
      //https://github.com/DCsunset/markdown-it-mermaid-plugin
      const origFenceRule =
        md.renderer.rules.fence ||
        function (tokens, idx, options, env, self) {
          return self.renderToken(tokens, idx, options, env, self);
        };
      md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
        const token = tokens[idx];
        if (token.info === "mermaid") {
          const code = token.content.trim();
          return `<pre class="mermaid">${code}</pre>`;
        }
        if (token.info === "transclusion") {
          const code = token.content.trim();
          return `<div class="transclusion">${md.render(code)}</div>`;
        }
        if (token.info.startsWith("ad-")) {
          const code = token.content.trim();
          const parts = code.split("\n")
          let titleLine;
          let collapse;
          let collapsible = false
          let collapsed = true
          let icon;
          let color;
          let nbLinesToSkip = 0
          for (let i = 0; i < 4; i++) {
            if (parts[i] && parts[i].trim()) {
              let line = parts[i] && parts[i].trim().toLowerCase()
              if (line.startsWith("title:")) {
                titleLine = line.substring(6);
                nbLinesToSkip++;
              } else if (line.startsWith("icon:")) {
                icon = line.substring(5);
                nbLinesToSkip++;
              } else if (line.startsWith("collapse:")) {
                collapsible = true
                collapse = line.substring(9);
                if (collapse && collapse.trim().toLowerCase() == 'open') {
                  collapsed = false
                }
                nbLinesToSkip++;
              } else if (line.startsWith("color:")) {
                color = line.substring(6);
                nbLinesToSkip++;
              }
            }
          }
          const foldDiv = collapsible ? `<div class="callout-fold">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-chevron-down">
              <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
          </div>` : "";
          const titleDiv = titleLine
            ? `<div class="callout-title"><div class="callout-title-inner">${titleLine}</div>${foldDiv}</div>`
            : "";
          let collapseClasses = titleLine && collapsible ? 'is-collapsible' : ''
          if (collapsible && collapsed) {
            collapseClasses += " is-collapsed"
          }

          let res = `<div data-callout-metadata class="callout ${collapseClasses}" data-callout="${token.info.substring(3)
            }">${titleDiv}\n<div class="callout-content">${md.render(
              parts.slice(nbLinesToSkip).join("\n")
            )}</div></div>`;
          return res
        }

        // Other languages
        return origFenceRule(tokens, idx, options, env, slf);
      };

      const defaultImageRule =
        md.renderer.rules.image ||
        function (tokens, idx, options, env, self) {
          return self.renderToken(tokens, idx, options, env, self);
        };
      md.renderer.rules.image = (tokens, idx, options, env, self) => {
        const imageName = tokens[idx].content;
        //"image.png|metadata?|width"
        const [fileName, ...widthAndMetaData] = imageName.split("|");
        const lastValue = widthAndMetaData[widthAndMetaData.length - 1];
        const lastValueIsNumber = !isNaN(lastValue);
        const width = lastValueIsNumber ? lastValue : null;

        let metaData = "";
        if (widthAndMetaData.length > 1) {
          metaData = widthAndMetaData.slice(0, widthAndMetaData.length - 1).join(" ");
        }

        if (!lastValueIsNumber) {
          metaData += ` ${lastValue}`;
        }

        if (width) {
          const widthIndex = tokens[idx].attrIndex("width");
          const widthAttr = `${width}px`;
          if (widthIndex < 0) {
            tokens[idx].attrPush(["width", widthAttr]);
          } else {
            tokens[idx].attrs[widthIndex][1] = widthAttr;
          }
        }

        return defaultImageRule(tokens, idx, options, env, self);
      };

      const defaultLinkRule =
        md.renderer.rules.link_open ||
        function (tokens, idx, options, env, self) {
          return self.renderToken(tokens, idx, options, env, self);
        };
      md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
        const aIndex = tokens[idx].attrIndex("target");
        const classIndex = tokens[idx].attrIndex("class");

        if (aIndex < 0) {
          tokens[idx].attrPush(["target", "_blank"]);
        } else {
          tokens[idx].attrs[aIndex][1] = "_blank";
        }

        if (classIndex < 0) {
          tokens[idx].attrPush(["class", "external-link"]);
        } else {
          tokens[idx].attrs[classIndex][1] = "external-link";
        }

        return defaultLinkRule(tokens, idx, options, env, self);
      };
    })
    .use(userMarkdownSetup);

  eleventyConfig.setLibrary("md", markdownLib);

  eleventyConfig.addFilter("isoDate", function (date) {
    return date && date.toISOString();
  });

  eleventyConfig.addFilter("link", function (str) {
    if (!str) return str;
    return str.replace(wikiLinkRegex, function (match, p1) {
      //Check if it is an embedded excalidraw drawing or mathjax javascript
      if (p1.indexOf("],[") > -1 || p1.indexOf('"$"') > -1) {
        return match;
      }
      const [fileLink, linkTitle] = p1.split("|");
      return getAnchorLink(fileLink, linkTitle);
    });
  });

  eleventyConfig.addFilter("taggify", function (str) {
    return (
      str &&
      str.replace(tagRegex, function (match, precede, tag) {
        return `${precede}<a class="tag" onclick="toggleTagSearch(this)" data-content="${tag}">${tag}</a>`;
      })
    );
  });

  eleventyConfig.addFilter("searchableTags", function (str) {
    let tags;
    let match = str && str.match(tagRegex);
    if (match) {
      tags = match
        .map((m) => {
          return `"${m.split("#")[1]}"`;
        })
        .join(", ");
    }
    if (tags) {
      return `${tags},`;
    } else {
      return "";
    }
  });

  eleventyConfig.addFilter("hideDataview", function (str) {
    if (!str) return str;
    return str.replace(dataviewRegex, function (_, value) {
      return value.trim();
    });
  });

  eleventyConfig.addTransform("dataview-js-links", function (str) {
    const parsed = parse(str);
    for (const dataViewJsLink of parsed.querySelectorAll("a[data-href].internal-link")) {
      const notePath = dataViewJsLink.getAttribute("data-href");
      const title = dataViewJsLink.innerHTML;
      const {attributes, innerHTML} = getAnchorAttributes(notePath, title);
      for (const key in attributes) {
        dataViewJsLink.setAttribute(key, attributes[key]);
      }
      dataViewJsLink.innerHTML = innerHTML;
    }

    return str && parsed.innerHTML;
  });

  eleventyConfig.addTransform("callout-block", function (str) {
    const parsed = parse(str);

    const transformCalloutBlocks = (
      blockquotes = parsed.querySelectorAll("blockquote")
    ) => {
      for (const blockquote of blockquotes) {
        transformCalloutBlocks(blockquote.querySelectorAll("blockquote"));

        let content = blockquote.innerHTML;

        let titleDiv = "";
        let calloutType = "";
        let calloutMetaData = "";
        let isCollapsable;
        let isCollapsed;
        const calloutMeta = /\[!([\w-]*)\|?(\s?.*)\](\+|\-){0,1}(\s?.*)/;
        if (!content.match(calloutMeta)) {
          continue;
        }

        content = content.replace(
          calloutMeta,
          function (metaInfoMatch, callout, metaData, collapse, title) {
            isCollapsable = Boolean(collapse);
            isCollapsed = collapse === "-";
            const titleText = title.replace(/(<\/{0,1}\w+>)/, "")
              ? title
              : `${callout.charAt(0).toUpperCase()}${callout
                .substring(1)
                .toLowerCase()}`;
            const fold = isCollapsable
              ? `<div class="callout-fold"><i icon-name="chevron-down"></i></div>`
              : ``;

            calloutType = callout;
            calloutMetaData = metaData;
            titleDiv = `<div class="callout-title"><div class="callout-title-inner">${titleText}</div>${fold}</div>`;
            return "";
          }
        );

        /* Hacky fix for callouts with only a title:
        This will ensure callout-content isn't produced if
        the callout only has a title, like this:
        ```md
        > [!info] i only have a title
        ```
        Not sure why content has a random <p> tag in it,
        */
        if (content === "\n<p>\n") {
          content = "";
        }
        let contentDiv = content ? `\n<div class="callout-content">${content}</div>` : "";

        blockquote.tagName = "div";
        blockquote.classList.add("callout");
        blockquote.classList.add(isCollapsable ? "is-collapsible" : "");
        blockquote.classList.add(isCollapsed ? "is-collapsed" : "");
        blockquote.setAttribute("data-callout", calloutType.toLowerCase());
        calloutMetaData && blockquote.setAttribute("data-callout-metadata", calloutMetaData);
        blockquote.innerHTML = `${titleDiv}${contentDiv}`;
      }
    };

    transformCalloutBlocks();

    return str && parsed.innerHTML;
  });

  function fillPictureSourceSets(src, cls, alt, meta, width, imageTag) {
    imageTag.tagName = "picture";
    let html = `<source
      media="(max-width:480px)"
      srcset="${meta.webp[0].url}"
      type="image/webp"
      />
      <source
      media="(max-width:480px)"
      srcset="${meta.jpeg[0].url}"
      />
      `
    if (meta.webp && meta.webp[1] && meta.webp[1].url) {
      html += `<source
        media="(max-width:1920px)"
        srcset="${meta.webp[1].url}"
        type="image/webp"
        />`
    }
    if (meta.jpeg && meta.jpeg[1] && meta.jpeg[1].url) {
      html += `<source
        media="(max-width:1920px)"
        srcset="${meta.jpeg[1].url}"
        />`
    }
    html += `<img
      class="${cls.toString()}"
      src="${src}"
      alt="${alt}"
      width="${width}"
      />`;
    imageTag.innerHTML = html;
  }


  eleventyConfig.addTransform("picture", function (str) {
    if(process.env.USE_FULL_RESOLUTION_IMAGES === "true"){
      return str;
    }
    if (!str) return str;
    
    const parsed = parse(str);
    const images = parsed.querySelectorAll(".cm-s-obsidian img");
    
    for (const imageTag of images) {
      const src = imageTag.getAttribute("src");
      if (src && src.startsWith("/") && !src.endsWith(".svg")) {
        const cls = imageTag.classList.value;
        const alt = imageTag.getAttribute("alt") || "";
        const width = imageTag.getAttribute("width") || '';

        const meta = transformImage(
          "./src/site" + decodeURI(src),
          cls.toString(),
          alt,
          ["(max-width: 480px)", "(max-width: 1024px)"]
        );

        if (meta) {
          fillPictureSourceSets(src, cls, alt, meta, width, imageTag);
        }
      }
    }
    return parsed.innerHTML;
  });

  eleventyConfig.addTransform("table", function (str) {
    const parsed = parse(str);
    for (const t of parsed.querySelectorAll(".cm-s-obsidian > table")) {
      let inner = t.innerHTML;
      t.tagName = "div";
      t.classList.add("table-wrapper");
      t.innerHTML = `<table>${inner}</table>`;
    }

    for (const t of parsed.querySelectorAll(
      ".cm-s-obsidian > .block-language-dataview > table"
    )) {
      t.classList.add("dataview");
      t.classList.add("table-view-table");
      t.querySelector("thead")?.classList.add("table-view-thead");
      t.querySelector("tbody")?.classList.add("table-view-tbody");
      t.querySelectorAll("thead > tr")?.forEach((tr) => {
        tr.classList.add("table-view-tr-header");
      });
      t.querySelectorAll("thead > tr > th")?.forEach((th) => {
        th.classList.add("table-view-th");
      });
    }
    return str && parsed.innerHTML;
  });

  eleventyConfig.addTransform("htmlMinifier", (content, outputPath) => {
    if (
      (process.env.NODE_ENV === "production" || process.env.ELEVENTY_ENV === "prod") &&
      outputPath &&
      outputPath.endsWith(".html")
    ) {
      try {
        return htmlMinifier.minify(content, {
          useShortDoctype: true,
          removeComments: true,
          collapseWhitespace: true,
          conservativeCollapse: true,
          preserveLineBreaks: false, // Changed to false for better compression
          minifyCSS: true,
          minifyJS: true,
          keepClosingSlash: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          removeEmptyAttributes: true,
        });
      } catch (error) {
        console.warn(`HTML minification failed for ${outputPath}:`, error.message);
        return content;
      }
    }
    return content;
  });

  eleventyConfig.addPassthroughCopy("src/site/img");
  eleventyConfig.addPassthroughCopy("src/site/scripts");
  eleventyConfig.addPassthroughCopy("src/site/styles/_theme.*.css");
  // Passthrough copy favicon.svg and other favicon files
  // Disabled favicons plugin to avoid Windows file locking issues (EBUSY error)
  // Favicons are handled via static links in pageheader.njk
  eleventyConfig.addPassthroughCopy("src/site/favicon.svg");
  
  // Note: Favicons plugin disabled due to Windows file locking issues
  // Favicon files should be manually generated and placed in dist/ folder
  // or use static links as configured in pageheader.njk
  eleventyConfig.addPlugin(tocPlugin, {
    ul: true,
    tags: ["h1", "h2", "h3", "h4", "h5", "h6"],
  });


  eleventyConfig.addFilter("dateToZulu", function (date) {
    try {
      return new Date(date).toISOString();
    } catch {
      return "";
    }
  });
  
  eleventyConfig.addFilter("jsonify", function (variable) {
    return JSON.stringify(variable) || '""';
  });

  eleventyConfig.addFilter("validJson", function (variable) {
    if (Array.isArray(variable)) {
      return variable.map((x) => x.replaceAll("\\", "\\\\")).join(",");
    } else if (typeof variable === "string") {
      return variable.replaceAll("\\", "\\\\");
    }
    return variable;
  });
  
  // Filter để lọc notes theo tag
  eleventyConfig.addFilter("filterByTag", function(notes, tag) {
    if (!Array.isArray(notes) || !tag) return [];
    return notes.filter(note => {
      const tags = note.data?.tags || [];
      return Array.isArray(tags) && tags.includes(tag);
    });
  });
  
  // Filter để tạo range
  eleventyConfig.addFilter("range", function(start, end) {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  });

  eleventyConfig.addPlugin(pluginRss, {
    posthtmlRenderOptions: {
      closingSingleTag: "slash",
      singleTags: ["link"],
    },
  });

  userEleventySetup(eleventyConfig);

  // Filter note collection to only include published notes
  eleventyConfig.addCollection("note", function(collectionApi) {
    return collectionApi.getFilteredByTag("note").filter(function(item) {
      // Include if dg-publish is true or not set (default to published)
      // Also check for dgPublish (camelCase) for compatibility
      const dgPublish = item.data["dg-publish"] !== undefined 
        ? item.data["dg-publish"] 
        : item.data.dgPublish;
      return dgPublish !== false;
    });
  });
  
  // Collection tất cả tags từ notes
  eleventyConfig.addCollection("allTags", function(collectionApi) {
    const notes = collectionApi.getFilteredByTag("note");
    const allTags = new Set();
    
    notes.forEach(note => {
      const tags = note.data?.tags || [];
      if (Array.isArray(tags)) {
        tags.forEach(tag => {
          // Loại bỏ các tag hệ thống
          if (tag !== "note" && tag !== "gardenEntry") {
            allTags.add(tag);
          }
        });
      }
    });
    
    return Array.from(allTags).sort();
  });
  
  // Filter để lấy length của array
  eleventyConfig.addFilter("length", function(array) {
    if (Array.isArray(array)) {
      return array.length;
    }
    return 0;
  });

  return {
    dir: {
      input: "src/site",
      output: "dist",
      data: `_data`,
    },
    templateFormats: ["njk", "md", "11ty.js"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: false,
    passthroughFileCopy: true,
  };
};
