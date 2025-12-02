---
{"dg-publish":true,"permalink":"/1-data-analyst/1-xac-suat/","updated":"2025-12-02T11:32:16.612+07:00"}
---


## **I. Xác suất (Probability)**
### 1. **Khái niệm cơ bản**
- Không gian mẫu (Sample space) S
- Biến cố (Events)
- Xác suất của biến cố P(A)P(A)P(A), thỏa mãn:
    $$0≤P(A)≤1, P(S)=1$$
### 2. **Tính xác suất**
- Quy tắc cộng:
    $$P(A∪B)=P(A)+P(B)−P(A∩B)$$
- Quy tắc nhân:
    $$P(A∩B)=P(A)⋅P(B∣A)$$
### 3. **Xác suất có điều kiện (Conditional Probability)**
$$P(B∣A) = \frac{P(A \cap B)}{P(A)}$$
### 4. **Định lý Bayes (Bayes' Theorem)**
$$P(A∣B)=\frac{P(B|A) \cdot P(A)}{P(B)}$$
✅ **Ứng dụng**:
- Phân loại dữ liệu (Naive Bayes)
- Dự đoán rủi ro
- Ra quyết định khi có thông tin mới
## **II. Biến ngẫu nhiên & Phân phối xác suất**
### 1. **Biến ngẫu nhiên rời rạc và liên tục**
- Rời rạc: Số lượng email mỗi ngày, số lượt click
- Liên tục: Thời gian khách truy cập ở lại trang
### 2. **Hàm phân phối xác suất (PMF/PDF) và hàm phân phối tích lũy (CDF)**
### 3. **Các phân phối xác suất thường gặp**

|Tên phân phối|Loại|Ứng dụng|
|---|---|---|
|Bernoulli|Rời rạc|Dữ liệu nhị phân (0/1)|
|Binomial|Rời rạc|Tính số lần thành công trong số lần thử|
|Poisson|Rời rạc|Số sự kiện xảy ra trong 1 đơn vị thời gian (web hits, lỗi)|
|Uniform|Cả 2|Dữ liệu đồng đều|
|Normal (Gaussian)|Liên tục|Dữ liệu chuẩn, dùng nhiều trong thống kê suy luận|
|Exponential|Liên tục|Thời gian giữa hai sự kiện (hỏng hóc, truy cập web...)|
|t-distribution|Liên tục|So sánh trung bình mẫu nhỏ, ít quan sát|
