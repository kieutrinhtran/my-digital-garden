// Helper để tìm related posts dựa trên tags, folder, và graph connections
const { getFileTree } = require("./filetreeUtils");

/**
 * Tìm related posts dựa trên nhiều tiêu chí
 * @param {Object} data - Eleventy data object
 * @param {Number} limit - Số lượng posts muốn lấy
 * @returns {Array} Array of related posts
 */
function getRelatedPosts(data, limit = 5) {
  const currentNote = data;
  const allNotes = data.collections.note || [];
  const graph = data.graph || {};
  const filetree = data.filetree || {};
  
  if (!currentNote.permalink || allNotes.length === 0) {
    return [];
  }
  
  const currentUrl = currentNote.permalink;
  const currentTags = currentNote.tags || [];
  const currentGraphNode = graph.nodes && graph.nodes[currentUrl];
  
  // Tính điểm cho mỗi note
  const scoredNotes = allNotes
    .filter(note => {
      // Loại bỏ note hiện tại và homepage
      if (note.data.permalink === currentUrl) return false;
      if (note.data.tags && note.data.tags.includes("gardenEntry")) return false;
      if (note.data["dg-publish"] === false) return false;
      return true;
    })
    .map(note => {
      let score = 0;
      const noteUrl = note.data.permalink || note.url;
      const noteTags = note.data.tags || [];
      const noteGraphNode = graph.nodes && graph.nodes[noteUrl];
      
      // 1. Điểm từ tags chung (weight: 3)
      const commonTags = currentTags.filter(tag => 
        tag !== "note" && tag !== "gardenEntry" && noteTags.includes(tag)
      );
      score += commonTags.length * 3;
      
      // 2. Điểm từ graph connections (weight: 5)
      if (currentGraphNode && noteGraphNode) {
        // Direct links
        if (currentGraphNode.outBound && currentGraphNode.outBound.includes(noteUrl)) {
          score += 5;
        }
        if (currentGraphNode.backLinks && currentGraphNode.backLinks.has(noteUrl)) {
          score += 5;
        }
        // Shared neighbors
        if (currentGraphNode.neighbors && noteGraphNode.neighbors) {
          const sharedNeighbors = [...currentGraphNode.neighbors].filter(n => 
            noteGraphNode.neighbors.has(n)
          );
          score += sharedNeighbors.length * 2;
        }
      }
      
      // 3. Điểm từ cùng folder (weight: 2)
      const currentFolder = getNoteFolder(filetree, currentUrl);
      const noteFolder = getNoteFolder(filetree, noteUrl);
      if (currentFolder && noteFolder && currentFolder === noteFolder) {
        score += 2;
      }
      
      return {
        note,
        score,
        url: noteUrl,
        title: note.data.title || note.fileSlug,
        date: note.date,
        tags: noteTags
      };
    })
    .filter(item => item.score > 0) // Chỉ lấy những note có điểm
    .sort((a, b) => {
      // Sort by score (desc), then by date (desc)
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return new Date(b.date) - new Date(a.date);
    })
    .slice(0, limit)
    .map(item => ({
      url: item.url,
      title: item.title,
      date: item.date,
      tags: item.tags
    }));
  
  return scoredNotes;
}

/**
 * Tìm folder path của note
 */
function getNoteFolder(filetree, permalink, path = []) {
  for (const [key, value] of Object.entries(filetree)) {
    if (value.isNote && value.permalink === permalink) {
      return path.join("/");
    } else if (value.isFolder) {
      const folderPath = getNoteFolder(value, permalink, [...path, key]);
      if (folderPath !== null) {
        return folderPath;
      }
    }
  }
  return null;
}

module.exports = {
  getRelatedPosts
};

