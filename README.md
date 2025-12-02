# Digital Garden - My Knowledge Base

Một Digital Garden hiện đại được xây dựng với **Eleventy (11ty)** và **Glassmorphism Design**, cho phép bạn xuất bản và chia sẻ kiến thức từ Obsidian.

🌐 **Live Demo**: [https://kirstin-digital-garden.vercel.app/](https://kirstin-digital-garden.vercel.app/)

---

## 📋 Mục Lục

- [Tổng Quan](#tổng-quan)
- [Cấu Trúc Dự Án](#cấu-trúc-dự-án)
- [Cài Đặt](#cài-đặt)
- [Cấu Hình](#cấu-hình)
- [Components](#components)
- [Styling](#styling)
- [Build & Deploy](#build--deploy)
- [Tùy Chỉnh](#tùy-chỉnh)

---

## 🎯 Tổng Quan

Dự án này là một **Digital Garden** - một hệ thống quản lý kiến thức cá nhân cho phép:

- ✅ Xuất bản notes từ Obsidian
- ✅ Glassmorphism UI với background gradient động
- ✅ Graph view để visualize mối quan hệ giữa các notes
- ✅ Full-text search
- ✅ Backlinks và references
- ✅ Responsive design
- ✅ SEO-friendly với sitemap và RSS feed

---

## 📁 Cấu Trúc Dự Án

```
my-digital-garden/
├── .eleventy.js                 # Cấu hình Eleventy chính
├── package.json                 # Dependencies và scripts
├── vercel.json                  # Cấu hình Vercel deployment
├── netlify.toml                 # Cấu hình Netlify (backup)
│
├── src/
│   ├── helpers/                 # Utility functions
│   │   ├── constants.js         # Constants và settings
│   │   ├── filetreeUtils.js     # File tree generation
│   │   ├── linkUtils.js         # Link processing và graph generation
│   │   ├── userSetup.js         # User customization hooks
│   │   ├── userUtils.js         # User utilities
│   │   └── utils.js             # General utilities
│   │
│   └── site/                    # Source files cho Eleventy
│       ├── _data/               # Data files (global data)
│       │   ├── dynamics.js      # Dynamic component loading
│       │   ├── eleventyComputed.js  # Computed data
│       │   └── meta.js          # Site metadata
│       │
│       ├── _includes/            # Templates và components
│       │   ├── components/       # Reusable components
│       │   │   ├── calloutScript.njk      # Callout styling script
│       │   │   ├── filetree.njk           # File tree sidebar (left)
│       │   │   ├── filetreeMenuItem.njk   # File tree menu item macro (shared)
│       │   │   ├── graphScript.njk        # Graph visualization script
│       │   │   ├── linkPreview.njk        # Link preview component
│       │   │   ├── lucideIcons.njk        # Icon library setup
│       │   │   ├── navbar.njk             # Navigation bar (unified)
│       │   │   ├── notegrowthhistory.njk  # Note growth history
│       │   │   ├── pageheader.njk         # Page header (meta tags, etc.)
│       │   │   ├── references.njk         # References component
│       │   │   ├── searchButton.njk      # Search button
│       │   │   ├── searchContainer.njk    # Search modal container
│       │   │   ├── searchScript.njk       # Search functionality script
│       │   │   ├── sidebar.njk            # Right sidebar
│       │   │   └── timestamps.njk         # Timestamp formatting script
│       │   │
│       │   └── layouts/          # Page layouts
│       │       ├── index.njk     # Homepage layout
│       │       └── note.njk     # Note page layout
│       │
│       ├── notes/                # Markdown notes (content)
│       │   ├── Home.md          # Homepage content
│       │   ├── notes.11tydata.js # Note-specific data
│       │   └── [folders]/       # Organized notes by topic
│       │
│       ├── styles/               # SCSS stylesheets
│       │   ├── custom-style.scss # Custom styles (Glassmorphism)
│       │   ├── digital-garden-base.scss  # Base styles
│       │   ├── obsidian-base.scss        # Obsidian theme styles
│       │   └── style.scss                # Main stylesheet
│       │
│       ├── img/                  # Images và assets
│       ├── 404.njk              # 404 error page
│       ├── feed.njk             # RSS feed template
│       ├── graph.njk            # Graph data template
│       ├── search-index.njk    # Search index template
│       └── sitemap.njk         # Sitemap template
│
└── dist/                        # Build output (generated)
```

---

## 🚀 Cài Đặt

### Yêu Cầu

- **Node.js** >= 22.x
- **npm** hoặc **yarn**

### Các Bước

1. **Clone repository**
```bash
git clone <your-repo-url>
cd my-digital-garden
```

2. **Cài đặt dependencies**
```bash
npm install
```

3. **Chạy development server**
```bash
npm run dev
```

4. **Build production**
```bash
npm run build
```

---

## ⚙️ Cấu Hình

### Environment Variables

Tạo file `.env` trong root directory:

```env
# Site Configuration
SITE_NAME_HEADER=Kieu Trinh Tran
SITE_BASE_URL=kirstin-digital-garden.vercel.app
SITE_MAIN_LANGUAGE=vi

# Theme
BASE_THEME=light
THEME=default

# Features
DG_HOME_LINK=true
DG_ENABLE_SEARCH=true
DG_SHOW_FILE_TREE=true
DG_SHOW_LOCAL_GRAPH=true
DG_SHOW_BACKLINKS=true
DG_SHOW_TOC=true
DG_SHOW_INLINE_TITLE=true
DG_SHOW_TAGS=true

# Timestamps
SHOW_CREATED_TIMESTAMP=true
SHOW_UPDATED_TIMESTAMP=true
TIMESTAMP_FORMAT=MMM dd, yyyy h:mm a

# Note Icons
NOTE_ICON_DEFAULT=1
NOTE_ICON_TITLE=false
NOTE_ICON_FILETREE=false
NOTE_ICON_INTERNAL_LINKS=false
NOTE_ICON_BACK_LINKS=false
```

### File Cấu Hình Chính

#### `.eleventy.js`
File cấu hình Eleventy chính, xử lý:
- Markdown processing với custom plugins
- Image optimization
- Link processing (wiki links, internal links)
- HTML minification
- Custom filters và transforms

#### `vercel.json`
Cấu hình deployment trên Vercel:
```json
{
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "buildCommand": "npm run build",
  "devCommand": "npm run start"
}
```

---

## 🧩 Components

### Layout Components

#### `layouts/index.njk`
Layout cho **homepage** (trang chủ):
- Sử dụng khi note có tag `gardenEntry`
- Permalink: `/`
- Hiển thị filetree, graph, và các components đặc biệt cho homepage

#### `layouts/note.njk`
Layout cho **note pages** (các trang note):
- Permalink: `/notes/{slug}/`
- Hiển thị content, sidebar, backlinks, references

### UI Components

#### `components/navbar.njk`
**Navigation bar** thống nhất:
- Hiển thị site name và home link
- Search button (optional)
- Mobile menu toggle (khi dùng filetree mode)
- Hỗ trợ dynamic components injection

#### `components/filetree.njk`
**File tree sidebar** (bên trái):
- Hiển thị cấu trúc thư mục notes
- Responsive: ẩn trên mobile, hiện menu toggle
- Sử dụng Alpine.js cho interactivity
- Import `filetreeMenuItem.njk` macro

#### `components/filetreeMenuItem.njk`
**Shared macro** cho filetree menu items:
- Render notes và folders
- Recursive rendering cho nested folders
- Active state highlighting
- Icon support

#### `components/sidebar.njk`
**Right sidebar** chứa:
- Filetree (nếu không dùng left sidebar)
- Table of Contents (TOC)
- Local graph view
- Backlinks

#### `components/searchContainer.njk`
**Search modal**:
- Full-text search
- Keyboard navigation (Ctrl+K, Arrow keys, Enter, ESC)
- Real-time results
- Sử dụng `searchScript.njk` cho logic

#### `components/graphScript.njk`
**Graph visualization**:
- Force-directed graph với D3.js
- Local graph (connections của current page)
- Full graph view
- Depth control
- Node grouping by folder

### Script Components

#### `components/timestamps.njk`
Format timestamps với Luxon:
- ISO date parsing
- Custom format support
- Human-readable dates

#### `components/references.njk`
Reference handling:
- Hash-based references
- Double-click to copy URL
- Visual highlighting

---

## 🎨 Styling

### Glassmorphism Design

Dự án sử dụng **Glassmorphism** design system với:

#### Background
- **Vibrant gradient**: Blue → Purple → Pink → Cyan
- **Animated gradient shift**
- **Light source reflection** overlay

#### Components
- **Frosted glass effect**: `backdrop-filter: blur(20px)`
- **Transparent backgrounds**: `rgba(255, 255, 255, 0.1)`
- **Subtle borders**: `rgba(255, 255, 255, 0.2)`
- **Layered shadows**: Multiple box-shadows cho depth

#### Color Scheme
- **Text**: White/light colors cho contrast
- **Accents**: Sky blue (`rgba(135, 206, 235, ...)`)
- **Translucent colors** cho tất cả elements

### Stylesheet Structure

#### `custom-style.scss`
**Custom styles** (Glassmorphism):
- Body background gradient
- Component glassmorphism effects
- Typography với light colors
- Interactive elements styling

#### `digital-garden-base.scss`
**Base styles** cho digital garden:
- Layout structure
- Component base styles
- Responsive breakpoints

#### `obsidian-base.scss`
**Obsidian theme** compatibility:
- Markdown rendering
- Code blocks
- Tables
- Callouts

---

## 🔧 Build & Deploy

### Build Commands

```bash
# Development
npm run dev          # Watch mode với live reload

# Production
npm run build        # Build toàn bộ project
npm run build:sass   # Chỉ build SCSS
npm run build:eleventy  # Chỉ build Eleventy

# Clean
npm run clean        # Xóa dist và cache
```

### Build Process

1. **Pre-build**: Xóa `dist/` folder
2. **Get theme**: Generate theme CSS
3. **Build SASS**: Compile SCSS → CSS
4. **Build Eleventy**: Process templates và generate HTML
5. **Output**: Files trong `dist/`

### Deployment

#### Vercel (Recommended)
1. Connect GitHub repository
2. Vercel tự động detect `vercel.json`
3. Auto-deploy on push

#### Netlify
1. Connect repository
2. Build command: `npm run build`
3. Publish directory: `dist`

---

## 🛠️ Tùy Chỉnh

### Thêm Notes

1. Tạo file `.md` trong `src/site/notes/`
2. Thêm front matter:
```yaml
---
dg-publish: true
tags: ["note"]
title: "My Note Title"
permalink: "/my-note/"
---
```

3. Build lại project

### Custom Components

Thêm components vào `src/site/_includes/components/user/`:
```
user/
├── index/
│   ├── head/
│   ├── header/
│   ├── beforeContent/
│   ├── afterContent/
│   └── footer/
├── notes/
│   └── [same structure]
└── common/
    └── [same structure]
```

### Custom Styles

Thêm styles vào `src/site/styles/user/`:
- Files sẽ được auto-loaded
- Compiled to CSS trong build process

### Markdown Extensions

Dự án hỗ trợ:
- **Wiki links**: `[[Note Name]]`
- **Tags**: `#tag`
- **Callouts**: `> [!info] Title`
- **Math**: LaTeX với MathJax
- **Mermaid diagrams**: ````mermaid`
- **Task lists**: `- [ ] Task`

---

## 📚 Data Flow

### Eleventy Data Cascade

1. **Global Data** (`_data/`):
   - `meta.js`: Site metadata
   - `dynamics.js`: Component paths
   - `eleventyComputed.js`: Computed properties

2. **Template Data** (`notes.11tydata.js`):
   - Layout selection
   - Permalink generation
   - Settings per note

3. **Front Matter** (trong `.md` files):
   - Note-specific settings
   - Tags, title, dates

### Graph Generation

1. **Link Extraction** (`linkUtils.js`):
   - Parse wiki links từ content
   - Extract internal links
   - Build link graph

2. **Graph Data** (`graph.njk`):
   - Generate `graph.json`
   - Node và edge data
   - Backlinks calculation

---

## 🐛 Troubleshooting

### Build Errors

**Issue**: SCSS compilation fails
- **Solution**: Check SCSS syntax, ensure all imports exist

**Issue**: Eleventy build fails
- **Solution**: Check template syntax, verify data files

### Runtime Issues

**Issue**: Graph không hiển thị
- **Solution**: Check `graph.json` được generate, verify graph script loaded

**Issue**: Search không hoạt động
- **Solution**: Check `searchIndex.json` exists, verify search script

---

## 📝 License

ISC License

---

## 🙏 Credits

- **Eleventy**: Static site generator
- **Digital Garden Obsidian Plugin**: Original concept
- **Glassmorphism Design**: Modern UI trend

---

## 📞 Support

Nếu có vấn đề hoặc câu hỏi, vui lòng tạo issue trên GitHub repository.

---

**Happy Gardening! 🌱**
