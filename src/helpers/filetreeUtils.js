// Pre-compiled regex for number extraction
const numberRegex = /^\d+(\.\d+)?/;
const mdExtensionRegex = /\.md/;

const sortTree = (unsorted) => {
  // Sort by folder before file, then by name - optimized
  const keys = Object.keys(unsorted);
  const sortedKeys = keys.sort((a, b) => {
    // 1. Pinned items first
    const aPinned = unsorted[a].pinned || false;
    const bPinned = unsorted[b].pinned || false;
    if (aPinned !== bPinned) {
      return aPinned ? -1 : 1;
    }

    // 2. Folders before files
    const aIsNote = mdExtensionRegex.test(a);
    const bIsNote = mdExtensionRegex.test(b);
    if (aIsNote !== bIsNote) {
      return aIsNote ? 1 : -1;
    }

    // 3. Numeric prefix sorting
    const aMatch = a.match(numberRegex);
    const bMatch = b.match(numberRegex);
    const aNum = aMatch ? parseFloat(aMatch[0]) : NaN;
    const bNum = bMatch ? parseFloat(bMatch[0]) : NaN;

    if (!isNaN(aNum) && !isNaN(bNum) && aNum !== bNum) {
      return aNum - bNum;
    }

    // 4. Alphabetical sorting
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
  });

  // Build ordered tree object
  const orderedTree = {};
  for (const key of sortedKeys) {
    const item = unsorted[key];
    orderedTree[key] = item.isFolder ? sortTree(item) : item;
  }

  return orderedTree;
};

function getPermalinkMeta(note) {
  let permalink = "/";
  const parts = note.filePathStem.split("/");
  let name = parts[parts.length - 1];
  let noteIcon = process.env.NOTE_ICON_DEFAULT;
  let hide = false;
  let pinned = false;
  let folders = null;
  
  try {
    if (note.data.permalink) {
      permalink = note.data.permalink;
    }
    // Use includes() instead of indexOf() for better readability
    if (Array.isArray(note.data.tags) && note.data.tags.includes("gardenEntry")) {
      permalink = "/";
    }    
    if (note.data.title) {
      name = note.data.title;
    }
    if (note.data.noteIcon) {
      noteIcon = note.data.noteIcon;
    }
    // Reason for adding the hide flag instead of removing completely from file tree is to
    // allow users to use the filetree data elsewhere without the fear of losing any data.
    if (note.data.hide) {
      hide = note.data.hide;
    }
    if (note.data.pinned) {
      pinned = note.data.pinned;
    }
    if (note.data["dg-path"]) {
      folders = note.data["dg-path"].split("/");
    } else {
      const notesIndex = note.filePathStem.indexOf("notes/");
      folders = notesIndex >= 0 
        ? note.filePathStem.substring(notesIndex + 6).split("/")
        : parts;
    }
    folders[folders.length - 1] += ".md";
  } catch {
    //ignore
  }

  return [{ permalink, name, noteIcon, hide, pinned }, folders];
}

function assignNested(obj, keyPath, value) {
  const lastKeyIndex = keyPath.length - 1;
  for (let i = 0; i < lastKeyIndex; ++i) {
    const key = keyPath[i];
    if (!(key in obj)) {
      obj[key] = { isFolder: true };
    }
    obj = obj[key];
  }
  obj[keyPath[lastKeyIndex]] = value;
}

function getFileTree(data) {
  const tree = {};
  const notes = data.collections.note || [];
  
  // Use for loop for better performance
  for (const note of notes) {
    const [meta, folders] = getPermalinkMeta(note);
    if (folders) {
      assignNested(tree, folders, { isNote: true, ...meta });
    }
  }
  
  return sortTree(tree);
}

exports.getFileTree = getFileTree;
