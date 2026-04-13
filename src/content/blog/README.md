# Blog Content Directory

## 📝 Hướng dẫn sử dụng

### Copy files từ Obsidian

1. **Mở Obsidian vault** của bạn
2. **Copy file .md** từ Obsidian
3. **Paste vào thư mục này**: `src/content/blog/`
4. Website sẽ tự động:
   - Extract frontmatter
   - Generate permalink
   - Publish bài viết

### Frontmatter Format

Thêm frontmatter vào đầu file:

```yaml
---
title: "Tên Bài Viết"
date: 2024-12-15
tags: 
  - Data Analysis
  - SQL
description: "Mô tả ngắn"
image: "/img/cover.png"
dg-publish: true
---
```

### Example Files

Xem các file mẫu trong:
- `src/site/notes/` - Existing examples
- Xem `OBSIDIAN_WORKFLOW.md` ở root để biết chi tiết

### Images

Copy images vào: `src/site/img/`

Trong markdown, sử dụng:
```markdown
![Alt text](/img/image.png)
```

---

**Happy Writing! 🚀**
