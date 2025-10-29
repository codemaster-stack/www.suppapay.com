// ===================================
// LOGIN.JS - LOGIN PAGE FUNCTIONALITY
// ===================================

document.addEventListener('DOMContentLoaded', function() {
  
  // ===================================
  // ELEMENTS
  // ===================================
  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const togglePasswordBtn = document.getElementById('togglePassword');
  const eyeIcon = document.getElementById('eyeIcon');
  const loginButton = document.getElementById('loginButton');
  const errorMessage = document.getElementById('errorMessage');
  const successMessage = document.getElementById('successMessage');
  const rememberMeCheckbox = document.getElementById('rememberMe');

  // ===================================
  // SHOW/HIDE PASSWORD TOGGLE
  // ===================================
  if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener('click', function() {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      
      // Change eye icon
      eyeIcon.textContent = type === 'password' ? '👁️' : '🙈';
    });
  }

  // ===================================
  // HIDE ERROR/SUCCESS MESSAGES ON INPUT
  // ===================================
  [emailInput, passwordInput].forEach(input => {
    if (input) {
      input.addEventListener('input', function() {
        hideMessage(errorMessage);
        hideMessage(successMessage);
        clearError(this.id);
      });
    }
  });

  // ===================================
  // FORM VALIDATION
  // ===================================
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function showError(inputId, message) {
    const errorSpan = document.getElementById(inputId + 'Error');
    const input = document.getElementById(inputId);
    
    if (errorSpan && input) {
      errorSpan.textContent = message;
      input.style.borderColor = '#c33';
    }
  }

  function clearError(inputId) {
    const errorSpan = document.getElementById(inputId + 'Error');
    const input = document.getElementById(inputId);
    
    if (errorSpan && input) {
      errorSpan.textContent = '';
      input.style.borderColor = '';
    }
  }

  function showMessage(element, message, isError = true) {
    if (element) {
      element.querySelector('.alert-text').textContent = message;
      element.style.display = 'flex';
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        hideMessage(element);
      }, 5000);
    }
  }

  function hideMessage(element) {
    if (element) {
      element.style.display = 'none';
    }
  }

  // ===================================
  // FORM SUBMISSION
  // ===================================
  if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Clear previous errors
      clearError('email');
      clearError('password');
      hideMessage(errorMessage);
      hideMessage(successMessage);
      
      // Get form values
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();
      const rememberMe = rememberMeCheckbox.checked;
      
      // Validate inputs
      let hasError = false;
      
      if (!email) {
        showError('email', 'Email is required');
        hasError = true;
      } else if (!validateEmail(email)) {
        showError('email', 'Please enter a valid email address');
        hasError = true;
      }
      
      if (!password) {
        showError('password', 'Password is required');
        hasError = true;
      } else if (password.length < 6) {
        showError('password', 'Password must be at least 6 characters');
        hasError = true;
      }
      
      if (hasError) {
        return;
      }
      
      // Show loading state
      showButtonLoading(loginButton);
      
      try {
        // ===================================
        // SIMULATE API CALL (Replace with real backend later)
        // ===================================
        await simulateLogin(email, password, rememberMe);
        
        // Success
        showMessage(successMessage, 'Login successful! Redirecting to dashboard...', false);
        
        // Store user session (temporary - for frontend testing)
        const userData = {
          email: email,
          loggedIn: true,
          loginTime: new Date().toISOString(),
          rememberMe: rememberMe,
          kycStatus: 'not_started' // Options: not_started, pending, approved, rejected
        };
        
        if (rememberMe) {
          localStorage.setItem('suppapay_user', JSON.stringify(userData));
        } else {
          sessionStorage.setItem('suppapay_user', JSON.stringify(userData));
        }
        
        // Redirect based on KYC status (after 2 seconds)
        setTimeout(() => {
          redirectUser(userData.kycStatus);
        }, 2000);
        
      } catch (error) {
        // Error
        showMessage(errorMessage, error.message || 'Login failed. Please try again.');
        hideButtonLoading(loginButton);
      }
    });
  }

  // ===================================
  // SIMULATE LOGIN API CALL
  // (Replace with real backend API call later)
  // ===================================
  async function simulateLogin(email, password, rememberMe) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate different scenarios
        
        // Test accounts (for frontend testing only - remove in production)
        const testAccounts = {
          'test@suppapay.com': { password: 'test123', kycStatus: 'not_started' },
          'approved@suppapay.com': { password: 'test123', kycStatus: 'approved' },
          'pending@suppapay.com': { password: 'test123', kycStatus: 'pending' }
        };
        
        if (testAccounts[email] && testAccounts[email].password === password) {
          resolve({
            success: true,
            user: {
              email: email,
              kycStatus: testAccounts[email].kycStatus
            }
          });
        } else {
          reject(new Error('Invalid email or password. Please try again.'));
        }
      }, 1500); // Simulate network delay
    });
  }

  // ===================================
  // REDIRECT USER BASED ON KYC STATUS
  // ===================================
  function redirectUser(kycStatus) {
    switch(kycStatus) {
      case 'not_started':
        // User hasn't done KYC - redirect to KYC selection or KYC form
        window.location.href = 'personal-kyc.html'; // or 'kyc-selection.html'
        break;
        
      case 'pending':
        // KYC submitted but pending approval - go to dashboard with limited access
        window.location.href = 'dashboard.html';
        break;
        
      case 'approved':
        // KYC approved - full dashboard access
        window.location.href = 'dashboard.html';
        break;
        
      case 'rejected':
        // KYC rejected - go to KYC resubmission page
        window.location.href = 'personal-kyc.html?resubmit=true';
        break;
        
      default:
        // Default to dashboard
        window.location.href = 'dashboard.html';
    }
  }

  // ===================================
  // CHECK IF USER IS ALREADY LOGGED IN
  // ===================================
  function checkExistingSession() {
    const userData = localStorage.getItem('suppapay_user') || sessionStorage.getItem('suppapay_user');
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.loggedIn) {
          // User is already logged in - redirect to dashboard
          showMessage(successMessage, 'You are already logged in. Redirecting...', false);
          setTimeout(() => {
            window.location.href = 'dashboard.html';
          }, 1500);
        }
      } catch (e) {
        // Invalid session data - clear it
        localStorage.removeItem('suppapay_user');
        sessionStorage.removeItem('suppapay_user');
      }
    }
  }

  // Check for existing session on page load
  checkExistingSession();

  // ===================================
  // AUTO-FILL EMAIL IF COMING FROM REGISTRATION
  // ===================================
  const urlParams = new URLSearchParams(window.location.search);
  const emailParam = urlParams.get('email');
  
  if (emailParam && emailInput) {
    emailInput.value = emailParam;
    passwordInput.focus();
  }

  // ===================================
  // CONSOLE MESSAGE
  // ===================================
  console.log('%c Login Page Loaded! 🔐', 'color: #1E3A8A; font-size: 14px; font-weight: bold;');
  console.log('%c Test Accounts (Frontend Only):', 'color: #FF6B00; font-size: 12px;');
  console.log('test@suppapay.com / test123 - New user (no KYC)');
  console.log('approved@suppapay.com / test123 - Approved KYC');
  console.log('pending@suppapay.com / test123 - Pending KYC');
  
});