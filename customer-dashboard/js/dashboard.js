// ===================================
// Customer Dashboard JavaScript
// Service Marketplace
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ============= Theme Toggle =============
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const htmlElement = document.documentElement;
    
    // Check for saved theme preference or default to 'light'
    const currentTheme = localStorage.getItem('customer-dashboard-theme') || 'light';
    htmlElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('customer-dashboard-theme', newTheme);
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
            grid: '#e9d5ff',
            background: '#ffffff'
        },
        dark: {
            text: '#cbd5e1',
            grid: '#3b2764',
            background: '#1a1525'
        }
    };
    
    // Spending Chart
    const spendingCtx = document.getElementById('spendingChart');
    let spendingChart = null;
    
    if (spendingCtx) {
        spendingChart = new Chart(spendingCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Spending',
                    data: [200, 350, 180, 420, 380, 290, 480, 410, 520, 460, 580, 630],
                    borderColor: '#A855F7',
                    backgroundColor: 'rgba(168, 85, 247, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#A855F7',
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
                        backgroundColor: theme === 'dark' ? '#1a1525' : '#ffffff',
                        titleColor: theme === 'dark' ? '#f1f5f9' : '#0f172a',
                        bodyColor: theme === 'dark' ? '#cbd5e1' : '#475569',
                        borderColor: theme === 'dark' ? '#3b2764' : '#e9d5ff',
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
                                return '$' + value;
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
    
    // Requests Status Chart
    const requestsCtx = document.getElementById('requestsChart');
    let requestsChart = null;
    
    if (requestsCtx) {
        requestsChart = new Chart(requestsCtx, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'In Progress', 'Open'],
                datasets: [{
                    data: [50, 30, 20],
                    backgroundColor: ['#22C55E', '#38BDF8', '#A855F7'],
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
                        backgroundColor: theme === 'dark' ? '#1a1525' : '#ffffff',
                        titleColor: theme === 'dark' ? '#f1f5f9' : '#0f172a',
                        bodyColor: theme === 'dark' ? '#cbd5e1' : '#475569',
                        borderColor: theme === 'dark' ? '#3b2764' : '#e9d5ff',
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
        
        if (spendingChart) {
            spendingChart.options.scales.y.ticks.color = colors.text;
            spendingChart.options.scales.y.grid.color = colors.grid;
            spendingChart.options.scales.x.ticks.color = colors.text;
            spendingChart.options.plugins.tooltip.backgroundColor = theme === 'dark' ? '#1a1525' : '#ffffff';
            spendingChart.options.plugins.tooltip.titleColor = theme === 'dark' ? '#f1f5f9' : '#0f172a';
            spendingChart.options.plugins.tooltip.bodyColor = theme === 'dark' ? '#cbd5e1' : '#475569';
            spendingChart.options.plugins.tooltip.borderColor = theme === 'dark' ? '#3b2764' : '#e9d5ff';
            spendingChart.update();
        }
        
        if (requestsChart) {
            requestsChart.options.plugins.tooltip.backgroundColor = theme === 'dark' ? '#1a1525' : '#ffffff';
            requestsChart.options.plugins.tooltip.titleColor = theme === 'dark' ? '#f1f5f9' : '#0f172a';
            requestsChart.options.plugins.tooltip.bodyColor = theme === 'dark' ? '#cbd5e1' : '#475569';
            requestsChart.options.plugins.tooltip.borderColor = theme === 'dark' ? '#3b2764' : '#e9d5ff';
            requestsChart.update();
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
            if (action === 'Post New Request') {
                const modal = new bootstrap.Modal(document.getElementById('newRequestModal'));
                modal.show();
            }
        });
    });
    
    // ============= Modal Form Handling =============
    const newRequestModal = document.getElementById('newRequestModal');
    const newRequestForm = document.getElementById('newRequestForm');
    
    if (newRequestModal) {
        newRequestModal.addEventListener('shown.bs.modal', function() {
            // Focus on first input when modal opens
            const firstInput = this.querySelector('input, select, textarea');
            if (firstInput) {
                firstInput.focus();
            }
        });
        
        // Handle form submission
        if (newRequestForm) {
            newRequestForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Validate form
                if (!this.checkValidity()) {
                    e.stopPropagation();
                    this.classList.add('was-validated');
                    return;
                }
                
                // Get form data
                const formData = {
                    title: document.getElementById('requestTitle').value,
                    category: document.getElementById('requestCategory').value,
                    description: document.getElementById('requestDescription').value,
                    budgetMin: document.getElementById('requestBudgetMin').value,
                    budgetMax: document.getElementById('requestBudgetMax').value,
                    location: document.getElementById('requestLocation').value,
                    photos: document.getElementById('requestPhotos').files
                };
                
                console.log('New Request:', formData);
                
                // Show success message
                showToast('Request posted successfully! You will receive proposals soon.', 'success');
                
                // Close modal
                const modal = bootstrap.Modal.getInstance(newRequestModal);
                modal.hide();
                
                // Reset form
                newRequestForm.reset();
                newRequestForm.classList.remove('was-validated');
                
                // Update stats (demo)
                updateStatsAfterNewRequest();
            });
        }
    }
    
    // ============= Update Stats After New Request =============
    function updateStatsAfterNewRequest() {
        const totalRequestsStat = document.querySelector('.stat-card:first-child .stat-value');
        if (totalRequestsStat) {
            const currentValue = parseInt(totalRequestsStat.textContent);
            totalRequestsStat.textContent = currentValue + 1;
        }
    }
    
    // ============= Toast Notifications =============
    function showToast(message, type = 'info') {
        // Create toast container if it doesn't exist
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
            toastContainer.style.zIndex = '9999';
            document.body.appendChild(toastContainer);
        }
        
        // Create toast element
        const toastId = 'toast-' + Date.now();
        const iconMap = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        
        const bgMap = {
            success: 'success',
            error: 'danger',
            warning: 'warning',
            info: 'info'
        };
        
        const toastHTML = `
            <div id="${toastId}" class="toast align-items-center text-white bg-${bgMap[type]} border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body">
                        <i class="fas ${iconMap[type]} me-2"></i>${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        `;
        
        toastContainer.insertAdjacentHTML('beforeend', toastHTML);
        
        const toastElement = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastElement, {
            autohide: true,
            delay: 4000
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
            const requestTitle = row.querySelector('h6').textContent;
            
            console.log(`${action} action for: ${requestTitle}`);
            showToast(`Viewing details for: ${requestTitle}`, 'info');
        });
    });
    
    // ============= Technician List Click =============
    const technicianItems = document.querySelectorAll('.technician-item');
    
    technicianItems.forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', function() {
            const techName = this.querySelector('h6').textContent;
            const techRole = this.querySelector('small').textContent;
            showToast(`Viewing profile of ${techName} - ${techRole}`, 'info');
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
    
    // ============= File Upload Preview =============
    const photoInput = document.getElementById('requestPhotos');
    
    if (photoInput) {
        photoInput.addEventListener('change', function(e) {
            const files = Array.from(e.target.files);
            
            if (files.length > 5) {
                showToast('You can only upload up to 5 photos', 'warning');
                this.value = '';
                return;
            }
            
            files.forEach(file => {
                if (!file.type.startsWith('image/')) {
                    showToast('Please upload only image files', 'error');
                    this.value = '';
                }
            });
            
            if (files.length > 0) {
                showToast(`${files.length} photo(s) selected`, 'success');
            }
        });
    }
    
    // ============= Form Validation Enhancement =============
    const formInputs = document.querySelectorAll('.form-control, .form-select');
    
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value) {
                this.classList.add('is-invalid');
            } else {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            }
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('is-invalid') && this.value) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            }
        });
    });
    
    // ============= Budget Validation =============
    const budgetMin = document.getElementById('requestBudgetMin');
    const budgetMax = document.getElementById('requestBudgetMax');
    
    if (budgetMin && budgetMax) {
        budgetMax.addEventListener('blur', function() {
            const min = parseFloat(budgetMin.value);
            const max = parseFloat(budgetMax.value);
            
            if (max < min) {
                showToast('Maximum budget must be greater than minimum budget', 'warning');
                this.value = '';
            }
        });
    }
    
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
        // Simulate notification updates every 45 seconds
        setInterval(() => {
            const randomNotification = Math.random() > 0.6;
            if (randomNotification) {
                const currentBadge = document.querySelector('.notification-badge');
                if (currentBadge) {
                    const count = parseInt(currentBadge.textContent) + 1;
                    currentBadge.textContent = count;
                    currentBadge.style.display = 'flex';
                    
                    // Show toast
                    const messages = [
                        'You received a new proposal!',
                        'New message from technician',
                        'Your request got a response'
                    ];
                    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
                    showToast(randomMessage, 'info');
                }
            }
        }, 45000);
    }
    
    // Start real-time updates (uncomment to enable)
    // simulateRealTimeUpdates();
    
    // ============= Keyboard Shortcuts =============
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
        
        // Ctrl/Cmd + N for new request
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            const modal = new bootstrap.Modal(document.getElementById('newRequestModal'));
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
            updateNotificationBadge();
        }
    });
    
    // ============= Welcome Animation =============
    setTimeout(() => {
        showToast('Welcome back, Sarah! You have 3 new proposals.', 'success');
    }, 1000);
    
    // ============= Console Welcome Message =============
    console.log('%c💜 Customer Dashboard', 'color: #A855F7; font-size: 24px; font-weight: bold;');
    console.log('%cService Marketplace - Customer Dashboard v1.0', 'color: #EC4899; font-size: 14px;');
    console.log('%cKeyboard Shortcuts:\n- Ctrl/Cmd + K: Search\n- Ctrl/Cmd + N: New Request\n- Esc: Close sidebar (mobile)', 'color: #94a3b8; font-size: 12px;');
    
    // ============= Initialize Everything =============
    console.log('✅ Customer Dashboard initialized successfully');
    
    // ============= Error Handling =============
    window.addEventListener('error', function(e) {
        console.error('Global error:', e.error);
        showToast('An error occurred. Please refresh the page.', 'error');
    });
    
    // ============= Service Worker Registration (for PWA support) =============
    if ('serviceWorker' in navigator) {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(reg => console.log('Service Worker registered'))
        //     .catch(err => console.log('Service Worker registration failed'));
    }
});

// ============= Export Functions for Testing =============
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // Export functions for testing
    };
}