// ===================================
// MAIN.JS - GLOBAL JAVASCRIPT
// Used by ALL pages across the app
// ===================================

// ===================================
// PAGE LOADER
// ===================================
window.addEventListener('load', function() {
  const pageLoader = document.getElementById('pageLoader');
  
  if (pageLoader) {
    setTimeout(() => {
      pageLoader.classList.add('hidden');
      // Remove from DOM after animation completes
      setTimeout(() => {
        pageLoader.style.display = 'none';
      }, 500);
    }, 500);
  }
});

// ===================================
// BUTTON LOADING STATE
// ===================================
function showButtonLoading(button) {
  if (button) {
    button.classList.add('btn-loading');
    button.disabled = true;
    button.dataset.originalText = button.textContent;
    button.textContent = 'Processing...';
  }
}

function hideButtonLoading(button) {
  if (button) {
    button.classList.remove('btn-loading');
    button.disabled = false;
    if (button.dataset.originalText) {
      button.textContent = button.dataset.originalText;
    }
  }
}

// ===================================
// FORM SUBMISSION WITH LOADING
// ===================================
function handleFormSubmission(form, callback) {
  const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
  
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Show loading state
    showButtonLoading(submitButton);
    
    try {
      // Execute callback function (your form logic)
      if (callback && typeof callback === 'function') {
        await callback(form);
      }
      
      // Simulate API call delay (remove this in production)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error('Form submission error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      // Hide loading state
      hideButtonLoading(submitButton);
    }
  });
}

// ===================================
// SHOW PROCESSING MESSAGE
// ===================================
function showProcessingMessage(message = 'Processing your request...') {
  // Create overlay
  let overlay = document.querySelector('.overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);
  }
  
  // Create processing message
  let processingMsg = document.querySelector('.processing-message');
  if (!processingMsg) {
    processingMsg = document.createElement('div');
    processingMsg.className = 'processing-message';
    processingMsg.innerHTML = `
      <div class="spinner"></div>
      <p>${message}</p>
    `;
    document.body.appendChild(processingMsg);
  } else {
    processingMsg.querySelector('p').textContent = message;
  }
  
  // Show both
  overlay.classList.add('active');
  processingMsg.classList.add('active');
}

function hideProcessingMessage() {
  const overlay = document.querySelector('.overlay');
  const processingMsg = document.querySelector('.processing-message');
  
  if (overlay) overlay.classList.remove('active');
  if (processingMsg) processingMsg.classList.remove('active');
}

// ===================================
// SIMULATE API CALL WITH LOADING
// ===================================
async function simulateApiCall(duration = 2000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, duration);
  });
}

// ===================================
// MOBILE NAVIGATION TOGGLE
// ===================================
document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.getElementById('hamburger');
  const navContent = document.getElementById('navContent');
  
  if (hamburger && navContent) {
    hamburger.addEventListener('click', function() {
      navContent.classList.toggle('active');
      this.classList.toggle('active');
    });
    
    // Close menu when clicking on a nav link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navContent.classList.remove('active');
        hamburger.classList.remove('active');
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      const isClickInsideNav = navContent.contains(event.target);
      const isClickOnHamburger = hamburger.contains(event.target);
      
      if (!isClickInsideNav && !isClickOnHamburger && navContent.classList.contains('active')) {
        navContent.classList.remove('active');
        hamburger.classList.remove('active');
      }
    });
  }
});

// ===================================
// SMOOTH SCROLLING FOR ANCHOR LINKS
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    
    // Only prevent default for actual anchor links (not just "#")
    if (href !== '#' && href !== '') {
      e.preventDefault();
      
      const target = document.querySelector(href);
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  });
});

// ===================================
// HEADER SHADOW ON SCROLL
// ===================================
window.addEventListener('scroll', function() {
  const header = document.querySelector('.header');
  
  if (header) {
    if (window.scrollY > 50) {
      header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
      header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
    }
  }
});

// ===================================
// PREVENT FORM SUBMISSION (for pages without backend)
// ===================================
const forms = document.querySelectorAll('form');
forms.forEach(form => {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    console.log('Form submission prevented - backend not yet connected');
    alert('Form submission coming soon! Backend integration needed.');
  });
});

// ===================================
// CONSOLE MESSAGE
// ===================================
console.log('%c SuppaPay Global Scripts Loaded! 🚀', 'color: #FF6B00; font-size: 16px; font-weight: bold;');