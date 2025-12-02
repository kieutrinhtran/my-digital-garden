---
{"dg-publish":true,"permalink":"/1-data-analyst/example/101-about-dbt-labs-for-beginners/","updated":"2025-12-02T23:58:14.300+07:00"}
---

# Giáo trình dbt Labs cho Data Engineer (BigQuery + Power BI + Kimball)

Tài liệu này tổng hợp **tất cả những gì bạn đã hỏi** về dbt + BigQuery + Power BI, và bổ sung thêm để bạn dùng dbt ở mức Data Engineer.

---

## 0. dbt là gì và đứng ở đâu trong hệ thống?

- **dbt (data build tool)** chỉ làm **T – Transform** trong ETL/ELT.
- Dữ liệu raw đã nằm trong **Data Warehouse** (BigQuery).
- dbt dùng **SQL + Jinja** để:
	- tạo các bảng/lớp: **staging (T1), T2, T3, T4 (dim/fact/mart/T5…)**
	- quản lý code theo **DAG/Lineage graph**
	- gắn **test + doc** cho từng model.
- dbt = Xây dựng data warehouse (T1–T5).
- Power BI = Semantic model + relationships + DAX + visualization.
**Tư duy kiến trúc:**
 - *T0: Raw data (Shopee, Ads, CRM, ... trong BigQuery)*
 - *T1: Staging per source (stg_)*
 - *T2: Cleaned / chuẩn hoá / business pre-logic*
 - *T3: Logic business phức tạp (enrich, mapping)*
 - *T4: Dimensional Model (Fact / Dim chuẩn Kimball)*
 - *T5: Bảng wide / aggregated cho BI (nếu cần tối ưu)*

## 1. dbt Core vs dbt Cloud, bản Free
### 1.1. dbt Core (miễn phí 100%)
- Open-source, chạy bằng CLI trên máy/VM.
- Cài: `pip install dbt-bigquery dbt init my_project`
- Chạy: `dbt run dbt test`
### 1.2. dbt Cloud Free
- UI web, có IDE, có lineage graph.
- Có **Free Developer Plan**:
    - 1 developer seat
    - IDE online
    - Run job manual
