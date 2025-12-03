// Pre-compiled regex patterns for better performance
const wikiLinkRegex = /\[\[(.*?\|.*?)\]\]/g;
const internalLinkRegex = /href="\/(.*?)"/g;
const fileExtensionRegex = /\.(md|markdown)\s?$/i;

function extractLinks(content) {
  if (!content) return [];
  
  const wikiLinks = [];
  let match;
  // Use while loop instead of match() for better performance with global regex
  while ((match = wikiLinkRegex.exec(content)) !== null) {
    const link = match[1]
      .split("|")[0]
      .replace(fileExtensionRegex, "")
      .replace(/\\/g, "")
      .trim()
      .split("#")[0];
    if (link) wikiLinks.push(link);
  }
  // Reset regex lastIndex for reuse
  wikiLinkRegex.lastIndex = 0;
  
  const internalLinks = [];
  while ((match = internalLinkRegex.exec(content)) !== null) {
    const link = match[1]
      .split("|")[0]
      .replace(fileExtensionRegex, "")
      .replace(/\\/g, "")
      .trim()
      .split("#")[0];
    if (link) internalLinks.push(link);
  }
  internalLinkRegex.lastIndex = 0;
  
  return [...wikiLinks, ...internalLinks];
}

async function getGraph(data) {
  const nodes = {};
  const links = [];
  const stemURLs = {};
  let homeAlias = "/";
  let nodeIdCounter = 0;

  // Process notes in parallel for better performance
  const notes = data.collections.note || [];
  
  // Pre-process all notes to extract metadata in parallel
  const notePromises = notes.map(async (v) => {
    const fpath = v.filePathStem.replace("/notes/", "");
    const parts = fpath.split("/");
    // Group by folder path - use full folder path for better grouping
    const group = parts.length > 1 
      ? parts.slice(0, -1).join("/")
      : "none";

    // Use async read() method - read in parallel
    // Tối ưu: chỉ đọc content nếu thực sự cần (có links trong frontmatter hoặc data)
    let content = "";
    try {
      // Luôn dùng template.read() để tránh lỗi TemplateContentPrematureUseError
      if (v.template && typeof v.template.read === 'function') {
        const templateContent = await v.template.read();
        content = templateContent?.content || "";
      } else {
        // Fallback: try to get content from data if available
        content = v.content || "";
      }
    } catch (error) {
      // Fallback: try to get content from data if available
      content = v.content || "";
    }

    // Check if home page more efficiently
    const isHome = v.data["dg-home"] || 
      (Array.isArray(v.data.tags) && v.data.tags.includes("gardenEntry"));

    return {
      url: v.url,
      fpath,
      group,
      isHome,
      content,
      title: v.data.title || v.fileSlug,
      noteIcon: v.data.noteIcon || process.env.NOTE_ICON_DEFAULT,
      hide: v.data.hideInGraph || false,
    };
  });
  
  // Wait for all reads to complete in parallel
  const noteResults = await Promise.all(notePromises);
  
  // Process results and assign IDs sequentially
  noteResults.forEach(({ url, fpath, group, isHome, content, title, noteIcon, hide }) => {
    nodes[url] = {
      id: nodeIdCounter++,
      title,
      url,
      group,
      home: isHome,
      outBound: extractLinks(content),
      neighbors: new Set(),
      backLinks: new Set(),
      noteIcon,
      hide,
      isFolder: false,
    };
    stemURLs[fpath] = url;
    if (isHome) {
      homeAlias = url;
    }
  });
  
  // Build folder structure map - optimized
  const folderToNodes = {};
  const nodeToFpath = {};
  const allFolders = new Set(); // Track all folder paths
  
  // Create reverse mapping from URL to file path
  for (const [fpath, url] of Object.entries(stemURLs)) {
    nodeToFpath[url] = fpath;
  }
  
  // Build folder to nodes mapping and collect all folder paths
  for (const node of Object.values(nodes)) {
    const fpath = nodeToFpath[node.url];
    if (fpath) {
      const parts = fpath.split("/");
      if (parts.length > 1) {
        const folderPath = parts.slice(0, -1).join("/");
        if (!folderToNodes[folderPath]) {
          folderToNodes[folderPath] = [];
        }
        folderToNodes[folderPath].push(node.url);
        
        // Collect all folder paths (including parent folders) - optimized
        let currentPath = parts[0];
        allFolders.add(currentPath);
        for (let i = 1; i < parts.length - 1; i++) {
          currentPath = `${currentPath}/${parts[i]}`;
          allFolders.add(currentPath);
        }
      }
    }
  }

  // Create nodes for folders
  const folderNodes = {};
  allFolders.forEach((folderPath) => {
    const folderUrl = `folder:/${folderPath}`;
    const folderParts = folderPath.split("/");
    const folderName = folderParts[folderParts.length - 1];
    
    // Find first file in this folder to use as navigation target
    const filesInFolder = folderToNodes[folderPath] || [];
    const firstFileUrl = filesInFolder.length > 0 ? filesInFolder[0] : null;
    
    folderNodes[folderPath] = folderUrl;
    nodes[folderUrl] = {
      id: nodeIdCounter++,
      title: folderName,
      url: folderUrl,
      group: folderParts.length > 1 ? folderParts.slice(0, -1).join("/") : "none",
      home: false,
      outBound: [],
      neighbors: new Set(),
      backLinks: new Set(),
      noteIcon: process.env.NOTE_ICON_DEFAULT,
      hide: false,
      isFolder: true,
      folderPath: folderPath,
      firstFileUrl: firstFileUrl, // Store first file URL for navigation
    };
  });

  // Link files and folders based on folder structure - optimized
  for (const node of Object.values(nodes)) {
    if (node.isFolder) {
      // Skip folder nodes for now, we'll process them separately
      continue;
    }
    
    const outBound = new Set();
    // Add explicit links from content
    for (const olink of node.outBound) {
      const link = (stemURLs[olink] || olink).split("#")[0];
      if (nodes[link]) {
        outBound.add(link);
      }
    }
    
    // Add links based on folder structure
    const fpath = nodeToFpath[node.url];
    if (fpath) {
      const parts = fpath.split("/");
      if (parts.length > 1) {
        const folderPath = parts.slice(0, -1).join("/");
        
        // 1. Link to siblings in the same folder
        const siblings = folderToNodes[folderPath];
        if (siblings) {
          for (const siblingUrl of siblings) {
            if (siblingUrl !== node.url && nodes[siblingUrl]) {
              outBound.add(siblingUrl);
            }
          }
        }
        
        // 2. Link to parent folder
        const parentFolderUrl = folderNodes[folderPath];
        if (parentFolderUrl) {
          outBound.add(parentFolderUrl);
        }
      }
    }
    
    // Update node and create links
    node.outBound = Array.from(outBound);
    for (const link of node.outBound) {
      const n = nodes[link];
      if (n) {
        n.neighbors.add(node.url);
        n.backLinks.add(node.url);
        node.neighbors.add(n.url);
        links.push({ source: node.id, target: n.id });
      }
    }
  }

  // Link folders: folders at the same level link to each other
  // Optimize by building parent-to-children map first to reduce O(n²) to O(n)
  const parentToChildren = {};
  for (const folderPath of Object.keys(folderNodes)) {
    const folderParts = folderPath.split("/");
    if (folderParts.length > 1) {
      const parentPath = folderParts.slice(0, -1).join("/");
      if (!parentToChildren[parentPath]) {
        parentToChildren[parentPath] = [];
      }
      parentToChildren[parentPath].push(folderPath);
    }
  }
  
  for (const folderPath of Object.keys(folderNodes)) {
    const folderUrl = folderNodes[folderPath];
    const folderNode = nodes[folderUrl];
    if (!folderNode) continue;
    
    const folderParts = folderPath.split("/");
    const parentFolderPath = folderParts.length > 1 
      ? folderParts.slice(0, -1).join("/") 
      : null;
    
    // Link to sibling folders (folders at the same level) - optimized
    if (parentFolderPath && parentToChildren[parentFolderPath]) {
      for (const siblingPath of parentToChildren[parentFolderPath]) {
        if (siblingPath !== folderPath) {
          const siblingUrl = folderNodes[siblingPath];
          const siblingNode = nodes[siblingUrl];
          if (siblingNode && !folderNode.neighbors.has(siblingUrl)) {
            folderNode.neighbors.add(siblingUrl);
            siblingNode.neighbors.add(folderUrl);
            links.push({ source: folderNode.id, target: siblingNode.id });
          }
        }
      }
    }
    
    // Link to parent folder
    if (parentFolderPath && folderNodes[parentFolderPath]) {
      const parentFolderUrl = folderNodes[parentFolderPath];
      const parentNode = nodes[parentFolderUrl];
      if (parentNode && !folderNode.neighbors.has(parentFolderUrl)) {
        folderNode.neighbors.add(parentFolderUrl);
        parentNode.neighbors.add(folderUrl);
        links.push({ source: folderNode.id, target: parentNode.id });
      }
    }
  }

  // Finalize neighbors and backLinks - optimized
  for (const node of Object.values(nodes)) {
    node.neighbors = Array.from(node.neighbors);
    node.backLinks = Array.from(node.backLinks);
    node.size = node.neighbors.length;
  }
  
  return {
    homeAlias,
    nodes,
    links,
  };
}

exports.wikiLinkRegex = wikiLinkRegex;
exports.internalLinkRegex = internalLinkRegex;
exports.extractLinks = extractLinks;
exports.getGraph = getGraph;
