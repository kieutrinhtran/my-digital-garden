// Frontmatter Utilities - Optimized for Obsidian workflow
const matter = require("gray-matter");
const fs = require("fs");

/**
 * Extract và normalize frontmatter từ Obsidian markdown files
 * Hỗ trợ cả YAML và JSON format
 */
function extractFrontmatter(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const parsed = matter(fileContent);
    
    // Normalize frontmatter
    const frontmatter = parsed.data || {};
    
    // Auto-extract title từ filename nếu không có
    if (!frontmatter.title && parsed.data.title === undefined) {
      const fileName = filePath.split(/[/\\]/).pop().replace(/\.md$/, "");
      frontmatter.title = fileName;
    }
    
    // Normalize date formats
    if (frontmatter.date) {
      frontmatter.date = new Date(frontmatter.date);
    } else if (frontmatter.created) {
      frontmatter.date = new Date(frontmatter.created);
    } else if (frontmatter["file-ctime"]) {
      frontmatter.date = new Date(frontmatter["file-ctime"]);
    }
    
    // Normalize tags - ensure array
    if (frontmatter.tags) {
      if (typeof frontmatter.tags === 'string') {
        frontmatter.tags = frontmatter.tags.split(',').map(t => t.trim()).filter(t => t);
      } else if (!Array.isArray(frontmatter.tags)) {
        frontmatter.tags = [frontmatter.tags];
      }
    } else {
      frontmatter.tags = [];
    }
    
    // Auto-detect project từ tags
    if (frontmatter.tags.includes('project') || frontmatter.tags.includes('portfolio')) {
      frontmatter.layout = 'project';
    }
    
    // Normalize image paths
    if (frontmatter.image) {
      // Convert Obsidian attachment paths to web paths
      frontmatter.image = normalizeImagePath(frontmatter.image);
    }
    if (frontmatter.thumbnail) {
      frontmatter.thumbnail = normalizeImagePath(frontmatter.thumbnail);
    }
    if (frontmatter.cover) {
      frontmatter.cover = normalizeImagePath(frontmatter.cover);
      if (!frontmatter.image) {
        frontmatter.image = frontmatter.cover;
      }
    }
    
    // Extract description từ content nếu không có
    if (!frontmatter.description && !frontmatter.excerpt) {
      const content = parsed.content || '';
      const firstParagraph = content.split('\n\n').find(p => p.trim().length > 20);
      if (firstParagraph) {
        frontmatter.description = firstParagraph.replace(/[#*\[\]()]/g, '').trim().substring(0, 160);
      }
    }
    
    return {
      frontmatter,
      content: parsed.content
    };
  } catch (error) {
    console.warn(`Error extracting frontmatter from ${filePath}:`, error.message);
    return {
      frontmatter: {},
      content: ''
    };
  }
}

/**
 * Normalize image paths từ Obsidian format
 * Obsidian: ![[image.png]] hoặc attachments/image.png
 * Web: /img/image.png
 */
function normalizeImagePath(imagePath) {
  if (!imagePath) return null;
  
  // Remove Obsidian link syntax
  imagePath = imagePath.replace(/^!\[\[/, '').replace(/\]\]$/, '');
  
  // Convert attachments/ to img/
  if (imagePath.startsWith('attachments/')) {
    imagePath = imagePath.replace('attachments/', 'img/');
  }
  
  // Ensure starts with /
  if (!imagePath.startsWith('/') && !imagePath.startsWith('http')) {
    imagePath = '/img/' + imagePath;
  }
  
  return imagePath;
}

/**
 * Validate frontmatter fields
 */
function validateFrontmatter(frontmatter) {
  const errors = [];
  const warnings = [];
  
  // Required fields
  if (!frontmatter.title) {
    warnings.push('Missing title - will use filename');
  }
  
  // Date validation
  if (frontmatter.date && isNaN(new Date(frontmatter.date).getTime())) {
    errors.push('Invalid date format');
  }
  
  // Tags validation
  if (frontmatter.tags && !Array.isArray(frontmatter.tags)) {
    warnings.push('Tags should be an array');
  }
  
  // Image validation
  if (frontmatter.image && !frontmatter.image.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i)) {
    warnings.push('Image path may be incorrect');
  }
  
  return { errors, warnings };
}

module.exports = {
  extractFrontmatter,
  normalizeImagePath,
  validateFrontmatter
};
