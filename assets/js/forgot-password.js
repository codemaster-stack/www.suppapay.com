// ===================================
// FORGOT-PASSWORD.JS
// ===================================

document.addEventListener('DOMContentLoaded', function() {
  
  // ===================================
  // ELEMENTS
  // ===================================
  const forgotPasswordForm = document.getElementById('forgotPasswordForm');
  const emailInput = document.getElementById('email');
  const resetButton = document.getElementById('resetButton');
  const errorMessage = document.getElementById('errorMessage');
  const successMessage = document.getElementById('successMessage');

  // ===================================
  // VALIDATION
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
  // HIDE MESSAGES ON INPUT
  // ===================================
  if (emailInput) {
    emailInput.addEventListener('input', function() {
      hideMessage(errorMessage);
      hideMessage(successMessage);
      clearError('email');
    });
  }

  // ===================================
  // FORM SUBMISSION
  // ===================================
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Clear previous messages
      clearError('email');
      hideMessage(errorMessage);
      hideMessage(successMessage);
      
      // Get email value
      const email = emailInput.value.trim();
      
      // Validate email
      if (!email) {
        showError('email', 'Email is required');
        return;
      }
      
      if (!validateEmail(email)) {
        showError('email', 'Please enter a valid email address');
        return;
      }
      
      // Show loading state
      showButtonLoading(resetButton);
      
      try {
        // ===================================
        // SIMULATE API CALL (Replace with real backend later)
        // ===================================
        await simulateForgotPassword(email);
        
        // Success
        showMessage(successMessage, 
          `Password reset instructions have been sent to ${email}. Please check your inbox and spam folder.`
        );
        
        // Clear form
        forgotPasswordForm.reset();
        
        // Optional: Redirect to login after 5 seconds
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 5000);
        
      } catch (error) {
        // Error
        showMessage(errorMessage, error.message || 'Something went wrong. Please try again.');
      } finally {
        hideButtonLoading(resetButton);
      }
    });
  }

  // ===================================
  // SIMULATE FORGOT PASSWORD API
  // (Replace with real backend API call later)
  // ===================================
  async function simulateForgotPassword(email) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate successful email sending
        // In real backend, you would:
        // 1. Check if email exists in database
        // 2. Generate reset token
        // 3. Send email with reset link
        // 4. Store token with expiry time
        
        console.log(`Password reset email would be sent to: ${email}`);
        console.log(`Reset link: ${window.location.origin}/reset-password.html?token=abc123xyz`);
        
        resolve({ success: true });
      }, 2000);
    });
  }

  // ===================================
  // CONSOLE MESSAGE
  // ===================================
  console.log('%c Forgot Password Page Loaded! 🔑', 'color: #1E3A8A; font-size: 14px; font-weight: bold;');
  
});