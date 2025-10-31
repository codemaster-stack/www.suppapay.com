// =================================
// BUSINESS DASHBOARD JAVASCRIPT
// =================================

document.addEventListener('DOMContentLoaded', function() {
    initializeBusinessDashboard();
});

function initializeBusinessDashboard() {
    // Reuse personal dashboard functions
    setupMobileMenu();
    setupAccountDropdown();
    setupUserProfile();
    setupNotifications();
    setupAddAccountModal();
    setupLogout();
    
    // Business-specific functions
    loadBusinessData();
    setupBusinessActions();
    setupTeamManagement();
    setupPeriodSelector();
    setupInvoiceCards();
    setupStockAlerts();
}

// =================================
// LOAD BUSINESS DATA
// =================================

function loadBusinessData() {
    const registrationData = localStorage.getItem('registrationData');
    
    if (!registrationData) {
        console.warn('No user data found');
        return;
    }
    
    const userData = JSON.parse(registrationData);
    
    // Update business name
    const businessNameElement = document.getElementById('businessName');
    if (businessNameElement && userData.businessName) {
        businessNameElement.textContent = userData.businessName;
    }
    
    // Update user profile display
    const userProfileName = document.querySelector('.user-name');
    if (userProfileName && userData.businessName) {
        userProfileName.textContent = userData.businessName;
    }
    
    // Load business metrics (mock data)
    loadBusinessMetrics();
}

function loadBusinessMetrics() {
    // TODO: Replace with actual API call
    const mockMetrics = {
        todayRevenue: '₦450,000',
        weekRevenue: '₦2,450,000',
        weekExpenses: '₦850,000',
        weekProfit: '₦1,600,000',
        weekOrders: 143,
        pendingInvoices: 12,
        activeTeam: 8
    };
    
    console.log('Business metrics loaded:', mockMetrics);
}

// =================================
// BUSINESS QUICK ACTIONS
// =================================

function setupBusinessActions() {
    // Create Invoice
    const createInvoiceBtn = document.getElementById('createInvoiceBtn');
    createInvoiceBtn?.addEventListener('click', function() {
        showToast('Create Invoice', 'Opening invoice creator...', 'info');
        setTimeout(() => {
            window.location.href = 'create-invoice.html';
        }, 1000);
    });
    
    // Create Payment Link
    const createPaymentLinkBtn = document.getElementById('createPaymentLinkBtn');
    createPaymentLinkBtn?.addEventListener('click', function() {
        showToast('Payment Link', 'Opening payment link creator...', 'info');
        setTimeout(() => {
            window.location.href = 'create-payment-link.html';
        }, 1000);
    });
    
    // Pay Employees
    const payEmployeesBtn = document.getElementById('payEmployeesBtn');
    payEmployeesBtn?.addEventListener('click', function() {
        showToast('Payroll', 'Opening payroll system...', 'info');
        setTimeout(() => {
            window.location.href = 'payroll.html';
        }, 1000);
    });
    
    // Bulk Payment
    const bulkPaymentBtn = document.getElementById('bulkPaymentBtn');
    bulkPaymentBtn?.addEventListener('click', function() {
        showToast('Bulk Payment', 'Opening bulk payment...', 'info');
        setTimeout(() => {
            window.location.href = 'bulk-payment.html';
        }, 1000);
    });
    
    // Exchange Button
    const exchangeBtn = document.getElementById('exchangeBtn');
    exchangeBtn?.addEventListener('click', function() {
        showToast('Exchange Currency', 'Opening currency exchange...', 'info');
        setTimeout(() => {
            window.location.href = 'exchange.html';
        }, 1000);
    });
}

// =================================
// TEAM MANAGEMENT
// =================================

function setupTeamManagement() {
    const addTeamMemberBtn = document.getElementById('addTeamMemberBtn');
    
    addTeamMemberBtn?.addEventListener('click', function() {
        showToast('Add Team Member', 'Opening team management...', 'info');
        setTimeout(() => {
            window.location.href = 'team-management.html';
        }, 1000);
    });
}

// =================================
// PERIOD SELECTOR
// =================================

function setupPeriodSelector() {
    const periodSelector = document.querySelector('.period-selector');
    
    periodSelector?.addEventListener('change', function() {
        const period = this.value;
        updateAnalytics(period);
    });
}

