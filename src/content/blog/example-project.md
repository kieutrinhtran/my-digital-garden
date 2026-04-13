---
title: "Example Data Analysis Project"
date: 2024-12-10
tags:
  - project
  - data-analysis
  - SQL
  - Business Intelligence
layout: project
technology:
  - SQL
  - Python
  - Tableau
category: "Business Analysis"
description: "Một dự án phân tích dữ liệu mẫu với cấu trúc Problem -> Solution -> Impact"
image: "/img/project-example.png"
roi: "150%"
cir_improvement: "25%"
dg-publish: true
---

## Problem / Vấn đề

Công ty đang gặp vấn đề với việc quản lý tồn kho không hiệu quả, dẫn đến:
- Tồn kho quá mức ở một số sản phẩm
- Thiếu hàng ở các sản phẩm bán chạy
- Chi phí lưu kho tăng cao
- Doanh thu bị ảnh hưởng do thiếu hàng

### Data Sources

- Sales database (SQL Server)
- Inventory system
- Customer orders

## Solution / Giải pháp

### 1. Data Collection & Cleaning

```sql
-- Extract sales data
SELECT 
    product_id,
    SUM(quantity) as total_sold,
    AVG(price) as avg_price,
    COUNT(DISTINCT order_id) as order_count
FROM sales
WHERE order_date >= DATEADD(MONTH, -6, GETDATE())
GROUP BY product_id;
```

### 2. Analysis & Insights

Sử dụng Python để phân tích:

```python
import pandas as pd
import numpy as np

# Load data
sales_df = pd.read_sql(query, connection)

# Calculate inventory turnover
sales_df['inventory_turnover'] = sales_df['total_sold'] / sales_df['current_stock']

# Identify slow-moving items
slow_moving = sales_df[sales_df['inventory_turnover'] < 2]
```

### 3. Dashboard Creation

Tạo Tableau dashboard để:
- Track inventory levels real-time
- Predict demand
- Optimize reorder points

## Impact / Kết quả

### Metrics

- **ROI**: 150% trong 6 tháng đầu
- **CIR Improvement**: 25% reduction in carrying costs
- **Stockout Reduction**: 60% decrease
- **Inventory Turnover**: Tăng từ 4 lên 6.5

### Business Impact

1. **Cost Savings**: Giảm chi phí lưu kho 25%
2. **Revenue Increase**: Tăng doanh thu 15% nhờ giảm stockout
3. **Customer Satisfaction**: Tăng 30% nhờ có hàng sẵn sàng

### Lessons Learned

- Data quality là quan trọng nhất
- Collaboration giữa Data Analyst và Operations team
- Continuous monitoring và adjustment
