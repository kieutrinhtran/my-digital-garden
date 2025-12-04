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
 * Tạo dữ liệu heatmap cho 1 tháng gần nhất
 */
function generateMonthHeatmap(notes) {
  const today = new Date();
  const oneMonthAgo = new Date(today);
  oneMonthAgo.setMonth(today.getMonth() - 1);
  
  const dateMap = new Map();
  const currentDate = new Date(oneMonthAgo);
  
  while (currentDate <= today) {
    const dateKey = formatDateKey(currentDate);
    dateMap.set(dateKey, 0);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  notes.forEach(note => {
    const noteDate = note.date || note.data.date;
    if (!noteDate) return;
    
    const date = new Date(noteDate);
    if (date >= oneMonthAgo && date <= today) {
      const dateKey = formatDateKey(date);
      const currentCount = dateMap.get(dateKey) || 0;
      dateMap.set(dateKey, currentCount + 1);
    }
  });
  
  const heatmapData = [];
  let maxCount = 0;
  
  dateMap.forEach((count, dateKey) => {
    if (count > maxCount) maxCount = count;
    const date = parseDateKey(dateKey);
    heatmapData.push({
      date: dateKey,
      dateObj: date,
      count: count,
      intensity: 0
    });
  });
  
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
  
  heatmapData.sort((a, b) => a.dateObj - b.dateObj);
  
  return {
    data: heatmapData,
    maxCount: maxCount,
    totalDays: heatmapData.length,
    startDate: oneMonthAgo,
    endDate: today
  };
}

/**
 * Tạo dữ liệu heatmap cho 1 tuần gần nhất
 */
function generateWeekHeatmap(notes, targetDate = null) {
  // Tính tuần hiện tại (từ thứ 2 đến chủ nhật)
  const referenceDate = targetDate ? new Date(targetDate) : new Date();
  const dayOfWeek = referenceDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  
  // Tính thứ 2 của tuần (nếu là chủ nhật thì lùi 6 ngày, nếu không thì lùi dayOfWeek - 1)
  const monday = new Date(referenceDate);
  if (dayOfWeek === 0) {
    monday.setDate(referenceDate.getDate() - 6); // Chủ nhật -> thứ 2 tuần trước
  } else {
    monday.setDate(referenceDate.getDate() - (dayOfWeek - 1));
  }
  monday.setHours(0, 0, 0, 0);
  
  // Tính chủ nhật của tuần (thứ 2 + 6 ngày)
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  
  const dateMap = new Map();
  const currentDate = new Date(monday);
  
  // Tạo map cho 7 ngày (thứ 2 đến chủ nhật)
  while (currentDate <= sunday) {
    const dateKey = formatDateKey(currentDate);
    dateMap.set(dateKey, 0);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  notes.forEach(note => {
    const noteDate = note.date || note.data.date;
    if (!noteDate) return;
    
    const date = new Date(noteDate);
    date.setHours(0, 0, 0, 0);
    if (date >= monday && date <= sunday) {
      const dateKey = formatDateKey(date);
      const currentCount = dateMap.get(dateKey) || 0;
      dateMap.set(dateKey, currentCount + 1);
    }
  });
  
  const heatmapData = [];
  let maxCount = 0;
  
  dateMap.forEach((count, dateKey) => {
    if (count > maxCount) maxCount = count;
    const date = parseDateKey(dateKey);
    heatmapData.push({
      date: dateKey,
      dateObj: date,
      count: count,
      intensity: 0
    });
  });
  
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
  
  heatmapData.sort((a, b) => a.dateObj - b.dateObj);
  
  return {
    data: heatmapData,
    maxCount: maxCount,
    totalDays: heatmapData.length,
    startDate: monday,
    endDate: sunday
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

/**
 * Tính toán stats cho hôm nay và streak
 */
function calculateTodayStatsAndStreak(notes) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayKey = formatDateKey(today);
  
  // Đếm số bài viết hôm nay
  let todayCount = 0;
  notes.forEach(note => {
    const noteDate = note.date || note.data.date || note.data.updated;
    if (!noteDate) return;
    
    const date = new Date(noteDate);
    date.setHours(0, 0, 0, 0);
    const dateKey = formatDateKey(date);
    
    if (dateKey === todayKey) {
      todayCount++;
    }
  });
  
  // Tính streak (số ngày liên tiếp có bài viết, tính từ hôm nay ngược lại)
  let streak = 0;
  const dateMap = new Map();
  
  // Tạo map tất cả ngày có bài viết
  notes.forEach(note => {
    const noteDate = note.date || note.data.date || note.data.updated;
    if (!noteDate) return;
    
    const date = new Date(noteDate);
    date.setHours(0, 0, 0, 0);
    const dateKey = formatDateKey(date);
    
    if (date <= today) {
      dateMap.set(dateKey, (dateMap.get(dateKey) || 0) + 1);
    }
  });
  
  // Tính streak từ hôm nay ngược lại
  let checkDate = new Date(today);
  while (true) {
    const dateKey = formatDateKey(checkDate);
    if (dateMap.has(dateKey) && dateMap.get(dateKey) > 0) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  // Tính thời gian trung bình (giả sử mỗi bài viết mất 5 phút)
  const avgTimePerPost = 5; // phút
  const todayTime = todayCount * avgTimePerPost;
  
  // Tính pace (giây/bài viết) - giả sử 300 giây = 5 phút mỗi bài
  const pacePerPost = 300; // giây
  const todayPace = todayCount > 0 ? pacePerPost : 0;
  
  // Tính retention (phần trăm ngày có bài viết trong 30 ngày qua)
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  let daysWithPosts = 0;
  let checkRetentionDate = new Date(thirtyDaysAgo);
  while (checkRetentionDate <= today) {
    const dateKey = formatDateKey(checkRetentionDate);
    if (dateMap.has(dateKey) && dateMap.get(dateKey) > 0) {
      daysWithPosts++;
    }
    checkRetentionDate.setDate(checkRetentionDate.getDate() + 1);
  }
  
  const retention = Math.round((daysWithPosts / 30) * 100);
  
  return {
    todayStats: {
      studied: todayCount,
      time: todayTime,
      pace: todayPace,
      retention: retention
    },
    streak: streak
  };
}

module.exports = {
  generatePostHeatmap,
  generateMonthHeatmap,
  generateWeekHeatmap,
  groupByWeeks,
  calculateTodayStatsAndStreak
};

