---
title: "Example Blog Post from Obsidian"
date: 2024-12-15
tags:
  - Data Analysis
  - SQL
  - Tutorial
description: "Đây là một bài viết mẫu để bạn tham khảo format khi copy từ Obsidian"
image: "/img/example.png"
dg-publish: true
---

## Introduction

Đây là một bài viết mẫu để bạn tham khảo cách viết và format khi copy từ Obsidian.

## Code Examples

### SQL Query

```sql
SELECT 
    customer_id,
    SUM(order_amount) as total_spent,
    COUNT(*) as order_count
FROM orders
WHERE order_date >= '2024-01-01'
GROUP BY customer_id
HAVING total_spent > 1000
ORDER BY total_spent DESC;
```

### Python Analysis

```python
import pandas as pd
import numpy as np

def analyze_sales(df):
    """Analyze sales data"""
    summary = df.groupby('category').agg({
        'sales': ['sum', 'mean', 'count']
    })
    return summary
```

## Callouts

> [!info] Information
> Đây là một callout info từ Obsidian

> [!tip] Tip
> Mẹo hữu ích cho bạn!

> [!warning] Warning
> Cảnh báo quan trọng

> [!success] Success
> Thành công!

## Math Formulas

Công thức xác suất có điều kiện:

$$P(B|A) = \frac{P(A \cap B)}{P(A)}$$

Định lý Bayes:

$$P(A|B) = \frac{P(B|A) \cdot P(A)}{P(B)}$$

## Images

![Example Image](/img/example.png)

## Conclusion

Đây là kết luận của bài viết. Bạn có thể sử dụng format này làm template!
