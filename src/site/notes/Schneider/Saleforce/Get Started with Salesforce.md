---
{"dg-publish":true,"permalink":"/schneider/saleforce/get-started-with-salesforce/","updated":"2026-04-13T15:51:17.520+07:00"}
---

## 1. Lightning Experience vs. Salesforce Classic
Salesforce có hai giao diện chính, nhưng **Lightning Experience** là ưu tiên hàng đầu vì sự hiện đại và năng suất cao.
- **Lightning Experience:** Giao diện hiện đại, tối ưu hóa cho tốc độ và sự thông minh (có Assistant, biểu đồ trực quan).
- **Salesforce Classic:** Giao diện cũ. Bạn có thể dùng **Switcher** (nhấn vào ảnh profile) để chuyển đổi giữa hai giao diện nếu cần.
## 2. Trang Home – "Trạm điều khiển" mỗi sáng
![home.png](/img/user/Schneider/Saleforce/Img/home.png)
Khi vừa log in, bạn sẽ đáp xuống trang Home với các "vũ khí" lợi hại:
1. **Performance Chart:** Monitor and update your performance to goal.  
2. **Assistant**: Stay on track by seeing the leads and opportunities that require your attention.  
3. **News:** Get insights at a glance on your important accounts.  
4. **Upcoming events:** See the next five meetings on your calendar today.  
5. **Today’s tasks:** See up to five tasks due today.  
6. **Recent records:** Access links to recently viewed records.  
7. **Top deals:** View your top open opportunities in a convenient list.
## 3. Workspace dành cho Opportunity
![opportunities.png](/img/user/Schneider/Saleforce/Img/opportunities.png)
Đây là nơi bạn thực sự "làm việc" với dữ liệu khách hàng:
1. **Highlights Panel**: See important information right at the top of the record.  
2. **Path:** Access customized guidance for each stage in your sales process.  
3. **Composer:** Quickly log a call, create a task, or send an email.  
4. **Activity Timeline:** View emails, tasks, and events, grouped by your next steps and past activity.  
5. **Quick View:** Hover over any linked record to see details without having to leave the page.
## Account & Contact
1. **Highlights Panel:** See important information right at the top of the record.  
2. **News and Twitter Integration:** Stay informed about the latest news that affects your customers and stay connected through social media.  
3. **Optimized template:** Easy reference to related records and at-a-glance information.  
4. **Activity Timeline:** View emails, tasks, and events, grouped by your next steps and past activity.
![Account & Contact.png](/img/user/Schneider/Saleforce/Img/Account%20&%20Contact.png)
## 4. List Views & Kanban – "Thiên đường" của dân Data
 **List Views:** Tạo các bộ lọc (filter) để phân loại khách hàng theo ý muốn. Bạn có thể biến danh sách khô khan thành biểu đồ (**List View Charts**) chỉ trong vài giây.
![List Views.png](/img/user/Schneider/Saleforce/Img/List%20Views.png)

| **Biểu tượng**   | **Tên gọi**            | **Chức năng chính**                                                                                                                              |
| ---------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **(1) Dropdown** | **Menu thả xuống**     | Chuyển đổi nhanh giữa các danh sách đã tạo (ví dụ: "Tất cả cơ hội", "Khách hàng mới tuần này").                                                  |
| **(2) Pin**      | **Ghim danh sách**     | Đặt danh sách hiện tại làm mặc định. Mỗi khi bạn mở đối tượng đó, danh sách này sẽ hiện ra đầu tiên.                                             |
| **(3) Controls** | **Menu điều khiển**    | Nơi để tạo mới, đổi tên, sao chép (clone) hoặc chia sẻ danh sách. Đặc biệt là mục **Select Fields to Display** để chọn các cột dữ liệu muốn xem. |
| **(4) Layouts**  | **Thay đổi giao diện** | Chuyển đổi giữa 3 chế độ: **Table** (Bảng), **Kanban** (Thẻ công việc) hoặc **Split View** (Chia đôi màn hình để duyệt nhanh).                   |
| **(5) Refresh**  | **Làm mới**            | Cập nhật dữ liệu mới nhất mà không cần tải lại (reload) toàn bộ trang web.                                                                       |
| **(6) Edit**     | **Chỉnh sửa nhanh**    | Chế độ **Inline Editing**. Bạn có thể sửa trực tiếp trên danh sách; các ô vừa sửa sẽ hiện màu vàng để nhắc bạn nhấn **Save**.                    |
| **(7) Charts**   | **Biểu đồ**            | Tự động biến dữ liệu trong danh sách thành biểu đồ tròn, cột... để thấy ngay tỷ lệ phần trăm hoặc tổng số liệu.                                  |
| **(8) Filter**   | **Bộ lọc**             | Thêm các điều kiện lọc nâng cao để thu hẹp danh sách (ví dụ: Chỉ hiện các đơn hàng > 100 triệu).                                                 |
- **Kanban View:** Trực quan hóa quy trình dưới dạng các cột. Chỉ cần **kéo và thả (drag & drop)** để cập nhật trạng thái bản ghi.
![Kanban View.png](/img/user/Schneider/Saleforce/Img/Kanban%20View.png)
1. The records in the Kanban view are based on the selected list view.  
2. Easily toggle between the list view grid view and the Kanban view.  
3. Filter your records to view a particular subset of your records.  
4. Search for records within the current view.  
5. Select which record type to view.  
6. Columns are created based on the grouping field.  
7. Change how columns are organized and summarized using Kanban settings.  
8. Quickly move a record to a different column by dragging the card.  
9. For opportunities, alerts tell how to keep a deal on track, for example, create a task or event.

- **Split View:** Vừa xem danh sách bên trái, vừa xem chi tiết bên phải – cực kỳ tiện khi cần duyệt nhanh nhiều task.
## 5. Reports & Dashboards – Sân chơi của Analyst
Khác với List View, **Reports** cho phép bạn thực hiện các phép tính phức tạp, nhóm dữ liệu (grouping) và lọc chuyên sâu hơn
- **Dashboards:** Tổng hợp nhiều biểu đồ (components) lên một trang duy nhất để có cái nhìn tổng quát (Big Picture).
![dashboard.png](/img/user/Schneider/Saleforce/Img/dashboard.png)
- **Inline Editing:** Chỉnh sửa dữ liệu trực tiếp ngay trên báo cáo mà không cần mở từng bản ghi.
## 6. Mẹo tìm kiếm & Điều hướng
- **Global Search:** Thanh tìm kiếm ở trên cùng trang web là cách nhanh nhất để tìm bất cứ thứ gì.
- **Notes:** Công cụ ghi chú có tính năng **Autosave** và rich text, giúp bạn lưu lại thông tin quan trọng ngay trên bản ghi.