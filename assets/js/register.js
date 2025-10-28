// ===================================
// REGISTER.JS - REGISTRATION LOGIC
// Used by: register-step1.html, register-step2.html, register-step3.html
// Dependencies: main.js (must be loaded first)
// ===================================

// ===================================
// DETECT CURRENT STEP
// ===================================
const currentPage = window.location.pathname;
const isStep1 = currentPage.includes('step1');
const isStep2 = currentPage.includes('step2');
const isStep3 = currentPage.includes('step3');

// ===================================
// STEP 1: ACCOUNT TYPE SELECTION
// ===================================
if (isStep1) {
  console.log('Step 1: Account Type Selection initialized');
  
  // Handle account type selection
  const selectButtons = document.querySelectorAll('.btn-select');
  
  selectButtons.forEach(button => {
    button.addEventListener('click', function() {
      const accountType = this.getAttribute('data-account-type');
      
      // Store account type in sessionStorage
      sessionStorage.setItem('accountType', accountType);
      
      console.log(`Account type selected: ${accountType}`);
      
      // Redirect to Step 2 with account type parameter
      window.location.href = `register-step2.html?type=${accountType}`;
    });
  });
  
  // Make entire card clickable
  const accountCards = document.querySelectorAll('.account-card');
  
  accountCards.forEach(card => {
    card.addEventListener('click', function(e) {
      // Don't trigger if clicking on the button directly
      if (e.target.closest('.btn-select')) return;
      
      const button = this.querySelector('.btn-select');
      button.click();
    });
  });
}

