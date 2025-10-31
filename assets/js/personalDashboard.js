// =================================
// PERSONAL DASHBOARD JAVASCRIPT
// =================================

document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    // Mobile menu toggle
    setupMobileMenu();
    
    // Account dropdown
    setupAccountDropdown();
    
    // User profile dropdown (for future)
    setupUserProfile();
    
    // Notifications (for future)
    setupNotifications();
    
    // Add Account Modal
    setupAddAccountModal();
    
    // Load user data
    loadUserData();
    
    // Quick send buttons
    setupQuickSendButtons();
    
    // Logout functionality
    setupLogout();
    
    // Account details
    setupAccountDetails();
}
// =================================
// MOBILE MENU TOGGLE
// =================================

function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.dashboard-sidebar');
    
    // Create overlay for mobile
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
    
    // Close sidebar when clicking nav item on mobile
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
// ACCOUNT DROPDOWN
// =================================

function setupAccountDropdown() {
    const accountDropdown = document.getElementById('accountDropdown');
    const dropdownBtn = accountDropdown?.querySelector('.account-dropdown-btn');
    const accountOptions = accountDropdown?.querySelectorAll('.account-option');
    
    if (!accountDropdown || !dropdownBtn) return;
    
    // Toggle dropdown
    dropdownBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        accountDropdown.classList.toggle('open');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!accountDropdown.contains(e.target)) {
            accountDropdown.classList.remove('open');
        }
    });
    
    // Switch account
    accountOptions.forEach(option => {
        option.addEventListener('click', function() {
            if (this.classList.contains('pending')) {
                showToast('Account pending approval', 'This account is waiting for admin approval', 'info');
                return;
            }
            
            // Remove active from all
            accountOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active to clicked
            this.classList.add('active');
            
            // Update display
            const flag = this.querySelector('.account-flag').textContent;
            const currency = this.querySelector('.account-currency').textContent;
            const number = this.querySelector('.account-number').textContent;
            const balance = this.querySelector('.account-balance')?.textContent || '₦0';
            
            dropdownBtn.querySelector('.account-flag').textContent = flag;
            dropdownBtn.querySelector('.account-currency').textContent = currency;
            dropdownBtn.querySelector('.account-number').textContent = number;
            
            // Update balance display
            document.querySelector('.balance-amount').textContent = balance;
            
            // Close dropdown
            accountDropdown.classList.remove('open');
            
            // Show success toast
            showToast('Account switched', `Switched to ${currency}`, 'success');
            
            // Reload transactions for this account (mock)
            loadTransactionsForAccount(currency);
        });
    });
}

// =================================
// USER PROFILE DROPDOWN (Future Feature)
// =================================

function setupUserProfile() {
    const userProfile = document.getElementById('userProfile');
    
    userProfile?.addEventListener('click', function() {
        // TODO: Implement user profile dropdown
        showToast('Coming Soon', 'User profile menu will be available soon', 'info');
    });
}

// =================================
// NOTIFICATIONS (Future Feature)
// =================================

function setupNotifications() {
    const notificationBtn = document.getElementById('notificationBtn');
    
    notificationBtn?.addEventListener('click', function() {
        // TODO: Implement notifications dropdown
        showToast('Notifications', 'You have 3 new notifications', 'info');
    });
}

// =================================
// ADD ACCOUNT MODAL
// =================================