function updateAnalytics(period) {
    // TODO: Replace with actual API call
    const metrics = {
        today: { revenue: '₦450,000', expenses: '₦180,000', profit: '₦270,000', orders: 23 },
        week: { revenue: '₦2,450,000', expenses: '₦850,000', profit: '₦1,600,000', orders: 143 },
        month: { revenue: '₦9,800,000', expenses: '₦3,200,000', profit: '₦6,600,000', orders: 587 },
        year: { revenue: '₦115,000,000', expenses: '₦42,000,000', profit: '₦73,000,000', orders: 6842 }
    };
    
    const data = metrics[period];
    
    // Update metric values
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach((card, index) => {
        const valueElement = card.querySelector('.metric-value');
        if (index === 0) valueElement.textContent = data.revenue;
        if (index === 1) valueElement.textContent = data.expenses;
        if (index === 2) valueElement.textContent = data.profit;
        if (index === 3) valueElement.textContent = data.orders.toLocaleString();
    });
    
    showToast('Analytics Updated', `Showing data for: ${period}`, 'success');
}

// =================================
// INVOICE CARDS
// =================================

function setupInvoiceCards() {
    const invoiceCards = document.querySelectorAll('.invoice-card');
    
    invoiceCards.forEach(card => {
        card.addEventListener('click', function() {
            const invoiceNumber = this.querySelector('.invoice-number').textContent;
            showToast('Invoice Details', `Opening ${invoiceNumber}...`, 'info');
            setTimeout(() => {
                window.location.href = `invoice-details.html?id=${invoiceNumber}`;
            }, 1000);
        });
    });
}

// =================================
// STOCK ALERTS
// =================================

function setupStockAlerts() {
    const restockButtons = document.querySelectorAll('.btn-restock');
    
    restockButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const productName = this.closest('.stock-alert-item').querySelector('h4').textContent;
            showToast('Restock Product', `Opening restock form for ${productName}...`, 'info');
            setTimeout(() => {
                window.location.href = 'restock-product.html';
            }, 1000);
        });
    });
}

// =================================
// MOBILE MENU TOGGLE (Reuse from Personal)
// =================================

function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.dashboard-sidebar');
    
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
    
    menuToggle?.addEventListener('click', function() {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
    });
    
    overlay.addEventListener('click', function() {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
    });
    
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
                overlay.classList.remove('active');
            }
        });
    });
}

// =================================
// ACCOUNT DROPDOWN (Reuse from Personal)
// =================================

function setupAccountDropdown() {
    const accountDropdown = document.getElementById('accountDropdown');
    const dropdownBtn = accountDropdown?.querySelector('.account-dropdown-btn');
    const accountOptions = accountDropdown?.querySelectorAll('.account-option');
    
    if (!accountDropdown || !dropdownBtn) return;
    
    dropdownBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        accountDropdown.classList.toggle('open');
    });
    
    document.addEventListener('click', function(e) {
        if (!accountDropdown.contains(e.target)) {
            accountDropdown.classList.remove('open');
        }
    });
    
    accountOptions.forEach(option => {
        option.addEventListener('click', function() {
            accountOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            const flag = this.querySelector('.account-flag').textContent;
            const currency = this.querySelector('.account-currency').textContent;
            const number = this.querySelector('.account-number').textContent;
            const balance = this.querySelector('.account-balance')?.textContent || '₦0';
            
            dropdownBtn.querySelector('.account-flag').textContent = flag;
            dropdownBtn.querySelector('.account-currency').textContent = currency;
            dropdownBtn.querySelector('.account-number').textContent = number;
            document.querySelector('.balance-amount').textContent = balance;
            
            accountDropdown.classList.remove('open');
            showToast('Account switched', `Switched to ${currency}`, 'success');
        });
    });
}

// =================================
// USER PROFILE DROPDOWN
// =================================

function setupUserProfile() {
    const userProfile = document.getElementById('userProfile');
    
    userProfile?.addEventListener('click', function() {
        showToast('Coming Soon', 'User profile menu will be available soon', 'info');
    });
}

// =================================
// NOTIFICATIONS
// =================================

function setupNotifications() {
    const notificationBtn = document.getElementById('notificationBtn');
    
    notificationBtn?.addEventListener('click', function() {
        showToast('Notifications', 'You have 5 new notifications', 'info');
    });
}

