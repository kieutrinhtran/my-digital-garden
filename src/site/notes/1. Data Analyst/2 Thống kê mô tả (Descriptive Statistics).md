---
{"dg-publish":true,"permalink":"/1-data-analyst/2-thong-ke-mo-ta-descriptive-statistics/","updated":"2025-11-21T09:35:44.479+07:00"}
---

## **1. Thống kê mô tả là gì?**

**Thống kê mô tả** là tập hợp các phương pháp dùng để:
- **Tóm tắt**, **mô tả** đặc điểm chính của dữ liệu
- Giúp **hiểu nhanh** cấu trúc, xu hướng, độ biến động của dữ liệu
- Không đưa ra suy luận hay kiểm định, chỉ phản ánh **tình trạng hiện tại** của mẫu
## **2. Các nhóm chỉ số chính**
### 2.1. **Chỉ số trung tâm (Measures of Central Tendency)**

| Tên gọi    | Ký hiệu                                          | Ý nghĩa                            |
| ---------- | ------------------------------------------------ | ---------------------------------- |
| Trung bình | $$\bar{x} = \frac{1}{n} \sum_{i=1}^{n} x_i$$<br> | Giá trị trung bình cộng            |
| Trung vị   | $$\tilde{x}$$                                    | Giá trị ở giữa khi sắp xếp dữ liệu |
| Mode (Mốt) | $$\text{Mode}(x)$$<br>                           | Giá trị xuất hiện nhiều nhất       |
|            |                                                  |                                    |

> → Dùng để biểu diễn **giá trị điển hình** hoặc **đại diện** của tập dữ liệu.
### 2.2. **Chỉ số phân tán (Measures of Dispersion)**

| Tên gọi                 | Ký hiệu       | Ý nghĩa                                       |
| ----------------------- | ------------- | --------------------------------------------- |
| Độ lệch chuẩn           | σ, s          | Độ phân tán của dữ liệu xung quanh trung bình |
| Phương sai              | $$σ^2, s^2$$  | Bình phương độ lệch chuẩn                     |
| Khoảng (Range)          | R             | max⁡−min⁡\max - \minmax−min                   |
| Tứ phân vị (Quartiles)  | $$Q^1, Q^3$$​ | Cắt dữ liệu thành 4 phần bằng nhau            |
| IQR (Khoảng tứ phân vị) | $$Q3−Q1$$​    | Thể hiện độ phân tán của 50% giữa             |

> → Dùng để đo lường **mức độ biến thiên**, **rủi ro**, hoặc **sự ổn định** của dữ liệu.

### 2.3. **Hình dạng phân phối (Shape of Distribution)**

|Tên gọi|Ý nghĩa|
|---|---|
|Độ lệch (Skewness)|Phản ánh dữ liệu lệch trái/phải|
|Độ nhọn (Kurtosis)|Độ nhọn hay bẹt so với phân phối chuẩn|

> → Cho biết **phân phối chuẩn**, **phân phối lệch**, hay có nhiều ngoại lệ.

## **3. Các công cụ trình bày thống kê mô tả**

|Công cụ|Mục đích|
|---|---|
|Bảng tần suất|Tóm tắt dữ liệu định tính, rời rạc|
|Biểu đồ (Bar, Pie, Line...)|Trực quan hóa dữ liệu|
|Boxplot|Thể hiện trung vị, tứ phân vị, ngoại lệ|
|Histogram|Thể hiện phân phối dữ liệu liên tục|

## **4. Thống kê mô tả cho từng loại dữ liệu**

|Loại dữ liệu|Dùng chỉ số nào|
|---|---|
|Định danh (Nominal)|Mode, bảng tần suất, biểu đồ tròn|
|Thứ bậc (Ordinal)|Median, Mode, biểu đồ cột|
|Định lượng (Interval/Ratio)|Mean, Std, Range, Boxplot, Histogram|