// ===================================
// STEP 2: REGISTRATION FORM
// ===================================
if (isStep2) {
  console.log('Step 2: Registration Form initialized');
  
  // Get account type from URL or sessionStorage
  const urlParams = new URLSearchParams(window.location.search);
  const accountType = urlParams.get('type') || sessionStorage.getItem('accountType') || 'personal';
  
  console.log(`Account type: ${accountType}`);
  
  // Update form header based on account type
  const formHeader = document.querySelector('.form-header h2');
  if (formHeader) {
    if (accountType === 'business') {
      formHeader.textContent = 'Create Your Business Account';
    } else {
      formHeader.textContent = 'Create Your Personal Account';
    }
  }
  
  // Password visibility toggle
  const passwordToggles = document.querySelectorAll('.password-toggle');
  
  passwordToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      const input = this.previousElementSibling;
      const icon = this.querySelector('svg');
      
      if (input.type === 'password') {
        input.type = 'text';
        // Change icon to "eye-off" (you can update SVG here)
      } else {
        input.type = 'password';
        // Change icon to "eye" (you can update SVG here)
      }
    });
  });
  
  // Password strength checker
  const passwordInput = document.getElementById('password');
  const strengthFill = document.querySelector('.strength-fill');
  const strengthText = document.querySelector('.strength-text');
  const requirementsList = document.querySelectorAll('.password-requirements li');
  
  if (passwordInput) {
    passwordInput.addEventListener('input', function() {
      const password = this.value;
      const strength = calculatePasswordStrength(password);
      
      // Update strength bar
      if (strengthFill) {
        strengthFill.className = 'strength-fill';
        strengthFill.classList.add(strength.level);
      }
      
      // Update strength text
      if (strengthText) {
        strengthText.textContent = strength.text;
        strengthText.className = 'strength-text';
        strengthText.classList.add(strength.level);
      }
      
      // Update requirements checklist
      updatePasswordRequirements(password);
    });
  }
  
  function calculatePasswordStrength(password) {
    let score = 0;
    
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    
    if (score <= 2) {
      return { level: 'weak', text: 'Weak Password' };
    } else if (score <= 4) {
      return { level: 'medium', text: 'Medium Password' };
    } else {
      return { level: 'strong', text: 'Strong Password' };
    }
  }
  
  function updatePasswordRequirements(password) {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^a-zA-Z0-9]/.test(password)
    };
    
    const requirementElements = document.querySelectorAll('.password-requirements li');
    
    requirementElements.forEach((element, index) => {
      const requirement = Object.values(requirements)[index];
      if (requirement) {
        element.classList.add('valid');
      } else {
        element.classList.remove('valid');
      }
    });
  }
  
  // Confirm password validation
  const confirmPasswordInput = document.getElementById('confirmPassword');
  
  if (confirmPasswordInput && passwordInput) {
    confirmPasswordInput.addEventListener('input', function() {
      const errorMsg = this.parentElement.querySelector('.error-message');
      
      if (this.value && this.value !== passwordInput.value) {
        this.classList.add('is-invalid');
        this.classList.remove('is-valid');
        if (errorMsg) errorMsg.textContent = 'Passwords do not match';
      } else if (this.value === passwordInput.value && this.value !== '') {
        this.classList.add('is-valid');
        this.classList.remove('is-invalid');
        if (errorMsg) errorMsg.textContent = '';
      } else {
        this.classList.remove('is-valid', 'is-invalid');
        if (errorMsg) errorMsg.textContent = '';
      }
    });
  }
  
  // Email validation
  const emailInput = document.getElementById('email');
  
  if (emailInput) {
    emailInput.addEventListener('blur', function() {
      const errorMsg = this.parentElement.querySelector('.error-message');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (this.value && !emailRegex.test(this.value)) {
        this.classList.add('is-invalid');
        this.classList.remove('is-valid');
        if (errorMsg) errorMsg.textContent = 'Please enter a valid email address';
      } else if (this.value) {
        this.classList.add('is-valid');
        this.classList.remove('is-invalid');
        if (errorMsg) errorMsg.textContent = '';
      }
    });
  }
  
  // Phone number validation (basic)
  const phoneInput = document.getElementById('phone');
  
  if (phoneInput) {
    phoneInput.addEventListener('input', function() {
      // Remove non-numeric characters
      this.value = this.value.replace(/[^0-9]/g, '');
    });
  }
  
  // Form submission
  const registrationForm = document.getElementById('registrationForm');
  
  if (registrationForm) {
    registrationForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Validate all required fields
      const isValid = validateForm(this);
      
      if (!isValid) {
        alert('Please fill in all required fields correctly');
        return;
      }
      
      // Get form data
      const formData = new FormData(this);
      const data = Object.fromEntries(formData);
      
      // Add account type
      data.accountType = accountType;
      
      // Store email in sessionStorage for Step 3
      sessionStorage.setItem('userEmail', data.email);
      
      console.log('Form data:', data);
      
      // Show loading state
      const submitBtn = document.getElementById('submitBtn');
      const btnText = submitBtn.querySelector('.btn-text');
      const btnLoader = submitBtn.querySelector('.btn-loader');
      
      submitBtn.disabled = true;
      btnText.style.display = 'none';
      btnLoader.style.display = 'inline-block';
      
      try {
        // Simulate API call (replace with actual backend call)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // TODO: Send data to backend
        // const response = await fetch('/api/register', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(data)
        // });
        
        // Redirect to Step 3 (email verification)
        window.location.href = `register-step3.html?email=${encodeURIComponent(data.email)}`;
        
      } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed. Please try again.');
        
        // Reset button state
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
      }
    });
  }
  
  function validateForm(form) {
    let isValid = true;
    
    // Check required fields
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        field.classList.add('is-invalid');
        isValid = false;
      }
    });
    
    // Check password match
    if (passwordInput && confirmPasswordInput) {
      if (passwordInput.value !== confirmPasswordInput.value) {
        confirmPasswordInput.classList.add('is-invalid');
        isValid = false;
      }
    }
    
    // Check terms agreement
    const termsCheckbox = document.getElementById('termsCheckbox');
    const privacyCheckbox = document.getElementById('privacyCheckbox');
    
    if (termsCheckbox && !termsCheckbox.checked) {
      alert('Please agree to the Terms & Conditions');
      isValid = false;
    }
    
    if (privacyCheckbox && !privacyCheckbox.checked) {
      alert('Please agree to the Privacy Policy');
      isValid = false;
    }
    
    return isValid;
  }
  
  // Back button
  const backBtn = document.querySelector('.btn-back');
  if (backBtn) {
    backBtn.addEventListener('click', function() {
      window.location.href = 'register-step1.html';
    });
  }
}

