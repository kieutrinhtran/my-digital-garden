---
{"dg-publish":true,"permalink":"/1-data-analyst/3-thong-ke-suy-luan-inferential-statistics/","updated":"2025-11-24T09:12:38.483+07:00"}
---

# 1. **Lấy mẫu (Sampling)**
Lấy mẫu là quá trình chọn ra một tập hợp con (mẫu) từ tổng thể (population) để tiến hành đo lường, phân tích mà không cần thu thập dữ liệu từ toàn bộ tổng thể.
## **Lấy mẫu ngẫu nhiên đơn (Simple Random Sampling – SRS):** 
Mỗi phần tử trong tổng thể có cùng xác suất được chọn vào mẫu. Việc chọn được thực hiện ngẫu nhiên, không thiên lệch.

**Ví dụ:**
Bạn có 1000 khách hàng, dùng random function để chọn ngẫu nhiên 100 người.

**Ưu điểm:**
- Dễ hiểu, dễ thực hiện bằng Excel/Python
- Giảm sai lệch hệ thống (bias)

**Nhược điểm:**
- Cần danh sách đầy đủ toàn bộ tổng thể
- Không đảm bảo đại diện cho các nhóm nhỏ (nếu tổng thể không đồng nhất)
## **Lấy mẫu phân tầng (Stratified Sampling)**: 
Chia tổng thể thành các tầng (strata) dựa trên một biến phân nhóm (giới tính, khu vực, độ tuổi...), sau đó lấy mẫu ngẫu nhiên trong từng tầng theo tỷ lệ.

**Ví dụ:**
Bạn có 60% khách hàng nữ, 40% nam → Mẫu 100 người sẽ chọn 60 nữ + 40 nam.

**Ưu điểm:**
- Đảm bảo mỗi nhóm quan trọng đều được đại diện trong mẫu
- Tăng độ chính xác khi có sự không đồng đều giữa các nhóm

**Nhược điểm:**
- Cần biết thông tin phân nhóm trước
- Phức tạp hơn khi số nhóm lớn

## **Lấy mẫu hệ thống (Systematic Sampling)**: 
Chọn phần tử đầu tiên ngẫu nhiên, sau đó lấy các phần tử tiếp theo cách đều nhau theo khoảng k.
**Công thức khoảng cách lấy mẫu:**
$$k=⌊\frac{n}{N​}⌋$$
Trong đó:
- N: kích thước tổng thể
- n: số mẫu muốn lấy
**Ví dụ:**
Bạn có 1000 người, muốn lấy 100 người → k=10k = 10k=10. Chọn người thứ 7, sau đó người 17, 27, 37, v.v.

**Ưu điểm:**
- Dễ thực hiện (không cần random toàn bộ)
- Phân phối đều

**Nhược điểm:**
- Nếu tổng thể có **chu kỳ** trùng với khoảng cách mẫu → tạo thiên lệch

| Phương pháp    | Cách chọn mẫu               | Ưu điểm               | Nhược điểm                     |
| -------------- | --------------------------- | --------------------- | ------------------------------ |
| Ngẫu nhiên đơn | Ngẫu nhiên toàn bộ          | Dễ hiểu, khách quan   | Có thể thiếu đại diện nhóm nhỏ |
| Phân tầng      | Chia nhóm → chọn ngẫu nhiên | Đại diện tốt các nhóm | Cần phân nhóm sẵn              |
| Hệ thống       | Chọn ngẫu nhiên + cách đều  | Nhanh, đơn giản       | Dễ lệch nếu dữ liệu có chu kỳ  |
- [[1. Data Analyst/3.1 Xác định cỡ mẫu\|3.1 Xác định cỡ mẫu]] (Sample size) – tính toán và ước lượng
# 2. **Ước lượng tham số**
- Khoảng tin cậy (Confidence Interval):
$$\bar{x}±Z_{\alpha/2} \cdot \frac{s}{\sqrt{n}}$$
# 3. **Kiểm định giả thuyết (Hypothesis Testing)**
| Thành phần                   | Giải thích                                     |
| ---------------------------- | ---------------------------------------------- |
| Giả thuyết gốc $$H_0$$​      | Không có sự khác biệt                          |
| Giả thuyết thay thế $$H_1$$​ | Có sự khác biệt                                |
| p-value                      | Xác suất quan sát dữ liệu như vậy nếu H0​ đúng |
| Alpha α                      | Mức ý nghĩa (thường là 0.05)                   |
## ✅Kiểm định t (t-tests)
Dùng để **so sánh trung bình** giữa các nhóm khi dữ liệu liên tục và phân phối gần chuẩn.
### a. **One-sample t-test (kiểm định 1 mẫu)**
**Mục tiêu:** So sánh trung bình của một mẫu với một giá trị cụ thể $$μ_0$$
#### 🔍 Công thức:
$$t = \frac{\bar{x} - \mu_0}{s / \sqrt{n}}$$​​

