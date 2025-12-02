---
{"dg-publish":true,"permalink":"/1-data-analyst/da-course/buoi-1-ask-define-and-structure-analytics-questions/","updated":"2025-12-03T03:10:15.240+07:00"}
---

# DA SOW in RACI Matrix View
Ma trận phân công trách nhiệm, thường được dùng trong **quản lý dự án** để làm rõ **ai làm gì** trong từng nhiệm vụ hoặc hoạt động. Cụ thể:
- **R – Responsible** (Chịu trách nhiệm thực hiện): Người thực hiện công việc. Có thể có nhiều người ở vai trò này.
- **A – Accountable** (Chịu trách nhiệm cuối cùng): Người chịu trách nhiệm chính, là người phê duyệt kết quả cuối cùng. Chỉ nên có 1 người cho mỗi nhiệm vụ.
- **C – Consulted** (Tham vấn): Người được tham vấn trong quá trình thực hiện. Có thể là chuyên gia, các team liên quan.
- **I – Informed** (Được thông báo): Người được thông báo về tiến độ hoặc kết quả, nhưng không tham gia trực tiếp.
![1.1 DA SOW in RACI Matrix view.png](/img/user/1.%20Data%20Analyst/DA%20Course/Img/1.1%20DA%20SOW%20in%20RACI%20Matrix%20view.png)
![1.2 Example DA RACI Matrix.png](/img/user/1.%20Data%20Analyst/DA%20Course/Img/1.2%20Example%20DA%20RACI%20Matrix.png)
# Data Analytics Process
| Bước | Tên giai đoạn                                                                           | Nội dung công việc chính                                                                                                       | Công cụ thường dùng                             |
| ---- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------- |
| 1️⃣  | ASK - **Xác định vấn đề** _(Define the Problem)_                                        | - Hiểu nhu cầu của stakeholder- Đặt câu hỏi phân tích (business question)                                                      | Google Docs, Meeting Notes                      |
| 2️⃣  | PREPARE - **Thu thập dữ liệu** _(Data Collection)_                                      | - Truy xuất dữ liệu từ hệ thống (ERP, CRM, GA, Shopee API, TikTok Affiliate, v.v.)- Kết nối với BigQuery, SQL Server, Excel... | SQL, BigQuery, Python, API, Google Sheets       |
| 3️⃣  | PROCESS - **Làm sạch & xử lý dữ liệu** _(Data Cleaning & Wrangling)_                    | - Xử lý dữ liệu thiếu, định dạng sai- Gộp dữ liệu từ nhiều bảng- Tính các trường mới (feature engineering)                     | SQL, Python (pandas), Excel, dbt                |
| 4️⃣  | ANALYZE - **Phân tích dữ liệu khám phá** _(Exploratory Data Analysis - EDA)_            | - Tìm hiểu xu hướng, sự bất thường- Tính toán KPI cơ bản (Doanh thu, CIR, CR...)- Vẽ biểu đồ trực quan hóa ban đầu             | Python (matplotlib, seaborn), Power BI, Tableau |
| 5️⃣  | VISUALIZE- **Trực quan hóa và kể chuyện dữ liệu** _(Data Visualization & Storytelling)_ | - Xây dựng dashboard theo từng đối tượng người dùng (Marketing, Sales, Finance...)- Kể câu chuyện qua biểu đồ                  | Power BI, Tableau, Google Data Studio           |
| 6️⃣  | SHARE INSIGHTS - **Tạo báo cáo & Đưa đề xuất** _(Reporting & Insights)_                 | - Xuất báo cáo định kỳ (MoM, QoQ)- Đưa ra insight chiến lược (ví dụ: tăng ROAS bằng cách ngừng kênh X, tập trung kênh Y)       | PowerPoint, Power BI Export, Notion             |
| 7️⃣  | ACT - **Hành động & Theo dõi kết quả** _(Action & Monitoring)_                          | - Theo dõi tác động của insight (AB Test, KPI tracking)- Cập nhật dashboard theo nhu cầu thay đổi                              | Power BI, SQL, Slack Alerts                     |
![1.3 Typical DA process.png](/img/user/1.%20Data%20Analyst/DA%20Course/Img/1.3%20Typical%20DA%20process.png)