- Rất hợp để bạn **test & học**
**Kết luận:**
- Học/test: dbt Cloud Free
- Deploy thực tế: Core (kết hợp CI/CD) hoặc trả phí Cloud.
---
## 2. Setup dbt Cloud Free + BigQuery (tóm tắt)
1. Đăng ký: [https://www.getdbt.com/signup/](https://www.getdbt.com/signup/) → chọn **Free Developer Plan**.
2. Tạo **Project mới** → chọn Warehouse = **BigQuery**.
3. Trong Google Cloud:
    - Tạo **Service Account**: `dbt-cloud-sa`.
    - Gán quyền tối thiểu:
        - `BigQuery Data Viewer`
        - `BigQuery User`
        - `BigQuery Job User`
        - (tuỳ nhu cầu: `BigQuery Data Editor` / `BigQuery Admin`)
    - Tạo **JSON key** và tải về.
4. Trong dbt Cloud:
    - Upload file JSON vào phần cấu hình BigQuery.
    - Điền `project_id`, `dataset`, `location` → **Test Connection**.
5. (Khuyến khích) Kết nối với GitHub để có repo code dbt.
6. Vào **Develop → Start Development** để dùng IDE.
---
## 3. Cấu trúc project dbt cơ bản
Trong repo dbt sẽ có:
```text
dbt_project.yml        # cấu hình chính
models/
  staging/             # T1
  intermediate/        # T2/T3
  dim/                 # T4 dimensions
  fact/                # T4 facts
  marts/               # (optional) T4/T5 cho BI
macros/                # macro dùng chung
snapshots/             # SCD snapshots
seeds/                 # CSV nhỏ import vào DWH
```
- Mỗi file `.sql` trong `models/` = **1 model** = 1 bảng/view mà dbt build.
- Các file `.yml` trong `models/` = schema/test/doc cho model.
---
## 4. `config()` trong dbt – tất cả những gì quan trọng
### 4.1. `config()` là gì?
Trong mỗi model, bạn có thể thêm:
```sql
{{ config(
    key1='value1',
    key2='value2',
    ...
) }}
```
**Mục đích:** điều khiển cách dbt **build** model đó (không ảnh hưởng logic SELECT).
Ví dụ:
```sql
{{ config(
    materialized='incremental',
    unique_key='transaction_id',
    partition_by={'field': 'transaction_date', 'data_type': 'date'},
    cluster_by=['employee_key'],
    tags=['fact', 'transaction']
) }}
```
### 4.2. Các tham số quan trọng trong `config()`

|Key|Ý nghĩa chính|
|---|---|
|`materialized`|Kiểu materialization: `view`, `table`, `incremental`, `ephemeral`|
|`schema`|Override schema output|
|`database`|Override database|
|`alias`|Đổi tên bảng output|
|`partition_by`|Partition BigQuery (tối ưu query)|
|`cluster_by`|Clustering BigQuery (tối ưu join/filter)|
|`unique_key`|Key để merge trong incremental|
|`tags`|Gán tag để run theo nhóm (`tag:fact`, `tag:transaction`)|
|`enabled`|Bật/tắt model|
|`on_schema_change`|Khi schema đổi thì xử lý thế nào|
|`persist_docs`|Lưu docs cho model & cột (để show trên UI docs)|

### 4.3. 3 nơi có thể khai báo config
1. **Ngay trong file .sql** (ưu tiên cao nhất):
```sql
{{ config(materialized='table') }}
```
2. Trong file `.yml` của model:
```yaml
models:
  - name: dim_employee
    config:
      materialized: table

```
3. Trong `dbt_project.yml` (áp dụng cho folder):
```yaml
models:
  my_project:
    staging:
      +materialized: view
    dim:
      +materialized: table
    fact:
      +materialized: incremental

```
**Ưu tiên:**  
`.sql config > schema.yml config > dbt_project.yml`

---
## 5. Materialization – view, table, incremental, ephemeral
### 5.1. `materialized='view'`
```sql
{{ config(materialized='view') }}

SELECT ...
FROM {{ source('shopee', 'orders') }}
```
- Tạo **view**, không lưu data vật lý (chỉ lưu query).
- Dùng tốt cho:
    - **Staging (T1)**
    - Logic nhẹ, bảng nhỏ.
### 5.2. `materialized='table'`
```sql
{{ config(materialized='table') }}

SELECT ...
FROM {{ ref('stg_orders') }}
```
- Tạo **bảng vật lý**, ghi đè mỗi lần `dbt run`.
- Dùng cho:
    - Dimension
    - T2/T3/T4 nhỏ–vừa
    - Bảng cần query nhanh, không quá lớn.
### 5.3. `materialized='incremental'` + `unique_key`
```sql
{{ config(
    materialized='incremental',
    unique_key='transaction_id'
) }}

SELECT ...
FROM {{ ref('stg_transaction') }}
{% if is_incremental() %}
  WHERE updated_at > (
    SELECT COALESCE(MAX(updated_at), TIMESTAMP('1970-01-01'))
    FROM {{ this }}
  )
{% endif %}
```
- Lần chạy đầu: tạo full table.
- Các lần sau:
    - chỉ lấy dữ liệu mới (theo `updated_at` hoặc `created_at`)
    - dbt dùng `unique_key` để `MERGE` (insert/update).
**Dùng cho:**
- Fact **rất lớn** (transaction, order_item, events, logs…).
### 5.4. `materialized='ephemeral'`
```sql
{{ config(materialized='ephemeral') }}

SELECT
  order_id,
  price * quantity AS revenue
FROM {{ ref('stg_order_item') }}
```
- Không tạo bảng/view.
- Khi model khác `ref()` model này, dbt sẽ **inline SQL** vào.
- Dùng để:
    - chia nhỏ logic cho dễ đọc
    - tránh sinh thêm nhiều bảng trung gian.
---
## 6. BigQuery: `partition_by` & `cluster_by` (và khác gì với JOIN)
### 6.1. `partition_by`
```sql
{{ config(
    materialized='table',
    partition_by={'field': 'order_date', 'data_type': 'date'}
) }}
```
- Chia bảng thành **partition** theo `order_date`.
- Query có filter `WHERE order_date BETWEEN '2025-01-01' AND '2025-01-31'`  
    → BigQuery chỉ scan partition tương ứng.
- Giúp:
    - Query **nhanh hơn** rất nhiều.
    - Giảm chi phí (scan ít bytes hơn).
- Áp dụng cho fact lớn: `fct_orders`, `fct_order_item`, `fct_ads_spend`…
### 6.2. `cluster_by
```sql
{{ config(
    materialized='table',
    cluster_by=['employee_key']
) }}
```
- Sắp xếp & nhóm dữ liệu bên trong mỗi partition theo `employee_key`.
- Tối ưu:
    - join theo `employee_key`
    - filter mạnh theo `employee_key`.
### 6.3. So sánh với JOIN
- `LEFT JOIN` → **logic transform dữ liệu** (ra bảng mới, thêm cột, enrich).
- `partition_by` & `cluster_by` → **cách BigQuery lưu trữ dữ liệu**, không đổi kết quả.
**Tóm tắt:**
- **JOIN = nấu ăn (trộn nguyên liệu thành món mới).**
- **PARTITION = chia tủ lạnh thành ngăn.**
Hai thứ **không thay thế nhau**, mà **bổ sung nhau**.
---
## 7. Kimball, Dimensional Modeling & Big Data
### 7.1. Kimball & denormalization
Hiểu đúng:
- Kimball **không yêu cầu** chuẩn hóa 3NF.
- Ngược lại, Kimball khuyến khích:
    - Dimension: **denormalized, wide**
    - Fact: **grain rõ ràng, narrow, có keys + measures**
→ Rất phù hợp cho dữ liệu bán hàng **hàng triệu dòng/ngày**.
### 7.2. Star schema chuẩn
Ví dụ e-commerce:
```text
           dim_date
              |
              |
dim_customer - fct_orders - dim_shop
              |
              |
        fct_order_item - dim_product

```
- Dim: chứa thông tin mô tả, denormalized (rộng).
- Fact: chứa keys + measures, partition + incremental.
### 7.3. Khi dữ liệu cực lớn (triệu–tỷ dòng/ngày)
Chiến lược:
1. Dùng **Kimball star schema** cho T4: dim/fact chuẩn.
2. Thêm **T5 – bảng aggregated / wide** để tối ưu BI:
    - `fct_orders_daily_agg`
    - `fct_orders_customer_agg`
    - `fct_ads_channel_daily`
```sql
SELECT
  order_date,
  product_id,
  SUM(revenue) AS revenue,
  SUM(quantity) AS quantity
FROM {{ ref('fct_order_item') }}
GROUP BY 1,2
```
- T4: nền tảng chuẩn / linh hoạt.
- T5: tối ưu speed cho dashboard nặng.
---
## 8. Surrogate Key (SK) & `dbt_utils.generate_surrogate_key`
### 8.1. Surrogate key là gì?
- Khóa đại diện **do bạn tạo**, không lấy từ hệ thống gốc.
- Thường là INT hoặc hash.
- **Ổn định, không đổi** khi dữ liệu source đổi (user_name, email…).
Ví dụ:
- Natural key: `user_name = "nguyenvana"`
- Surrogate key: `employee_key = "2a6bca8fe0b9a79d..."`
Lý do dùng SK:
- join nhanh và ổn định
- tránh phụ thuộc vào natural key có thể đổi
- hỗ trợ SCD (history tracking)
### 8.2. Surrogate key trong dbt
Sử dụng macro `dbt_utils.generate_surrogate_key`:
```sql
{{ dbt_utils.generate_surrogate_key(['user_name']) }} AS employee_key
```
Hoặc kết hợp nhiều cột:
```sql
{{ dbt_utils.generate_surrogate_key(['product_id', 'valid_from']) }} AS product_price_key
```
Macro này thường dùng MD5 hash.
### 8.3. Use-case
- Trong **dim**:
```sql
SELECT
  {{ dbt_utils.generate_surrogate_key(['user_name']) }} AS employee_key,
  user_name,
  full_name,
  department
FROM {{ ref('stg_employee') }}
```
- Trong **fact**:
    - Join dim để lấy `employee_key`.
    - Lưu `employee_key` → join với dim trong BI.
---
## 9. Ví dụ đầy đủ: `dim_employee` & `fact_transaction`
### 9.1. `dim_employee.sql`
```sql
-- models/dim/dim_employee.sql
{{ config(
    materialized='table',
    tags=['dimension', 'employee']
) }}

WITH base AS (
  SELECT
    user_name,
    full_name,
    department,
    position,
    is_active
  FROM {{ ref('stg_employee') }}
)

SELECT
  {{ dbt_utils.generate_surrogate_key(['user_name']) }} AS employee_key,
  user_name,
  full_name,
  department,
  position,
  is_active
FROM base;
```
### 9.2. `dim_employee.yml`
```sql
version: 2

models:
  - name: dim_employee
    description: "Danh mục nhân viên, join với fact qua employee_key hoặc user_name"
    columns:
      - name: employee_key
        description: "Surrogate key cho nhân viên"
        tests:
          - not_null
          - unique
      - name: user_name
        description: "User đăng nhập từ hệ thống nguồn"
        tests:
          - not_null
          - unique
```
---
### 9.3. `fact_transaction.sql` (incremental + partition + SK)
```sql
-- models/fact/fact_transaction.sql
{{ config(
    materialized='incremental',
    unique_key='transaction_id',
    partition_by={'field': 'transaction_date', 'data_type': 'date'},
    cluster_by=['employee_key'],
    tags=['fact', 'transaction']
) }}

WITH trans AS (
  SELECT
    transaction_id,
    TIMESTAMP(transaction_time) AS transaction_time,
    DATE(transaction_time)      AS transaction_date,
    user_name                   AS employee_user_name,
    customer_id,
    amount,
    status
  FROM {{ ref('stg_transaction') }}
  {% if is_incremental() %}
    WHERE transaction_time >
      (SELECT COALESCE(MAX(transaction_time), TIMESTAMP('1970-01-01'))
       FROM {{ this }})
  {% endif %}
),

joined AS (
  SELECT
    t.transaction_id,
    t.transaction_time,
    t.transaction_date,
    d.employee_key,
    t.employee_user_name,
    t.customer_id,
    t.amount,
    t.status
  FROM trans t
  LEFT JOIN {{ ref('dim_employee') }} d
    ON t.employee_user_name = d.user_name
)

SELECT * FROM joined;
```
### 9.4. `fact_transaction.yml`
```yaml
version: 2

models:
  - name: fact_transaction
    description: "Fact giao dịch, grain = 1 dòng = 1 transaction"
    columns:
      - name: transaction_id
        tests:
          - not_null
          - unique
      - name: transaction_date
        tests:
          - not_null
      - name: employee_key
        description: "Link tới dim_employee"
      - name: amount
        description: "Giá trị giao dịch"
        tests:
          - not_null
```
---
## 10. Sources & Staging Pattern (T1)
### 10.1. Khai báo sources
```yaml
-- models/sources.yml
version: 2

sources:
  - name: shopee
    database: your_project
    schema: raw_shopee
    tables:
      - name: orders
      - name: order_items

  - name: internal
    database: your_project
    schema: raw_internal
    tables:
      - name: employee
      - name: transaction
```
### 10.2. Staging model
```sql
-- models/staging/internal/stg_employee.sql
{{ config(materialized='view') }}

SELECT
  user_name,
  full_name,
  department,
  position,
  is_active
FROM {{ source('internal', 'employee') }};
```

```sql
-- models/staging/internal/stg_transaction.sql
{{ config(materialized='view') }}

SELECT
  transaction_id,
  transaction_time,
  user_name,
  customer_id,
  amount,
  status
FROM {{ source('internal', 'transaction') }};
```
**Tư duy:**  
T1 chỉ: rename cột, chuẩn hoá kiểu dữ liệu, không logic business nặng.

---
## 11. dbt + Power BI để triển khai Dimensional Modeling
### 11.1. Vai trò
- **dbt:**
    - Xây dựng **Dimensional Model** (dim/fact) trong BigQuery.
    - Làm sạch, join logic, chuẩn hoá, partition, incremental.
- **Power BI:**
    - Import bảng T4/T5.
    - Tạo **relationship** (1–N) giữa dim và fact.
    - Viết **DAX** (Total Revenue, Margin…).
    - Visualization.
### 11.2. Quy trình
1. dbt build:
    - `dim_employee`, `dim_product`, `dim_date`, `fct_orders`, `fct_order_item`, `fct_ads_spend`...
2. Power BI:
    - Get Data → BigQuery → dataset dbt đã build.
    - Tạo relationships:
```text
dim_employee.employee_key 1 ───< fact_transaction.employee_key
dim_date.date           1 ───< fact_transaction.transaction_date
```
	- Tạo DAX
```dax
Total Amount = SUM(fact_transaction[amount])
Transaction Count = DISTINCTCOUNT(fact_transaction[transaction_id])
```
**Nguyên tắc vàng:**
- Logic transform/phức tạp → làm ở **dbt**.
- Power BI chủ yếu:
    - relationship
    - DAX
    - Visualization.
Không nên làm nhiều transform trong Power Query.
---
## 12. Tests & Documentation trong dbt
### 12.1. Tests trong `.yml`
```yaml
models:
  - name: dim_product
    columns:
      - name: product_id
        tests:
          - not_null
          - unique
      - name: category
        tests:
          - not_null
```
Chạy:
`dbt test`
### 12.2. Documentation
Thêm description trong `.yml`, ví dụ:
```yaml
models:
  - name: fct_order_item
    description: "Chi tiết đơn hàng level sản phẩm"

```
Tạo docs:
`dbt docs generate dbt docs serve`
Xem lineage graph + docs trên UI.

---
## 13. Snapshots (SCD) – lưu lịch sử
```sql
-- snapshots/product_price.sql
{% snapshot product_price_snapshot %}

{{
  config(
    target_schema='snapshots',
    unique_key='product_id',
    strategy='timestamp',
    updated_at='updated_at'
  )
}}

SELECT
  product_id,
  price,
  cogs,
  updated_at
FROM {{ source('raw', 'product_price') }}

{% endsnapshot %}
```
Ví dụ: lưu lịch sử **giá sản phẩm** hoặc thông tin nhân viên.
Chạy:
`dbt snapshot`
dbt tự tạo bảng snapshot với lịch sử (kiểu SCD2).

---
## 14. Workflow như Data Engineer

1. Pull code mới + tạo branch Git.
2. Viết/modify model:    
    - staging / dim / fact.        
3. Chạy local:    
    - `dbt run -m model_name`        
    - `dbt test -m model_name`        
4. Push code → mở PR → CI chạy:    
    - `dbt run --select state:modified+`        
    - `dbt test --select state:modified+`        
5. Merge → Scheduler (dbt Cloud / CI) chạy theo lịch:    
    - nightly / hourly / mỗi 15 phút tùy nhu cầu. 

