// Helper functions để tìm next/previous note trong cùng folder
const { getFileTree } = require("./filetreeUtils");

/**
 * Flatten filetree thành mảng các notes theo thứ tự
 * @param {Object} tree - Filetree object
 * @param {Array} path - Current path trong tree
 * @returns {Array} Array of notes với {permalink, name, folderPath}
 */
function flattenNotes(tree, path = []) {
  const notes = [];
  
  for (const [key, value] of Object.entries(tree)) {
    if (value.isNote && !value.hide) {
      notes.push({
        permalink: value.permalink,
        name: value.name,
        folderPath: path.join("/"),
      });
    } else if (value.isFolder) {
      // Recursively get notes from subfolders
      const subNotes = flattenNotes(value, [...path, key]);
      notes.push(...subNotes);
    }
  }
  
  return notes;
}

/**
 * Tìm folder path của note hiện tại
 * @param {Object} tree - Filetree object
 * @param {String} currentPermalink - Permalink của note hiện tại
 * @param {Array} path - Current path trong tree
 * @returns {String|null} Folder path hoặc null
 */
function findNoteFolder(tree, currentPermalink, path = []) {
  for (const [key, value] of Object.entries(tree)) {
    if (value.isNote && value.permalink === currentPermalink) {
      return path.join("/");
    } else if (value.isFolder) {
      const folderPath = findNoteFolder(value, currentPermalink, [...path, key]);
      if (folderPath !== null) {
        return folderPath;
      }
    }
  }
  return null;
}

/**
 * Lấy tất cả notes trong cùng folder với note hiện tại
 * @param {Object} tree - Filetree object
 * @param {String} currentPermalink - Permalink của note hiện tại
 * @returns {Array} Array of notes trong cùng folder
 */
function getNotesInSameFolder(tree, currentPermalink) {
  const folderPath = findNoteFolder(tree, currentPermalink);
  
  if (!folderPath) {
    // Note không có trong folder, tìm trong root
    return flattenNotes(tree, []);
  }
  
  // Navigate to folder
  const pathParts = folderPath.split("/").filter(p => p);
  let currentTree = tree;
  
  for (const part of pathParts) {
    if (currentTree[part] && currentTree[part].isFolder) {
      currentTree = currentTree[part];
    } else {
      return [];
    }
  }
  
  // Get all notes in this folder (không recursive, chỉ notes trực tiếp trong folder)
  const notes = [];
  for (const [key, value] of Object.entries(currentTree)) {
    if (value.isNote && !value.hide) {
      notes.push({
        permalink: value.permalink,
        name: value.name,
        folderPath: folderPath,
      });
    }
  }
  
  return notes;
}

/**
 * Tìm next và previous note trong cùng folder
 * @param {Object} data - Eleventy data object
 * @returns {Object} {next: {permalink, name}, previous: {permalink, name}}
 */
function getNextPreviousNotes(data) {
  const filetree = data.filetree;
  const currentPermalink = data.permalink;
  
  if (!filetree || !currentPermalink) {
    return { next: null, previous: null };
  }
  
  // Get all notes in same folder
  const notesInFolder = getNotesInSameFolder(filetree, currentPermalink);
  
  if (notesInFolder.length <= 1) {
    return { next: null, previous: null };
  }
  
  // Find current note index
  const currentIndex = notesInFolder.findIndex(note => note.permalink === currentPermalink);
  
  if (currentIndex === -1) {
    return { next: null, previous: null };
  }
  
  const next = currentIndex < notesInFolder.length - 1 
    ? notesInFolder[currentIndex + 1] 
    : null;
  
  const previous = currentIndex > 0 
    ? notesInFolder[currentIndex - 1] 
    : null;
  
  return { next, previous };
}

module.exports = {
  getNextPreviousNotes,
  getNotesInSameFolder,
  flattenNotes,
};

