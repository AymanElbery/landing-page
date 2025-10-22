// ===================================
// Technician Dashboard JavaScript
// Service Marketplace
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ============= Theme Toggle =============
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const htmlElement = document.documentElement;
    
    // Check for saved theme preference or default to 'light'
    const currentTheme = localStorage.getItem('dashboard-theme') || 'light';
    htmlElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('dashboard-theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Re-render charts with new theme
        updateChartsTheme(newTheme);
    });
    
    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }
    
    // ============= Sidebar Toggle =============
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('show');
        
        // For desktop - collapse sidebar
        if (window.innerWidth > 991) {
            sidebar.classList.toggle('collapsed');
        }
    });
    
    // Close sidebar on mobile when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 991) {
            if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                sidebar.classList.remove('show');
            }
        }
    });
    
    // ============= Navigation Active State =============
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Add active class to clicked item
            this.parentElement.classList.add('active');
            
            // Close sidebar on mobile
            if (window.innerWidth <= 991) {
                sidebar.classList.remove('show');
            }
        });
    });
    
    // ============= Charts =============
    const theme = htmlElement.getAttribute('data-theme');
    const chartColors = {
        light: {
            text: '#64748b',
            grid: '#e2e8f0',
            background: '#ffffff'
        },
        dark: {
            text: '#cbd5e1',
            grid: '#334155',
            background: '#1e293b'
        }
    };
    
    // Earnings Chart
    const earningsCtx = document.getElementById('earningsChart');
    let earningsChart = null;
    
    if (earningsCtx) {
        earningsChart = new Chart(earningsCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Earnings',
                    data: [1200, 1900, 1500, 2200, 2800, 2400, 3100, 2900, 3400, 3800, 4200, 5420],
                    borderColor: '#22C55E',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#22C55E',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                        titleColor: theme === 'dark' ? '#f1f5f9' : '#0f172a',
                        bodyColor: theme === 'dark' ? '#cbd5e1' : '#475569',
                        borderColor: theme === 'dark' ? '#334155' : '#e2e8f0',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return '$' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: chartColors[theme].text,
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        },
                        grid: {
                            color: chartColors[theme].grid
                        }
                    },
                    x: {
                        ticks: {
                            color: chartColors[theme].text
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
    
    // Jobs Distribution Chart
    const jobsCtx = document.getElementById('jobsChart');
    let jobsChart = null;
    
    if (jobsCtx) {
        jobsChart = new Chart(jobsCtx, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'In Progress', 'Pending'],
                datasets: [{
                    data: [45, 30, 25],
                    backgroundColor: ['#22C55E', '#38BDF8', '#F59E0B'],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                cutout: '70%',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                        titleColor: theme === 'dark' ? '#f1f5f9' : '#0f172a',
                        bodyColor: theme === 'dark' ? '#cbd5e1' : '#475569',
                        borderColor: theme === 'dark' ? '#334155' : '#e2e8f0',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: true,
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Update charts theme function
    function updateChartsTheme(theme) {
        const colors = chartColors[theme];
        
        if (earningsChart) {
            earningsChart.options.scales.y.ticks.color = colors.text;
            earningsChart.options.scales.y.grid.color = colors.grid;
            earningsChart.options.scales.x.ticks.color = colors.text;
            earningsChart.options.plugins.tooltip.backgroundColor = theme === 'dark' ? '#1e293b' : '#ffffff';
            earningsChart.options.plugins.tooltip.titleColor = theme === 'dark' ? '#f1f5f9' : '#0f172a';
            earningsChart.options.plugins.tooltip.bodyColor = theme === 'dark' ? '#cbd5e1' : '#475569';
            earningsChart.options.plugins.tooltip.borderColor = theme === 'dark' ? '#334155' : '#e2e8f0';
            earningsChart.update();
        }
        
        if (jobsChart) {
            jobsChart.options.plugins.tooltip.backgroundColor = theme === 'dark' ? '#1e293b' : '#ffffff';
            jobsChart.options.plugins.tooltip.titleColor = theme === 'dark' ? '#f1f5f9' : '#0f172a';
            jobsChart.options.plugins.tooltip.bodyColor = theme === 'dark' ? '#cbd5e1' : '#475569';
            jobsChart.options.plugins.tooltip.borderColor = theme === 'dark' ? '#334155' : '#e2e8f0';
            jobsChart.update();
        }
    }
    
    // ============= Counter Animation =============
    const animateCounters = () => {
        const statValues = document.querySelectorAll('.stat-value');
        
        statValues.forEach(stat => {
            const target = stat.textContent;
            const isPrice = target.includes('$');
            const numericValue = parseInt(target.replace(/[^0-9]/g, ''));
            
            let current = 0;
            const increment = numericValue / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= numericValue) {
                    stat.textContent = target;
                    clearInterval(timer);
                } else {
                    if (isPrice) {
                        stat.textContent = '$' + Math.floor(current).toLocaleString();
                    } else {
                        stat.textContent = Math.floor(current);
                    }
                }
            }, 20);
        });
    };
    
    // Trigger counter animation on page load
    animateCounters();
    
    // ============= Search Functionality =============
    const searchInput = document.querySelector('.search-input');
    
    searchInput.addEventListener('input', debounce(function(e) {
        const searchTerm = e.target.value.toLowerCase();
        
        if (searchTerm.length >= 2) {
            // Implement search logic here
            console.log('Searching for:', searchTerm);
            
            // Example: Filter table rows
            const tableRows = document.querySelectorAll('.table-custom tbody tr');
            tableRows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        } else {
            // Show all rows if search term is too short
            const tableRows = document.querySelectorAll('.table-custom tbody tr');
            tableRows.forEach(row => {
                row.style.display = '';
            });
        }
    }, 300));
    
    // ============= Notification Management =============
    const notificationItems = document.querySelectorAll('.notification-item');
    
    notificationItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            this.classList.remove('unread');
            updateNotificationBadge();
        });
    });
    
    function updateNotificationBadge() {
        const unreadCount = document.querySelectorAll('.notification-item.unread').length;
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            badge.textContent = unreadCount;
            if (unreadCount === 0) {
                badge.style.display = 'none';
            } else {
                badge.style.display = 'flex';
            }
        }
    }
    
    // ============= Dropdown Auto Close =============
    const dropdowns = document.querySelectorAll('.dropdown-menu');
    
    document.addEventListener('click', function(e) {
        dropdowns.forEach(dropdown => {
            if (!dropdown.contains(e.target) && !dropdown.previousElementSibling.contains(e.target)) {
                const bsDropdown = bootstrap.Dropdown.getInstance(dropdown.previousElementSibling);
                if (bsDropdown) {
                    bsDropdown.hide();
                }
            }
        });
    });
    
    // ============= Quick Actions =============
    const quickActionBtns = document.querySelectorAll('.quick-action-btn');
    
    quickActionBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const action = this.querySelector('span').textContent;
            console.log('Quick Action:', action);
            
            // Add your action handlers here
            if (action === 'Add New Service') {
                const modal = new bootstrap.Modal(document.getElementById('newServiceModal'));
                modal.show();
            }
        });
    });
    
    // ============= Modal Form Handling =============
    const newServiceModal = document.getElementById('newServiceModal');
    
    if (newServiceModal) {
        newServiceModal.addEventListener('shown.bs.modal', function() {
            // Focus on first input when modal opens
            const firstInput = this.querySelector('input, select, textarea');
            if (firstInput) {
                firstInput.focus();
            }
        });
        
        // Handle form submission
        const modalForm = newServiceModal.querySelector('form');
        if (modalForm) {
            modalForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form data
                const formData = {
                    title: document.getElementById('serviceTitle').value,
                    category: document.getElementById('serviceCategory').value,
                    description: document.getElementById('serviceDescription').value,
                    price: document.getElementById('servicePrice').value
                };
                
                console.log('New Service:', formData);
                
                // Show success message
                showToast('Service added successfully!', 'success');
                
                // Close modal
                const modal = bootstrap.Modal.getInstance(newServiceModal);
                modal.hide();
                
                // Reset form
                modalForm.reset();
            });
        }
    }
    
    // ============= Toast Notifications =============
    function showToast(message, type = 'info') {
        // Create toast container if it doesn't exist
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
            document.body.appendChild(toastContainer);
        }
        
        // Create toast element
        const toastId = 'toast-' + Date.now();
        const toastHTML = `
            <div id="${toastId}" class="toast align-items-center text-white bg-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'} border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body">
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        `;
        
        toastContainer.insertAdjacentHTML('beforeend', toastHTML);
        
        const toastElement = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastElement, {
            autohide: true,
            delay: 3000
        });
        
        toast.show();
        
        // Remove toast element after it's hidden
        toastElement.addEventListener('hidden.bs.toast', function() {
            this.remove();
        });
    }
    
    // ============= Table Actions =============
    const tableButtons = document.querySelectorAll('.table-custom .btn');
    
    tableButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const action = this.textContent.trim();
            const row = this.closest('tr');
            const jobTitle = row.querySelector('h6').textContent;
            
            console.log(`${action} action for: ${jobTitle}`);
            showToast(`${action} ${jobTitle}`, 'info');
        });
    });
    
    // ============= Responsive Handling =============
    function handleResize() {
        const width = window.innerWidth;
        
        // Auto-hide sidebar on mobile
        if (width <= 991) {
            sidebar.classList.remove('show');
            sidebar.classList.remove('collapsed');
        }
    }
    
    window.addEventListener('resize', debounce(handleResize, 250));
    
    // ============= Progress Bars Animation =============
    function animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar-custom');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const width = entry.target.style.width;
                    entry.target.style.width = '0';
                    setTimeout(() => {
                        entry.target.style.width = width;
                    }, 100);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        progressBars.forEach(bar => observer.observe(bar));
    }
    
    animateProgressBars();
    
    // ============= Utility Functions =============
    
    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Format currency
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }
    
    // Format date
    function formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(new Date(date));
    }
    
    // ============= Real-time Updates Simulation =============
    function simulateRealTimeUpdates() {
        // Simulate notification updates every 30 seconds
        setInterval(() => {
            const randomNotification = Math.random() > 0.7;
            if (randomNotification) {
                const currentBadge = document.querySelector('.notification-badge');
                if (currentBadge) {
                    const count = parseInt(currentBadge.textContent) + 1;
                    currentBadge.textContent = count;
                    currentBadge.style.display = 'flex';
                }
            }
        }, 30000);
    }
    
    // Start real-time updates
    // simulateRealTimeUpdates(); // Uncomment to enable
    
    // ============= Keyboard Shortcuts =============
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
        
        // Ctrl/Cmd + N for new service
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            const modal = new bootstrap.Modal(document.getElementById('newServiceModal'));
            modal.show();
        }
        
        // Escape to close sidebar on mobile
        if (e.key === 'Escape' && window.innerWidth <= 991) {
            sidebar.classList.remove('show');
        }
    });
    
    // ============= Page Visibility API =============
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            console.log('Dashboard hidden');
        } else {
            console.log('Dashboard visible - refresh data');
            // Refresh dashboard data when user returns
        }
    });
    
    // ============= Console Welcome Message =============
    console.log('%c🔧 Technician Dashboard', 'color: #22C55E; font-size: 24px; font-weight: bold;');
    console.log('%cService Marketplace - Dashboard v1.0', 'color: #38BDF8; font-size: 14px;');
    console.log('%cKeyboard Shortcuts:\n- Ctrl/Cmd + K: Search\n- Ctrl/Cmd + N: New Service\n- Esc: Close sidebar (mobile)', 'color: #94a3b8; font-size: 12px;');
    
    // ============= Initialize Everything =============
    console.log('✅ Dashboard initialized successfully');
    
});

// ============= Export Functions for Testing =============
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // Export functions for testing
    };
}