# Business Model Canvas
| STT | Thành phần                                      | Mô tả ngắn gọn                                            |
| --- | ----------------------------------------------- | --------------------------------------------------------- |
| 1️⃣ | **Customer Segments** (Phân khúc khách hàng)    | Ai là khách hàng mục tiêu? Có bao nhiêu nhóm?             |
| 2️⃣ | **Value Propositions** (Giá trị đề xuất)        | Doanh nghiệp mang lại giá trị gì cho khách hàng?          |
| 3️⃣ | **Channels** (Kênh phân phối)                   | Làm cách nào để tiếp cận và phục vụ khách hàng?           |
| 4️⃣ | **Customer Relationships** (Quan hệ khách hàng) | Doanh nghiệp xây dựng và duy trì mối quan hệ như thế nào? |
| 5️⃣ | **Revenue Streams** (Dòng doanh thu)            | Doanh nghiệp kiếm tiền từ đâu? Mô hình thu tiền ra sao?   |
| 6️⃣ | **Key Resources** (Tài nguyên chính)            | Tài nguyên nào là thiết yếu để vận hành mô hình?          |
| 7️⃣ | **Key Activities** (Hoạt động chính)            | Những việc quan trọng nào cần làm để cung cấp giá trị?    |
| 8️⃣ | **Key Partnerships** (Đối tác chính)            | Ai là người giúp doanh nghiệp hoạt động hiệu quả hơn?     |
| 9️⃣ | **Cost Structure** (Cấu trúc chi phí)           | Chi phí chính để duy trì hoạt động kinh doanh là gì?      |

![1.5 Analyze BMC.png](/img/user/1.%20Data%20Analyst/DA%20Course/Img/1.5%20Analyze%20BMC.png)

![1.6 Layer of data.png](/img/user/1.%20Data%20Analyst/DA%20Course/Img/1.6%20Layer%20of%20data.png)

![1.7 Evaluate analysis project quality.png](/img/user/1.%20Data%20Analyst/DA%20Course/Img/1.7%20Evaluate%20analysis%20project%20quality.png)


![1.8 Framework.png](/img/user/1.%20Data%20Analyst/DA%20Course/Img/1.8%20Framework.png)



![1.9 Framework ask right question.png](/img/user/1.%20Data%20Analyst/DA%20Course/Img/1.9%20Framework%20ask%20right%20question.png)

| Problem                                                                                                                                 | What/How/Why                                                                                                              | Metric                                                                                                                                | Action                                                                                                                       | Goal                                                                                                                      |
| --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
|                                                                                                                                         |                                                                                                                           |                                                                                                                                       |                                                                                                                              |                                                                                                                           |
|                                                                                                                                         |                                                                                                                           |                                                                                                                                       |                                                                                                                              |                                                                                                                           |
|                                                                                                                                         |                                                                                                                           |                                                                                                                                       |                                                                                                                              |                                                                                                                           |
| Problem/Context                                                                                                                         | What/How/Why                                                                                                              | Metric                                                                                                                                | Action                                                                                                                       | Goal                                                                                                                      |
| New user growth rate is stagnant in the last 3 months and budget is reduced                                                             | How do we know if the new promotion scheme for new users is working effectively and cost-efficiently?                     | - Cost per Acquisition (CPA)- Conversion Rate from promo- New user growth rate WoW/MoM                                                | Analyze performance of users who entered through the new promo scheme vs. previousCompare cost-efficiency across channels    | Determine if we can **recover user growth** by end of next month and continue the promo or optimize it further            |
| **Vấn đề / Bối cảnh**                                                                                                                   | **Câu hỏi phân tích (What/How/Why)**                                                                                      | **Chỉ số cần theo dõi (Metric)**                                                                                                      | **Hành động đề xuất**                                                                                                        | **Mục tiêu hướng đến**                                                                                                    |
| Tỷ lệ tăng trưởng người dùng mới đang chững lại trong 3 tháng gần đây, và ngân sách dành cho việc thu hút người dùng mới đã bị cắt giảm | Làm sao để biết chương trình khuyến mãi mới dành cho người dùng mới có hoạt động hiệu quả và tiết kiệm chi phí hay không? | - Chi phí trên mỗi lượt chuyển đổi (CPA)- Tỷ lệ chuyển đổi từ chương trình khuyến mãi- Tốc độ tăng trưởng người dùng mới (tuần/tháng) | So sánh hiệu suất giữa nhóm người dùng có áp dụng khuyến mãi mới và nhóm không cóPhân tích chi phí và hành vi sau chuyển đổi | Đánh giá liệu chương trình khuyến mãi có giúp **phục hồi tốc độ tăng trưởng người dùng mới vào cuối tháng sau** hay không |
# MECI Approaches

![1.10 5 common MECE approach.png](/img/user/1.%20Data%20Analyst/DA%20Course/Img/1.10%205%20common%20MECE%20approach.png)
# Issue tree
![1.11 Issue Tree w MECE.png](/img/user/1.%20Data%20Analyst/DA%20Course/Img/1.11%20Issue%20Tree%20w%20MECE.png)