function setupAddAccountModal() {
    const modal = document.getElementById('addAccountModal');
    const addAccountBtn = document.getElementById('addAccountBtn');
    const requestAccountBtn = document.getElementById('requestAccountBtn');
    const closeModal = document.getElementById('closeModal');
    const cancelRequest = document.getElementById('cancelRequest');
    const addAccountForm = document.getElementById('addAccountForm');
    const modalOverlay = modal?.querySelector('.modal-overlay');
    
    // Open modal
    [addAccountBtn, requestAccountBtn].forEach(btn => {
        btn?.addEventListener('click', function() {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close modal function
    function closeModalFunc() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        addAccountForm.reset();
    }
    
    // Close modal events
    closeModal?.addEventListener('click', closeModalFunc);
    cancelRequest?.addEventListener('click', closeModalFunc);
    modalOverlay?.addEventListener('click', closeModalFunc);
    
    // Handle form submission
    addAccountForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        
        // Show loading
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-flex';
        submitBtn.disabled = true;
        
        const formData = {
            country: document.getElementById('accountCountry').value,
            reason: document.getElementById('accountReason').value,
            timestamp: new Date().toISOString()
        };
        
        // Simulate API call
        setTimeout(() => {
            console.log('Account request submitted:', formData);
            
            // Save to localStorage (mock)
            const requests = JSON.parse(localStorage.getItem('accountRequests') || '[]');
            requests.push(formData);
            localStorage.setItem('accountRequests', JSON.stringify(requests));
            
            // Reset button
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
            submitBtn.disabled = false;
            
            // Close modal
            closeModalFunc();
            
            // Show success toast
            showToast('Request Submitted', 'Your account request has been sent for admin approval', 'success');
            
            // Add pending account to dropdown (mock)
            addPendingAccountToDropdown(formData.country);
        }, 2000);
    });
}

function addPendingAccountToDropdown(countryCode) {
    const dropdown = document.querySelector('.account-dropdown-menu');
    const addBtn = dropdown.querySelector('.btn-add-account');
    
    const countryMap = {
        'US': { flag: '🇺🇸', name: 'USD Account' },
        'GB': { flag: '🇬🇧', name: 'GBP Account' },
        'EU': { flag: '🇪🇺', name: 'EUR Account' },
        'CA': { flag: '🇨🇦', name: 'CAD Account' },
        'AU': { flag: '🇦🇺', name: 'AUD Account' },
        'GH': { flag: '🇬🇭', name: 'GHS Account' },
        'KE': { flag: '🇰🇪', name: 'KES Account' },
        'ZA': { flag: '🇿🇦', name: 'ZAR Account' },
        'IN': { flag: '🇮🇳', name: 'INR Account' },
        'CN': { flag: '🇨🇳', name: 'CNY Account' }
    };
    
    const country = countryMap[countryCode];
    if (!country) return;
    
    const pendingOption = document.createElement('div');
    pendingOption.className = 'account-option pending';
    pendingOption.innerHTML = `
        <span class="account-flag">${country.flag}</span>
        <div class="account-details">
            <span class="account-currency">${country.name}</span>
            <span class="account-status">Pending Approval</span>
        </div>
    `;
    
    dropdown.insertBefore(pendingOption, addBtn);
}

// =================================
// LOAD USER DATA
// =================================

function loadUserData() {
    // Check if user is logged in
    const registrationData = localStorage.getItem('registrationData');
    
    if (!registrationData) {
        // No user data, redirect to login
        console.warn('No user data found');
        // window.location.href = 'login.html';
        return;
    }
    
    const userData = JSON.parse(registrationData);
    
    // Update user name in welcome message
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        const firstName = userData.firstName || userData.yourName || 'User';
        userNameElement.textContent = firstName;
    }
    
    // Update user profile display
    const userProfileName = document.querySelector('.user-name');
    const userProfileRole = document.querySelector('.user-role');
    
    if (userProfileName) {
        if (userData.accountType === 'personal') {
            userProfileName.textContent = `${userData.firstName || ''} ${userData.lastName || ''}`.trim();
            userProfileRole.textContent = 'Personal Account';
        } else {
            userProfileName.textContent = userData.businessName || 'Business User';
            userProfileRole.textContent = 'Business Account';
        }
    }
    
    // Mock: Load account balances from localStorage or API
    loadAccountBalances();
}

function loadAccountBalances() {
    // TODO: Replace with actual API call
    const mockBalances = {
        'NGN': { amount: '₦250,000.00', usd: '$380.50' },
        'USD': { amount: '$1,500.00', usd: '$1,500.00' },
        'GBP': { amount: '£850.00', usd: '$1,120.00' }
    };
    
    // Update display based on selected account
    const selectedAccount = document.querySelector('.account-option.active .account-currency')?.textContent;
    if (selectedAccount && mockBalances[selectedAccount.split(' ')[0]]) {
        const balance = mockBalances[selectedAccount.split(' ')[0]];
        document.querySelector('.balance-amount').textContent = balance.amount;
        document.querySelector('.balance-usd').textContent = `≈ ${balance.usd} USD`;
    }
}

// =================================
// QUICK SEND BUTTONS
// =================================