**Ví dụ:** So sánh thời gian truy cập trung bình thực tế có khác 3 phút như kỳ vọng không?
### b. **Independent two-sample t-test (kiểm định 2 mẫu độc lập)**
**Mục tiêu:** So sánh trung bình của **hai nhóm không liên quan nhau**.
#### 🔍 Công thức:
$$t = \frac{\bar{x}_1 - \bar{x}_2}{\sqrt{ \frac{s_1^2}{n_1} + \frac{s_2^2}{n_2} }}$$
**Ví dụ:** So sánh điểm đánh giá trung bình giữa 2 nhóm người dùng A và B.
### c. **Paired t-test (2 mẫu liên quan)**
**Mục tiêu:** So sánh trung bình **trước và sau can thiệp** trên cùng đối tượng.
#### 🔍 Công thức:
$$t = \frac{\bar{d}}{s_d / \sqrt{n}}​$$
**Ví dụ:** So sánh hiệu suất làm việc của nhân viên **trước và sau đào tạo**.
## ✅ **ANOVA (Analysis of Variance)**
**Mục tiêu:** So sánh trung bình của **nhiều hơn 2 nhóm**.
- Giả thuyết H0​: tất cả các nhóm có trung bình bằng nhau
- Dùng khi t-test không còn phù hợp (vì t chỉ so sánh 2 nhóm)
#### 🔍 Công thức kiểm định F:
$$F = \frac{\text{Biến thiên giữa các nhóm}}{\text{Biến thiên trong nhóm}}$$​
**Ví dụ:** So sánh điểm hài lòng trung bình giữa 3 chi nhánh Highlands Coffee khác nhau.
## ✅ **Chi-square test (kiểm định Chi bình phương)**
**Mục tiêu:** Dùng cho **dữ liệu phân loại**, để kiểm định:
- Mối liên hệ giữa 2 biến (kiểm định độc lập)
- Sự phân phối có khớp kỳ vọng không (kiểm định goodness of fit)
#### 🔍 Công thức:
$$\chi^2 = \sum \frac{(O - E)^2}{E}$$​
- O: giá trị quan sát
- E: giá trị kỳ vọng
#### 🧠 Ví dụ:
- Kiểm tra xem giới tính và thói quen uống cà phê có liên quan không.
- Kiểm tra xem tỉ lệ khách chọn sản phẩm có khớp dự đoán không.
## ✅ **Các kiểm định thống kê khác thường dùng**

| Tên kiểm định                           | Ứng dụng chính                                     |
| --------------------------------------- | -------------------------------------------------- |
| **Z-test**                              | So sánh trung bình khi biết độ lệch chuẩn tổng thể |
| **Mann-Whitney U test**                 | Thay thế t-test khi dữ liệu không chuẩn            |
| **Wilcoxon signed-rank test**           | Thay thế paired t-test nếu không chuẩn             |
| **Kruskal-Wallis test**                 | Thay ANOVA khi dữ liệu không phân phối chuẩn       |
| **Kolmogorov–Smirnov test**             | Kiểm tra phân phối chuẩn hay không                 |
| **Shapiro-Wilk / Anderson-Darling**     | Kiểm định chuẩn cho dữ liệu                        |
| **Levene’s test / Bartlett’s test**     | Kiểm tra phương sai đồng nhất (tiền đề cho ANOVA)  |
| **Log-rank test**                       | So sánh thời gian sống giữa 2 nhóm (survival)      |
| **Correlation test (Pearson/Spearman)** | Kiểm tra mối tương quan                            |
## **Tóm tắt chọn kiểm định theo loại dữ liệu:**

| Mục tiêu                     | Loại dữ liệu       | Kiểm định phù hợp                |
| ---------------------------- | ------------------ | -------------------------------- |
| So sánh 1 trung bình         | Liên tục           | One-sample t-test                |
| So sánh 2 nhóm độc lập       | Liên tục           | Two-sample t-test / Mann-Whitney |
| So sánh 2 nhóm liên quan     | Liên tục           | Paired t-test / Wilcoxon         |
| So sánh >2 nhóm              | Liên tục           | ANOVA / Kruskal-Wallis           |
| Mối quan hệ 2 biến phân loại | Phân loại          | Chi-square test                  |
| Mối tương quan               | Liên tục / Thứ bậc | Pearson / Spearman correlation   |
| Kiểm tra phân phối           | Bất kỳ             | Shapiro-Wilk / KS-test           |
# 📌 **4. Tương quan và hồi quy**
## **Tương quan**
Tương quan là **mức độ liên hệ tuyến tính** giữa hai biến. Tuy nhiên, **tương quan không hàm ý nhân quả**.
### **Hệ số tương quan Pearson r**
Dùng khi cả hai biến là liên tục và phân phối gần chuẩn.
$$r = \frac{ \sum (x_i - \bar{x})(y_i - \bar{y}) }{ \sqrt{ \sum (x_i - \bar{x})^2 \cdot \sum (y_i - \bar{y})^2 } }
$$