// ===================================
// STEP 3: EMAIL VERIFICATION (OTP)
// ===================================
if (isStep3) {
  console.log('Step 3: Email Verification initialized');
  
  // Get email from URL parameter or sessionStorage
  const urlParams = new URLSearchParams(window.location.search);
  const userEmail = urlParams.get('email') || sessionStorage.getItem('userEmail') || 'your@email.com';
  
  const emailDisplay = document.getElementById('userEmail');
  if (emailDisplay) {
    emailDisplay.textContent = userEmail;
  }
  
  // OTP Input Handler
  const otpInputs = document.querySelectorAll('.otp-input');
  
  otpInputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
      const value = e.target.value;
      
      // Only allow numbers
      if (!/^\d$/.test(value)) {
        e.target.value = '';
        return;
      }
      
      // Move to next input
      if (value && index < otpInputs.length - 1) {
        otpInputs[index + 1].focus();
      }
    });
    
    input.addEventListener('keydown', (e) => {
      // Move to previous input on backspace
      if (e.key === 'Backspace' && !e.target.value && index > 0) {
        otpInputs[index - 1].focus();
      }
      
      // Move to next input on arrow right
      if (e.key === 'ArrowRight' && index < otpInputs.length - 1) {
        otpInputs[index + 1].focus();
      }
      
      // Move to previous input on arrow left
      if (e.key === 'ArrowLeft' && index > 0) {
        otpInputs[index - 1].focus();
      }
    });
    
    // Handle paste
    input.addEventListener('paste', (e) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData('text').trim();
      
      if (/^\d{6}$/.test(pastedData)) {
        pastedData.split('').forEach((char, i) => {
          if (otpInputs[i]) {
            otpInputs[i].value = char;
          }
        });
        otpInputs[5].focus();
      }
    });
  });
  
  // Resend Timer
  let resendTimer = 60;
  let timerInterval;
  
  function startResendTimer() {
    const resendBtn = document.getElementById('resendBtn');
    const timerSpan = document.getElementById('resendTimer');
    
    if (!resendBtn || !timerSpan) return;
    
    resendBtn.disabled = true;
    
    timerInterval = setInterval(() => {
      resendTimer--;
      timerSpan.textContent = `(${resendTimer}s)`;
      
      if (resendTimer <= 0) {
        clearInterval(timerInterval);
        resendBtn.disabled = false;
        timerSpan.textContent = '';
        resendTimer = 60;
      }
    }, 1000);
  }
  
  // Start timer on page load
  startResendTimer();
  
  // Resend Code Handler
  const resendBtn = document.getElementById('resendBtn');
  if (resendBtn) {
    resendBtn.addEventListener('click', function() {
      if (this.disabled) return;
      
      console.log('Resending verification code to:', userEmail);
      
      // TODO: Call backend to resend OTP
      // fetch('/api/resend-otp', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email: userEmail })
      // });
      
      alert('Verification code resent to ' + userEmail);
      startResendTimer();
      
      // Clear OTP inputs
      otpInputs.forEach(input => input.value = '');
      otpInputs[0].focus();
    });
  }
  
  // Form Submit Handler
  const verificationForm = document.getElementById('verificationForm');
  
  if (verificationForm) {
    verificationForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Get OTP value
      const otp = Array.from(otpInputs).map(input => input.value).join('');
      const errorMsg = document.getElementById('otpError');
      
      // Validate OTP
      if (otp.length !== 6) {
        if (errorMsg) errorMsg.textContent = 'Please enter all 6 digits';
        otpInputs[0].focus();
        return;
      }
      
      console.log('OTP submitted:', otp);
      
      // Show loading state
      const verifyBtn = document.getElementById('verifyBtn');
      const btnText = verifyBtn.querySelector('.btn-text');
      const btnLoader = verifyBtn.querySelector('.btn-loader');
      
      verifyBtn.disabled = true;
      btnText.style.display = 'none';
      btnLoader.style.display = 'inline-block';
      
      try {
        // Simulate API call (replace with actual backend call)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // TODO: Verify OTP with backend
        // const response = await fetch('/api/verify-otp', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ email: userEmail, otp: otp })
        // });
        
        // For demo: accept any 6-digit code
        console.log('OTP verified successfully');
        
        // Clear sessionStorage
        sessionStorage.removeItem('accountType');
        sessionStorage.removeItem('userEmail');
        
        // Success - redirect to dashboard or login
        alert('Email verified successfully! Redirecting to dashboard...');
        // window.location.href = 'dashboard.html';
        // Or redirect to login: window.location.href = 'login.html';
        
      } catch (error) {
        console.error('Verification error:', error);
        
        if (errorMsg) {
          errorMsg.textContent = 'Invalid verification code. Please try again.';
        }
        
        // Clear OTP inputs
        otpInputs.forEach(input => {
          input.value = '';
          input.classList.add('is-invalid');
        });
        otpInputs[0].focus();
        
        // Reset button state
        verifyBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
      }
    });
  }
  
  // Back button
  const backBtn = document.querySelector('.btn-back');
  if (backBtn) {
    backBtn.addEventListener('click', function() {
      window.history.back();
    });
  }
  
  // Auto-focus first input on load
  window.addEventListener('load', () => {
    if (otpInputs[0]) {
      otpInputs[0].focus();
    }
  });
}

// ===================================
// CONSOLE MESSAGE
// ===================================
console.log('%cCross Border Pay - Registration System Loaded! 🎉', 'color: #FF6B00; font-size: 14px; font-weight: bold;');