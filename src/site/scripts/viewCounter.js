// View Counter - Đếm lượt xem trang
(function() {
    'use strict';
    
    function initViewCounter() {
        const viewCounters = document.querySelectorAll('.view-counter');
        
        viewCounters.forEach(counter => {
            const pageUrl = counter.getAttribute('data-page-url');
            const countElement = counter.querySelector('.view-counter-number');
            
            if (!pageUrl || !countElement) return;
            
            // Lấy view count từ localStorage
            const storageKey = `view_count_${pageUrl}`;
            let viewCount = parseInt(localStorage.getItem(storageKey) || '0', 10);
            
            // Tăng view count
            viewCount++;
            
            // Lưu vào localStorage
            localStorage.setItem(storageKey, viewCount.toString());
            
            // Hiển thị với animation
            animateCount(countElement, 0, viewCount, 500);
        });
    }
    
    function animateCount(element, start, end, duration) {
        const startTime = performance.now();
        const difference = end - start;
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (difference * easeOut));
            
            element.textContent = formatNumber(current);
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = formatNumber(end);
            }
        }
        
        requestAnimationFrame(update);
    }
    
    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initViewCounter);
    } else {
        initViewCounter();
    }
})();

