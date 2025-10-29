// ===================================
// BUSINESS-KYC.JS - BUSINESS KYC WIZARD
// ===================================

document.addEventListener('DOMContentLoaded', function() {
  
  // ===================================
  // ELEMENTS
  // ===================================
  const kycForm = document.getElementById('kycForm');
  const steps = document.querySelectorAll('.form-step');
  const progressSteps = document.querySelectorAll('.progress-step');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const submitBtn = document.getElementById('submitBtn');
  const stepTitle = document.getElementById('stepTitle');
  const stepDescription = document.getElementById('stepDescription');
  const errorMessage = document.getElementById('errorMessage');
  const successMessage = document.getElementById('successMessage');
  
  let currentStep = 1;
  const totalSteps = 4;
  
  // Store form data
  let formData = {
    businessInfo: {},
    documents: {},
    directorInfo: {}
  };

  // ===================================
  // INITIALIZE - PRE-FILL EMAIL
  // ===================================
  function initializeForm() {
    // Get user data from session
    const userData = JSON.parse(localStorage.getItem('suppapay_user') || sessionStorage.getItem('suppapay_user') || '{}');
    
    // Pre-select country if available
    if (userData.country) {
      document.getElementById('businessCountry').value = userData.country;
    }
  }

  initializeForm();

  // ===================================
  // STEP TITLES & DESCRIPTIONS
  // ===================================
  const stepInfo = {
    1: {
      title: 'Business Information',
      description: 'Please provide accurate information about your business'
    },
    2: {
      title: 'Business Documents',
      description: 'Upload your business registration and tax documents'
    },
    3: {
      title: 'Director/Owner Information',
      description: 'Provide details of at least one director or beneficial owner'
    },
    4: {
      title: 'Review & Submit',
      description: 'Review your business information before submitting'
    }
  };

  // ===================================
  // UPDATE STEP TITLE
  // ===================================
  function updateStepTitle() {
    stepTitle.textContent = stepInfo[currentStep].title;
    stepDescription.textContent = stepInfo[currentStep].description;
  }

  // ===================================
  // SHOW STEP
  // ===================================
  function showStep(step) {
    // Hide all steps
    steps.forEach(s => s.classList.remove('active'));
    progressSteps.forEach(s => s.classList.remove('active'));
    
    // Show current step
    document.getElementById(`step${step}`).classList.add('active');
    progressSteps[step - 1].classList.add('active');
    
    // Mark completed steps
    for (let i = 0; i < step - 1; i++) {
      progressSteps[i].classList.add('completed');
    }
    
    // Update buttons
    prevBtn.style.display = step === 1 ? 'none' : 'block';
    nextBtn.style.display = step === totalSteps ? 'none' : 'block';
    submitBtn.style.display = step === totalSteps ? 'block' : 'none';
    
    // Update title
    updateStepTitle();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ===================================
  // VALIDATION
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
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function hideMessage(element) {
    if (element) {
      element.style.display = 'none';
    }
  }

  // Clear errors on input
  document.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('input', function() {
      clearError(this.id);
      hideMessage(errorMessage);
    });
  });

  // ===================================
  // VALIDATE STEP 1 - BUSINESS INFO
  // ===================================
  function validateStep1() {
    hideMessage(errorMessage);
    let isValid = true;
    
    const businessName = document.getElementById('businessName').value.trim();
    const businessType = document.getElementById('businessType').value;
    const registrationNumber = document.getElementById('registrationNumber').value.trim();
    const businessEmail = document.getElementById('businessEmail').value.trim();
    const businessPhone = document.getElementById('businessPhone').value.trim();
    const businessAddress = document.getElementById('businessAddress').value.trim();
    const businessCity = document.getElementById('businessCity').value.trim();
    const businessState = document.getElementById('businessState').value.trim();
    const businessCountry = document.getElementById('businessCountry').value;
    const industry = document.getElementById('industry').value;
    const incorporationDate = document.getElementById('incorporationDate').value;
    const taxId = document.getElementById('taxId').value.trim();
    
    // Validate required fields
    if (!businessName) {
      showError('businessName', 'Business name is required');
      isValid = false;
    }
    
    if (!businessType) {
      showError('businessType', 'Please select business type');
      isValid = false;
    }
    
    if (!registrationNumber) {
      showError('registrationNumber', 'Registration number is required');
      isValid = false;
    }
    
    if (!businessEmail) {
      showError('businessEmail', 'Business email is required');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(businessEmail)) {
      showError('businessEmail', 'Please enter a valid email address');
      isValid = false;
    }
    
    if (!businessPhone) {
      showError('businessPhone', 'Business phone number is required');
      isValid = false;
    }
    
    if (!businessAddress) {
      showError('businessAddress', 'Business address is required');
      isValid = false;
    }
    
    if (!businessCity) {
      showError('businessCity', 'City is required');
      isValid = false;
    }
    
    if (!businessState) {
      showError('businessState', 'State/Province is required');
      isValid = false;
    }
    
    if (!businessCountry) {
      showError('businessCountry', 'Please select country');
      isValid = false;
    }
    
    if (!industry) {
      showError('industry', 'Please select industry');
      isValid = false;
    }
    
    if (!incorporationDate) {
      showError('incorporationDate', 'Incorporation date is required');
      isValid = false;
    }
    
    if (!taxId) {
      showError('taxId', 'Tax ID/TIN is required');
      isValid = false;
    }
    
    if (isValid) {
      // Store data
      formData.businessInfo = {
        businessName,
        businessType,
        registrationNumber,
        businessEmail,
        businessPhone,
        businessAddress,
        businessCity,
        businessState,
        businessPostalCode: document.getElementById('businessPostalCode').value.trim(),
        businessCountry,
        industry,
        incorporationDate,
        taxId,
        website: document.getElementById('website').value.trim()
      };
    }
    
    return isValid;
  }

  // ===================================
  // VALIDATE STEP 2 - DOCUMENTS
  // ===================================
  function validateStep2() {
    hideMessage(errorMessage);
    let isValid = true;
    
    const regCertFile = document.getElementById('regCertFile').files[0];
    const taxCertFile = document.getElementById('taxCertFile').files[0];
    const businessProofAddressFile = document.getElementById('businessProofAddressFile').files[0];
    
    if (!regCertFile) {
      showError('regCertFile', 'Please upload business registration certificate');
      isValid = false;
    }
    
    if (!taxCertFile) {
      showError('taxCertFile', 'Please upload tax certificate');
      isValid = false;
    }
    
    if (!businessProofAddressFile) {
      showError('businessProofAddressFile', 'Please upload proof of business address');
      isValid = false;
    }
    
    if (isValid) {
      // Store data
      formData.documents = {
        regCertFile,
        taxCertFile,
        businessProofAddressFile,
        memoArticlesFile: document.getElementById('memoArticlesFile').files[0] || null
      };
    }
    
    return isValid;
  }

  // ===================================
  // VALIDATE STEP 3 - DIRECTOR INFO
  // ===================================
  function validateStep3() {
    hideMessage(errorMessage);
    let isValid = true;
    
    const directorFirstName = document.getElementById('directorFirstName').value.trim();
    const directorLastName = document.getElementById('directorLastName').value.trim();
    const directorEmail = document.getElementById('directorEmail').value.trim();
    const directorPhone = document.getElementById('directorPhone').value.trim();
    const directorDob = document.getElementById('directorDob').value;
    const ownershipPercentage = document.getElementById('ownershipPercentage').value;
    const directorIdFile = document.getElementById('directorIdFile').files[0];
    const directorPhotoFile = document.getElementById('directorPhotoFile').files[0];
    
    if (!directorFirstName) {
      showError('directorFirstName', 'Director first name is required');
      isValid = false;
    }
    
    if (!directorLastName) {
      showError('directorLastName', 'Director last name is required');
      isValid = false;
    }
    
    if (!directorEmail) {
      showError('directorEmail', 'Director email is required');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(directorEmail)) {
      showError('directorEmail', 'Please enter a valid email address');
      isValid = false;
    }
    
    if (!directorPhone) {
      showError('directorPhone', 'Director phone number is required');
      isValid = false;
    }
    
    if (!directorDob) {
      showError('directorDob', 'Director date of birth is required');
      isValid = false;
    } else {
      // Check if director is at least 18 years old
      const dob = new Date(directorDob);
      const age = new Date().getFullYear() - dob.getFullYear();
      if (age < 18) {
        showError('directorDob', 'Director must be at least 18 years old');
        isValid = false;
      }
    }
    
    if (!ownershipPercentage) {
      showError('ownershipPercentage', 'Ownership percentage is required');
      isValid = false;
    } else if (ownershipPercentage < 1 || ownershipPercentage > 100) {
      showError('ownershipPercentage', 'Percentage must be between 1 and 100');
      isValid = false;
    }
    
    if (!directorIdFile) {
      showError('directorIdFile', 'Please upload director ID document');
      isValid = false;
    }
    
    if (!directorPhotoFile) {
      showError('directorPhotoFile', 'Please upload director photo');
      isValid = false;
    }
    
    if (isValid) {
      // Store data
      formData.directorInfo = {
        directorFirstName,
        directorLastName,
        directorEmail,
        directorPhone,
        directorDob,
        ownershipPercentage,
        directorIdFile,
        directorPhotoFile
      };
    }
    
    return isValid;
  }

  // ===================================
  // FILE UPLOAD - DRAG & DROP
  // ===================================
  function setupFileUpload(uploadAreaId, fileInputId, previewId, cameraButtonId) {
    const uploadArea = document.getElementById(uploadAreaId);
    const fileInput = document.getElementById(fileInputId);
    const preview = document.getElementById(previewId);
    const cameraBtn = document.getElementById(cameraButtonId);
    
    if (!uploadArea || !fileInput || !preview) return;
    
    // Drag & Drop
    uploadArea.addEventListener('dragover', function(e) {
      e.preventDefault();
      this.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', function() {
      this.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', function(e) {
      e.preventDefault();
      this.classList.remove('dragover');
      
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        fileInput.files = files;
        displayFilePreview(files[0], preview, fileInput);
      }
    });
    
    // File Input Change
    fileInput.addEventListener('change', function() {
      if (this.files.length > 0) {
        displayFilePreview(this.files[0], preview, fileInput);
      }
    });
    
    // Camera Button
    if (cameraBtn) {
      cameraBtn.addEventListener('click', function() {
        fileInput.setAttribute('capture', 'environment');
        fileInput.click();
      });
    }
  }

  // Display File Preview
  function displayFilePreview(file, previewElement, inputElement) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      previewElement.innerHTML = `
        <div class="file-info">
          <span class="file-icon">📄</span>
          <div class="file-details">
            <div class="file-name">${file.name}</div>
            <div class="file-size">${(file.size / 1024).toFixed(2)} KB</div>
          </div>
        </div>
        ${file.type.startsWith('image/') ? `<img src="${e.target.result}" alt="Preview">` : ''}
        <button type="button" class="file-remove" onclick="removeFile('${inputElement.id}', '${previewElement.id}')">
          Remove
        </button>
      `;
      previewElement.style.display = 'flex';
    };
    
    reader.readAsDataURL(file);
  }

  // Remove File Function (make global)
  window.removeFile = function(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    
    input.value = '';
    preview.style.display = 'none';
    preview.innerHTML = '';
  };

  // Setup all file uploads
  setupFileUpload('regCertUpload', 'regCertFile', 'regCertPreview', 'regCertCamera');
  setupFileUpload('taxCertUpload', 'taxCertFile', 'taxCertPreview', 'taxCertCamera');
  setupFileUpload('businessProofAddressUpload', 'businessProofAddressFile', 'businessProofAddressPreview', 'businessProofAddressCamera');
  setupFileUpload('memoArticlesUpload', 'memoArticlesFile', 'memoArticlesPreview', 'memoArticlesCamera');
  setupFileUpload('directorIdUpload', 'directorIdFile', 'directorIdPreview', 'directorIdCamera');
  setupFileUpload('directorPhotoUpload', 'directorPhotoFile', 'directorPhotoPreview', 'directorPhotoCamera');

  // ===================================
  // GENERATE REVIEW PAGE
  // ===================================
  function generateReview() {
    // Business Info Review
    const businessInfoHTML = `
      <div class="review-item">
        <div class="review-label">Business Name</div>
        <div class="review-value">${formData.businessInfo.businessName}</div>
      </div>
      <div class="review-item">
        <div class="review-label">Business Type</div>
        <div class="review-value">${getBusinessTypeName(formData.businessInfo.businessType)}</div>
      </div>
      <div class="review-item">
        <div class="review-label">Registration Number</div>
        <div class="review-value">${formData.businessInfo.registrationNumber}</div>
      </div>
      <div class="review-item">
        <div class="review-label">Tax ID/TIN</div>
        <div class="review-value">${formData.businessInfo.taxId}</div>
      </div>
      <div class="review-item">
        <div class="review-label">Business Email</div>
        <div class="review-value">${formData.businessInfo.businessEmail}</div>
      </div>
      <div class="review-item">
        <div class="review-label">Business Phone</div>
        <div class="review-value">${formData.businessInfo.businessPhone}</div>
      </div>
      <div class="review-item">
        <div class="review-label">Industry</div>
        <div class="review-value">${getIndustryName(formData.businessInfo.industry)}</div>
      </div>
      <div class="review-item">
        <div class="review-label">Date of Incorporation</div>
        <div class="review-value">${formData.businessInfo.incorporationDate}</div>
      </div>
      <div class="review-item">
        <div class="review-label">Business Address</div>
        <div class="review-value">
          ${formData.businessInfo.businessAddress}<br>
          ${formData.businessInfo.businessCity}, ${formData.businessInfo.businessState} ${formData.businessInfo.businessPostalCode}<br>
          ${getCountryName(formData.businessInfo.businessCountry)}
        </div>
      </div>
    `;
    
    document.getElementById('reviewBusinessInfo').innerHTML = businessInfoHTML;
    
    // Documents Review
    const documentsHTML = `
      <div class="review-item">
        <div class="review-label">Uploaded Documents</div>
        <div class="review-value">
          ✅ Registration Certificate: ${formData.documents.regCertFile.name}<br>
          ✅ Tax Certificate: ${formData.documents.taxCertFile.name}<br>
          ✅ Proof of Address: ${formData.documents.businessProofAddressFile.name}
          ${formData.documents.memoArticlesFile ? `<br>✅ Memorandum & Articles: ${formData.documents.memoArticlesFile.name}` : ''}
        </div>
      </div>
    `;
    
    document.getElementById('reviewBusinessDocuments').innerHTML = documentsHTML;
    
    // Director Info Review
    const directorInfoHTML = `
      <div class="review-item">
        <div class="review-label">Director/Owner Name</div>
        <div class="review-value">${formData.directorInfo.directorFirstName} ${formData.directorInfo.directorLastName}</div>
      </div>
      <div class="review-item">
        <div class="review-label">Director Email</div>
        <div class="review-value">${formData.directorInfo.directorEmail}</div>
      </div>
      <div class="review-item">
        <div class="review-label">Director Phone</div>
        <div class="review-value">${formData.directorInfo.directorPhone}</div>
      </div>
      <div class="review-item">
        <div class="review-label">Date of Birth</div>
        <div class="review-value">${formData.directorInfo.directorDob}</div>
      </div>
      <div class="review-item">
        <div class="review-label">Ownership</div>
        <div class="review-value">${formData.directorInfo.ownershipPercentage}%</div>
      </div>
      <div class="review-item">
        <div class="review-label">Documents</div>
        <div class="review-value">
          ✅ ID Document: ${formData.directorInfo.directorIdFile.name}<br>
          ✅ Photo: ${formData.directorInfo.directorPhotoFile.name}
        </div>
      </div>
    `;
    
    document.getElementById('reviewDirectorInfo').innerHTML = directorInfoHTML;
  }

  // Helper functions
  function getCountryName(code) {
    const countries = {
      'NG': 'Nigeria', 'US': 'United States', 'GB': 'United Kingdom',
      'CA': 'Canada', 'GH': 'Ghana', 'KE': 'Kenya', 'ZA': 'South Africa'
    };
    return countries[code] || code;
  }

  function getBusinessTypeName(type) {
    const types = {
      'sole_proprietorship': 'Sole Proprietorship',
      'partnership': 'Partnership',
      'llc': 'Limited Liability Company (LLC)',
      'corporation': 'Corporation',
      'cooperative': 'Cooperative',
      'ngo': 'Non-Governmental Organization (NGO)'
    };
    return types[type] || type;
  }

  function getIndustryName(industry) {
    const industries = {
      'technology': 'Technology/IT',
      'finance': 'Finance/Banking',
      'retail': 'Retail/E-commerce',
      'manufacturing': 'Manufacturing',
      'healthcare': 'Healthcare',
      'education': 'Education',
      'real_estate': 'Real Estate',
      'agriculture': 'Agriculture',
      'transportation': 'Transportation/Logistics',
      'hospitality': 'Hospitality/Tourism',
      'other': 'Other'
    };
    return industries[industry] || industry;
  }

  // ===================================
  // EDIT BUTTONS ON REVIEW PAGE
  // ===================================
  document.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', function() {
      const step = parseInt(this.dataset.step);
      currentStep = step;
      showStep(step);
    });
  });

  // ===================================
  // NAVIGATION - NEXT BUTTON
  // ===================================
  nextBtn.addEventListener('click', function() {
    let isValid = false;
    
    if (currentStep === 1) {
      isValid = validateStep1();
    } else if (currentStep === 2) {
      isValid = validateStep2();
    } else if (currentStep === 3) {
      isValid = validateStep3();
      if (isValid) {
        generateReview();
      }
    }
    
    if (isValid && currentStep < totalSteps) {
      currentStep++;
      showStep(currentStep);
    }
  });

  // ===================================
  // NAVIGATION - PREVIOUS BUTTON
  // ===================================
  prevBtn.addEventListener('click', function() {
    if (currentStep > 1) {
      currentStep--;
      showStep(currentStep);
    }
  });

  // ===================================
  // FORM SUBMISSION
  // ===================================
  kycForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    hideMessage(errorMessage);
    hideMessage(successMessage);
    
    // Validate checkboxes
    const confirmAccuracy = document.getElementById('confirmAccuracy');
    const confirmAuthorization = document.getElementById('confirmAuthorization');
    const confirmTerms = document.getElementById('confirmTerms');
    
    if (!confirmAccuracy.checked) {
      showMessage(errorMessage, 'Please confirm that all information is accurate');
      return;
    }
    
    if (!confirmAuthorization.checked) {
      showMessage(errorMessage, 'Please confirm that you are authorized to submit this application');
      return;
    }
    
    if (!confirmTerms.checked) {
      showMessage(errorMessage, 'Please agree to the Terms & Conditions');
      return;
    }
    
    // Show loading
    showButtonLoading(submitBtn);
    
    try {
      // Simulate API call
      await simulateKycSubmission();
      
      // Success
      showMessage(successMessage, 'Business KYC application submitted successfully! Redirecting to dashboard...');
      
      // Update user KYC status
      const userData = JSON.parse(localStorage.getItem('suppapay_user') || sessionStorage.getItem('suppapay_user') || '{}');
      userData.kycStatus = 'pending';
      
      if (localStorage.getItem('suppapay_user')) {
        localStorage.setItem('suppapay_user', JSON.stringify(userData));
      } else {
        sessionStorage.setItem('suppapay_user', JSON.stringify(userData));
      }
      
      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 3000);
      
    } catch (error) {
      showMessage(errorMessage, error.message || 'Failed to submit KYC. Please try again.');
      hideButtonLoading(submitBtn);
    }
  });

  // ===================================
  // SIMULATE KYC SUBMISSION
  // ===================================
  async function simulateKycSubmission() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('Business KYC Data to be submitted:');
        console.log('Business Info:', formData.businessInfo);
        console.log('Director Info:', formData.directorInfo);
        console.log('Documents:', Object.keys(formData.documents));
        
        resolve({ success: true });
      }, 3000);
    });
  }

  // ===================================
  // INITIALIZE
  // ===================================
  showStep(currentStep);

  console.log('%c Business KYC Page Loaded! 🏢', 'color: #1E3A8A; font-size: 14px; font-weight: bold;');
  console.log('%c 4-step wizard initialized', 'color: #FF6B00; font-size: 12px;');
  
});