function setupQuickSendButtons() {
    const quickSendButtons = document.querySelectorAll('.btn-send-quick');
    
    quickSendButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const beneficiary = this.closest('.beneficiary-item');
            const name = beneficiary.querySelector('.beneficiary-info h4').textContent;
            
            // TODO: Open send money modal with beneficiary pre-selected
            showToast('Quick Send', `Opening send money for ${name}`, 'info');
            
            // For now, redirect to send money page
            setTimeout(() => {
                window.location.href = 'send-money.html';
            }, 1000);
        });
    });
}

// =================================
// LOGOUT FUNCTIONALITY
// =================================

function setupLogout() {
    const logoutBtn = document.querySelector('.btn-logout');
    
    logoutBtn?.addEventListener('click', function() {
        // Confirm logout
        if (confirm('Are you sure you want to logout?')) {
            // Clear user data
            localStorage.removeItem('registrationData');
            localStorage.removeItem('verificationOTP');
            
            showToast('Logged Out', 'You have been logged out successfully', 'success');
            
            // Redirect to login page
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }
    });
}

// =================================
// LOAD TRANSACTIONS FOR ACCOUNT
// =================================

function loadTransactionsForAccount(currency) {
    // TODO: Replace with actual API call
    console.log(`Loading transactions for ${currency}`);
    
    // Mock: Show loading state
    const transactionsList = document.querySelector('.transactions-list');
    if (transactionsList) {
        transactionsList.style.opacity = '0.5';
        
        setTimeout(() => {
            transactionsList.style.opacity = '1';
            showToast('Transactions Updated', `Showing transactions for ${currency}`, 'success');
        }, 500);
    }
}

// =================================
// TOAST NOTIFICATIONS
// =================================

function showToast(title, message, type = 'info') {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());
    
    // Create toast
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
    
    // Close button
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        toast.style.animation = 'toastSlideIn 0.3s ease-out reverse';
        setTimeout(() => toast.remove(), 300);
    });
    
    // Auto remove after 5 seconds
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

// Format currency
function formatCurrency(amount, currency = 'NGN') {
    const symbols = {
        'NGN': '₦',
        'USD': '$',
        'GBP': '£',
        'EUR': '€',
        'CAD': '$',
        'AUD': '$'
    };
    
    const symbol = symbols[currency] || currency;
    return `${symbol}${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Format date
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

// Check KYC status and show banner if incomplete
function checkKYCStatus() {
    const kycCompleted = localStorage.getItem('kycCompleted');
    
    if (!kycCompleted || kycCompleted !== 'true') {
        showKYCBanner();
    }
}

function showKYCBanner() {
    const welcomeSection = document.querySelector('.welcome-section');
    
    const kycBanner = document.createElement('div');
    kycBanner.className = 'kyc-warning-banner';
    kycBanner.style.cssText = `
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        color: white;
        padding: 20px 30px;
        border-radius: 12px;
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
    `;
    
    kycBanner.innerHTML = `
        <div>
            <h4 style="margin: 0 0 5px 0; font-size: 16px; font-weight: 700;">Complete Your KYC Verification</h4>
            <p style="margin: 0; font-size: 14px; opacity: 0.95;">Verify your identity to unlock all features and increase your limits</p>
        </div>
        <a href="kyc.html" style="background: white; color: #d97706; padding: 10px 24px; border-radius: 8px; font-weight: 600; text-decoration: none; white-space: nowrap; transition: all 0.3s ease;">
            Verify Now
        </a>
    `;
    
    welcomeSection.insertBefore(kycBanner, welcomeSection.firstChild);

    
}

// Initialize KYC check
setTimeout(checkKYCStatus, 1000);

// =================================
// ACCOUNT DETAILS FUNCTIONALITY
// =================================

function setupAccountDetails() {
    const toggleBtn = document.getElementById('toggleAccountDetails');
    const hiddenValues = document.querySelectorAll('.detail-value.hidden');
    const copyButtons = document.querySelectorAll('.btn-copy');
    const exchangeBtn = document.getElementById('exchangeBtn');
    
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
            
            // Copy to clipboard
            navigator.clipboard.writeText(textToCopy).then(() => {
                // Show success feedback
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
    
    // Exchange button
    exchangeBtn?.addEventListener('click', function() {
        // TODO: Open exchange modal or navigate to exchange page
        showToast('Exchange Currency', 'Opening currency exchange...', 'info');
        setTimeout(() => {
            window.location.href = 'exchange.html';
        }, 1000);
    });
}

// Add to initialization
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupAccountDetails(); // ADD THIS LINE
});