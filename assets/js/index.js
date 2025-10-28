// ===================================
// INDEX.JS - LANDING PAGE SPECIFIC
// Only used by index.html
// ===================================

document.addEventListener('DOMContentLoaded', function() {
  
  // ===================================
  // FAQ ACCORDION
  // ===================================
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      const faqItem = this.parentElement;
      const isActive = faqItem.classList.contains('active');
      
      // Close all FAQ items
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
      });
      
      // Open clicked item if it wasn't already active
      if (!isActive) {
        faqItem.classList.add('active');
      }
    });
  });

  // ===================================
  // LAZY LOADING FOR IMAGES
  // ===================================
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        }
      });
    });
    
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => imageObserver.observe(img));
  }

  // ===================================
  // ANIMATE ON SCROLL
  // ===================================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const animateElements = document.querySelectorAll('.feature-card, .why-card, .step-card');
  animateElements.forEach(el => observer.observe(el));

  // ===================================
  // HERO SECTION ANIMATIONS (Optional)
  // ===================================
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
      heroContent.style.transition = 'all 0.8s ease';
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'translateY(0)';
    }, 100);
  }

  // ===================================
  // CONSOLE MESSAGE
  // ===================================
  console.log('%c Landing Page Scripts Loaded! 🎉', 'color: #1E3A8A; font-size: 14px; font-weight: bold;');
  
});