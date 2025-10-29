// ===================================
// RESET-PASSWORD.JS
// ===================================

document.addEventListener('DOMContentLoaded', function() {
  
  // ===================================
  // ELEMENTS
  // ===================================
  const resetPasswordForm = document.getElementById('resetPasswordForm');
  const newPasswordInput = document.getElementById('newPassword');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const toggleNewPassword = document.getElementById('toggleNewPassword');
  const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
  const eyeIconNew = document.getElementById('eyeIconNew');
  const eyeIconConfirm = document.getElementById('eyeIconConfirm');
  const resetButton = document.getElementById('resetButton');
  const errorMessage = document.getElementById('errorMessage');
  const successMessage = document.getElementById('successMessage');
  
  // Password strength elements
  const passwordStrength = document.getElementById('passwordStrength');
  const strengthFill = document.getElementById('strengthFill');
  const strengthText = document.getElementById('strengthText');
  
  // Requirement elements
  const reqLength = document.getElementById('req-length');
  const reqUppercase = document.getElementById('req-uppercase');
  const reqLowercase = document.getElementById('req-lowercase');
  const reqNumber = document.getElementById('req-number');
  const reqSpecial = document.getElementById('req-special');

  // ===================================
  // CHECK RESET TOKEN
  // ===================================
  function checkResetToken() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (!token) {
      showMessage(errorMessage, 'Invalid or expired reset link. Please request a new password reset.');
      resetButton.disabled = true;
      return false;
    }
    
    // In real backend, verify token validity here
    console.log('Reset token:', token);
    return true;
  }

  // Check token on page load
  checkResetToken();

  // ===================================
  // SHOW/HIDE PASSWORD TOGGLES
  // ===================================
  if (toggleNewPassword) {
    toggleNewPassword.addEventListener('click', function() {
      const type = newPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      newPasswordInput.setAttribute('type', type);
      eyeIconNew.textContent = type === 'password' ? '👁️' : '🙈';
    });
  }

  if (toggleConfirmPassword) {
    toggleConfirmPassword.addEventListener('click', function() {
      const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      confirmPasswordInput.setAttribute('type', type);
      eyeIconConfirm.textContent = type === 'password' ? '👁️' : '🙈';
    });
  }

  // ===================================
  // PASSWORD STRENGTH CHECKER
  // ===================================
  function checkPasswordStrength(password) {
    let strength = 0;
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    // Update requirement checkmarks
    reqLength.classList.toggle('valid', requirements.length);
    reqUppercase.classList.toggle('valid', requirements.uppercase);
    reqLowercase.classList.toggle('valid', requirements.lowercase);
    reqNumber.classList.toggle('valid', requirements.number);
    reqSpecial.classList.toggle('valid', requirements.special);
    
    // Calculate strength
    Object.values(requirements).forEach(met => {
      if (met) strength++;
    });
    
    // Show strength indicator
    if (password.length > 0) {
      passwordStrength.style.display = 'block';
      
      // Remove all classes
      strengthFill.className = 'strength-fill';
      strengthText.className = 'strength-text';
      
      if (strength <= 2) {
        strengthFill.classList.add('weak');
        strengthText.classList.add('weak');
        strengthText.textContent = 'Weak password';
      } else if (strength <= 4) {
        strengthFill.classList.add('medium');
        strengthText.classList.add('medium');
        strengthText.textContent = 'Medium strength';
      } else {
        strengthFill.classList.add('strong');
        strengthText.classList.add('strong');
        strengthText.textContent = 'Strong password';
      }
    } else {
      passwordStrength.style.display = 'none';
    }
    
    return Object.values(requirements).every(met => met);
  }

  // ===================================
  // PASSWORD INPUT LISTENER
  // ===================================
  if (newPasswordInput) {
    newPasswordInput.addEventListener('input', function() {
      checkPasswordStrength(this.value);
      hideMessage(errorMessage);
      hideMessage(successMessage);
      clearError('newPassword');
    });
  }

  if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener('input', function() {
      hideMessage(errorMessage);
      hideMessage(successMessage);
      clearError('confirmPassword');
    });
  }

  // ===================================
  // VALIDATION FUNCTIONS
  // ===================================
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

  function showMessage(element, message) {
    if (element) {
      element.querySelector('.alert-text').textContent = message;
      element.style.display = 'flex';
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
  if (resetPasswordForm) {
    resetPasswordForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Clear previous errors
      clearError('newPassword');
      clearError('confirmPassword');
      hideMessage(errorMessage);
      hideMessage(successMessage);
      
      // Get form values
      const newPassword = newPasswordInput.value.trim();
      const confirmPassword = confirmPasswordInput.value.trim();
      
      // Validate inputs
      let hasError = false;
      
      if (!newPassword) {
        showError('newPassword', 'New password is required');
        hasError = true;
      } else if (!checkPasswordStrength(newPassword)) {
        showError('newPassword', 'Password does not meet all requirements');
        hasError = true;
      }
      
      if (!confirmPassword) {
        showError('confirmPassword', 'Please confirm your password');
        hasError = true;
      } else if (newPassword !== confirmPassword) {
        showError('confirmPassword', 'Passwords do not match');
        hasError = true;
      }
      
      if (hasError) {
        return;
      }
      
      // Show loading state
      showButtonLoading(resetButton);
      
      try {
        // Get reset token from URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        
        // ===================================
        // SIMULATE API CALL (Replace with real backend later)
        // ===================================
        await simulateResetPassword(token, newPassword);
        
        // Success
        showMessage(successMessage, 'Password reset successful! Redirecting to login page...');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 3000);
        
      } catch (error) {
        // Error
        showMessage(errorMessage, error.message || 'Failed to reset password. Please try again.');
        hideButtonLoading(resetButton);
      }
    });
  }

  // ===================================
  // SIMULATE RESET PASSWORD API
  // (Replace with real backend API call later)
  // ===================================
  async function simulateResetPassword(token, newPassword) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // In real backend, you would:
        // 1. Verify token is valid and not expired
        // 2. Hash the new password
        // 3. Update password in database
        // 4. Invalidate the reset token
        // 5. Log out user from all devices (optional)
        
        console.log('Password would be reset with token:', token);
        console.log('New password hash would be stored');
        
        resolve({ success: true });
      }, 2000);
    });
  }

  // ===================================
  // CONSOLE MESSAGE
  // ===================================
  console.log('%c Reset Password Page Loaded! 🔐', 'color: #1E3A8A; font-size: 14px; font-weight: bold;');
  
});