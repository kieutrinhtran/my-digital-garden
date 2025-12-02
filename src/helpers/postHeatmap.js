// Helper để tạo dữ liệu heatmap cho bài đăng theo ngày

/**
 * Tạo dữ liệu heatmap cho 1 năm gần nhất
 * @param {Array} notes - Collection of notes
 * @returns {Object} Heatmap data với dates và counts
 */
function generatePostHeatmap(notes) {
  const today = new Date();
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(today.getFullYear() - 1);
  
  // Khởi tạo map cho tất cả các ngày trong năm qua
  const dateMap = new Map();
  const currentDate = new Date(oneYearAgo);
  
  while (currentDate <= today) {
    const dateKey = formatDateKey(currentDate);
    dateMap.set(dateKey, 0);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Đếm số bài đăng theo ngày
  notes.forEach(note => {
    const noteDate = note.date || note.data.date;
    if (!noteDate) return;
    
    const date = new Date(noteDate);
    if (date >= oneYearAgo && date <= today) {
      const dateKey = formatDateKey(date);
      const currentCount = dateMap.get(dateKey) || 0;
      dateMap.set(dateKey, currentCount + 1);
    }
  });
  
  // Chuyển đổi thành array và tính toán intensity
  const heatmapData = [];
  let maxCount = 0;
  
  dateMap.forEach((count, dateKey) => {
    if (count > maxCount) maxCount = count;
    const date = parseDateKey(dateKey);
    heatmapData.push({
      date: dateKey,
      dateObj: date,
      count: count,
      intensity: 0 // Sẽ tính sau
    });
  });
  
  // Tính intensity (0-4 levels)
  heatmapData.forEach(item => {
    if (maxCount === 0) {
      item.intensity = 0;
    } else {
      const ratio = item.count / maxCount;
      if (ratio === 0) item.intensity = 0;
      else if (ratio <= 0.25) item.intensity = 1;
      else if (ratio <= 0.5) item.intensity = 2;
      else if (ratio <= 0.75) item.intensity = 3;
      else item.intensity = 4;
    }
  });
  
  // Sắp xếp theo ngày
  heatmapData.sort((a, b) => a.dateObj - b.dateObj);
  
  return {
    data: heatmapData,
    maxCount: maxCount,
    totalDays: heatmapData.length,
    startDate: oneYearAgo,
    endDate: today
  };
}

/**
 * Format date thành key YYYY-MM-DD
 */
function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse date key thành Date object
 */
function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Nhóm dữ liệu theo tuần để hiển thị heatmap
 */
function groupByWeeks(heatmapData) {
  const weeks = [];
  let currentWeek = [];
  let currentWeekStart = null;
  
  heatmapData.forEach((item, index) => {
    const date = item.dateObj;
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
    
    // Nếu là ngày đầu tuần hoặc item đầu tiên
    if (dayOfWeek === 0 || currentWeekStart === null) {
      if (currentWeek.length > 0) {
        weeks.push(currentWeek);
      }
      currentWeek = [];
      currentWeekStart = date;
    }
    
    // Điền các ngày trống trước ngày hiện tại trong tuần
    if (currentWeek.length > 0) {
      const lastDate = currentWeek[currentWeek.length - 1].dateObj;
      const daysDiff = Math.floor((date - lastDate) / (1000 * 60 * 60 * 24));
      for (let i = 1; i < daysDiff; i++) {
        const emptyDate = new Date(lastDate);
        emptyDate.setDate(emptyDate.getDate() + i);
        currentWeek.push({
          date: formatDateKey(emptyDate),
          dateObj: emptyDate,
          count: 0,
          intensity: 0,
          isEmpty: true
        });
      }
    }
    
    currentWeek.push(item);
  });
  
  // Thêm tuần cuối
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }
  
  // Đảm bảo mỗi tuần có đủ 7 ngày
  weeks.forEach(week => {
    while (week.length < 7) {
      const lastDate = week[week.length - 1]?.dateObj || new Date();
      const nextDate = new Date(lastDate);
      nextDate.setDate(nextDate.getDate() + 1);
      week.push({
        date: formatDateKey(nextDate),
        dateObj: nextDate,
        count: 0,
        intensity: 0,
        isEmpty: true
      });
    }
  });
  
  return weeks;
}

module.exports = {
  generatePostHeatmap,
  groupByWeeks
};