| Giá trị r | Ý nghĩa                           |
| --------- | --------------------------------- |
| r>0       | Tương quan dương (cùng tăng/giảm) |
| r<0       | Tương quan âm                     |
| r=0       | Không tương quan tuyến tính       |
### **Hệ số tương quan Spearman (rho)**
Dùng khi dữ liệu không chuẩn hoặc là **thứ bậc (ordinal)**.
$$ρ = 1 - \frac{6 \sum d_i^2}{n(n^2 - 1)}$$


- di​: hiệu giữa các hạng của xi​ và yi​
### **Kiểm định tương quan**
- Kiểm định giả thuyết H0: r=0
- Dùng để đánh giá mối liên hệ có **ý nghĩa thống kê** hay không (p-value)

## **Hồi quy tuyến tính (Linear Regression)**
Hồi quy là kỹ thuật **dự đoán một biến (biến phụ thuộc Y)** dựa trên một hoặc nhiều **biến giải thích (X)**.
### **Hồi quy tuyến tính đơn (Simple Linear Regression)**
$$Y = \beta_0 + \beta_1 X + \varepsilon
$$
Trong đó:

| Ký hiệu  | Giải thích             |
| -------- | ---------------------- |
| $$β_0​$$ | intercept (hệ số chặn) |
| $$β_1​$$ | slope (độ dốc)         |
| ε        | sai số                 |

**Mục tiêu:**
- Ước lượng mối quan hệ tuyến tính giữa X và Y
- Dự báo giá trị Y khi biết X
**Đánh giá mô hình:**

|                          |                                              |
| ------------------------ | -------------------------------------------- |
| $$R^2$$                  | phần trăm phương sai Y được giải thích bởi X |
| **p-value** của $$β_1​$$ | kiểm định xem X có ảnh hưởng đến Y           |

### **Hồi quy tuyến tính bội (Multiple Linear Regression)**
Dạng phương trình:
$$Y = \beta_0 + \beta_1 X_1 + \beta_2 X_2 + \dots + \beta_p X_p + \varepsilon
$$
> Dùng khi có nhiều biến độc lập
### Kiểm tra giả định của hồi quy tuyến tính:
1. **Linearity** – Quan hệ giữa X và Y là tuyến tính
2. **Independence** – Dữ liệu độc lập
3. **Homoscedasticity** – Phương sai phần dư đồng đều
4. **Normality** – Phần dư phân phối chuẩn
### **Hồi quy logistic (Logistic Regression)**
Dùng khi biến phụ thuộc là **nhị phân (binary: 0/1, yes/no...)**
Phương trình:
$$\log \left( \frac{p}{1 - p} \right) = \beta_0 + \beta_1 X
$$
> Áp dụng trong phân loại: ví dụ dự đoán khách có rời bỏ không (churn)
### **So sánh tương quan vs hồi quy**

| Tiêu chí         | Tương quan         | Hồi quy                                     |
| ---------------- | ------------------ | ------------------------------------------- |
| Mục tiêu         | Đo mức độ liên hệ  | Mô hình hóa và dự báo                       |
| Kết quả          | Hệ số tương quan r | Phương trình, hệ số hồi quy β               |
| Quan hệ nhân quả | Không              | Có thể (nếu có thiết kế nghiên cứu phù hợp) |

## ✅ Ứng dụng trong Data Analysis

- Tìm mối liên hệ giữa hành vi khách hàng và doanh thu
- Dự đoán giá trị bán hàng theo mùa
- Kiểm tra yếu tố nào ảnh hưởng mạnh đến churn rate
- [[1. Data Analyst/3.2 Phân tích A B test\|3.2 Phân tích A B test]] và các yếu tố tác động đến kết quả
# **Các khái niệm quan trọng khác**

|Khái niệm|Ứng dụng|
|---|---|
|Central Limit Theorem|Mẫu càng lớn → phân phối gần chuẩn hơn|
|Law of Large Numbers|Số liệu thực nghiệm gần đúng kỳ vọng|
|Overfitting|Tránh trong mô hình thống kê và machine learning|
|Bias vs Variance|Cân bằng giữa độ chính xác và độ tổng quát|