// =================================
// ADD ACCOUNT MODAL
// =================================

function setupAddAccountModal() {
    const modal = document.getElementById('addAccountModal');
    const addAccountBtn = document.getElementById('addAccountBtn');
    const closeModal = document.getElementById('closeModal');
    const cancelRequest = document.getElementById('cancelRequest');
    const addAccountForm = document.getElementById('addAccountForm');
    const modalOverlay = modal?.querySelector('.modal-overlay');
    
    addAccountBtn?.addEventListener('click', function() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    function closeModalFunc() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        addAccountForm.reset();
    }
    
    closeModal?.addEventListener('click', closeModalFunc);
    cancelRequest?.addEventListener('click', closeModalFunc);
    modalOverlay?.addEventListener('click', closeModalFunc);
    
    addAccountForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            country: document.getElementById('accountCountry').value,
            reason: document.getElementById('accountReason').value,
            timestamp: new Date().toISOString()
        };
        
        setTimeout(() => {
            const requests = JSON.parse(localStorage.getItem('accountRequests') || '[]');
            requests.push(formData);
            localStorage.setItem('accountRequests', JSON.stringify(requests));
            
            closeModalFunc();
            showToast('Request Submitted', 'Your account request has been sent for admin approval', 'success');
        }, 1000);
    });
}

// =================================
// LOGOUT FUNCTIONALITY
// =================================

function setupLogout() {
    const logoutBtn = document.querySelector('.btn-logout');
    
    logoutBtn?.addEventListener('click', function() {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('registrationData');
            localStorage.removeItem('verificationOTP');
            
            showToast('Logged Out', 'You have been logged out successfully', 'success');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }
    });
}

// =================================
// TOAST NOTIFICATIONS
// =================================

function showToast(title, message, type = 'info') {
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const iconSvg = {
        success: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
        error: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
        info: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
    };
    
    const iconColor = {
        success: '#22c55e',
        error: '#ef4444',
        info: '#3b82f6'
    };
    
    toast.innerHTML = `
        <div class="toast-icon" style="color: ${iconColor[type]}">
            ${iconSvg[type]}
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
    `;
    
    document.body.appendChild(toast);
    
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        toast.style.animation = 'toastSlideIn 0.3s ease-out reverse';
        setTimeout(() => toast.remove(), 300);
    });
    
    setTimeout(() => {
        if (toast.parentElement) {
            toast.style.animation = 'toastSlideIn 0.3s ease-out reverse';
            setTimeout(() => toast.remove(), 300);
        }
    }, 5000);
}

// =================================
// UTILITY FUNCTIONS
// =================================

function formatCurrency(amount, currency = 'NGN') {
    const symbols = {
        'NGN': '₦',
        'USD': '$',
        'GBP': '£',
        'EUR': '€'
    };
    
    const symbol = symbols[currency] || currency;
    return `${symbol}${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
        return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
        return `Yesterday, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
}


// =================================
// BUSINESS ACCOUNT DETAILS
// =================================

function setupBusinessAccountDetails() {
    const toggleBtn = document.getElementById('toggleAccountDetails');
    const hiddenValues = document.querySelectorAll('.detail-value.hidden');
    const copyButtons = document.querySelectorAll('.btn-copy');
    
    let detailsVisible = false;
    
    // Toggle visibility
    toggleBtn?.addEventListener('click', function() {
        detailsVisible = !detailsVisible;
        
        hiddenValues.forEach(value => {
            if (detailsVisible) {
                value.classList.add('visible');
            } else {
                value.classList.remove('visible');
            }
        });
        
        // Update icon
        if (detailsVisible) {
            this.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
            `;
        } else {
            this.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
            `;
        }
    });
    
    // Copy functionality
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-copy');
            const targetElement = document.getElementById(targetId);
            const textToCopy = targetElement.textContent;
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalHTML = this.innerHTML;
                this.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                `;
                this.style.background = '#22c55e';
                
                showToast('Copied!', `${targetElement.previousElementSibling.textContent} copied to clipboard`, 'success');
                
                setTimeout(() => {
                    this.innerHTML = originalHTML;
                    this.style.background = '';
                }, 2000);
            }).catch(err => {
                showToast('Error', 'Failed to copy to clipboard', 'error');
            });
        });
    });
}