// ===================================
// KYC.JS - KYC FORM WIZARD
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
  const totalSteps = 3;
  
  // Store form data
  let formData = {
    personalInfo: {},
    documents: {}
  };

  // ===================================
  // INITIALIZE - PRE-FILL EMAIL & COUNTRY
  // ===================================
  function initializeForm() {
    // Get user data from session (stored during login)
    const userData = JSON.parse(localStorage.getItem('suppapay_user') || sessionStorage.getItem('suppapay_user') || '{}');
    
    if (userData.email) {
      document.getElementById('email').value = userData.email;
    }
    
    // Pre-select country if available
    if (userData.country) {
      document.getElementById('country').value = userData.country;
      handleCountryChange(userData.country);
    }
  }

  initializeForm();

  // ===================================
  // STEP TITLES & DESCRIPTIONS
  // ===================================
  const stepInfo = {
    1: {
      title: 'Personal Information',
      description: 'Please provide your accurate personal details'
    },
    2: {
      title: 'Identity Verification',
      description: 'Upload your identity documents for verification'
    },
    3: {
      title: 'Review & Submit',
      description: 'Review your information before submitting'
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
      
      // Scroll to message
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
  // VALIDATE STEP 1 - PERSONAL INFO
  // ===================================
  function validateStep1() {
    hideMessage(errorMessage);
    let isValid = true;
    
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const dateOfBirth = document.getElementById('dateOfBirth').value;
    const gender = document.getElementById('gender').value;
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const state = document.getElementById('state').value.trim();
    const country = document.getElementById('country').value;
    
    // Validate required fields
    if (!firstName) {
      showError('firstName', 'First name is required');
      isValid = false;
    }
    
    if (!lastName) {
      showError('lastName', 'Last name is required');
      isValid = false;
    }
    
    if (!dateOfBirth) {
      showError('dateOfBirth', 'Date of birth is required');
      isValid = false;
    } else {
      // Check if user is at least 18 years old
      const dob = new Date(dateOfBirth);
      const age = new Date().getFullYear() - dob.getFullYear();
      if (age < 18) {
        showError('dateOfBirth', 'You must be at least 18 years old');
        isValid = false;
      }
    }
    
    if (!gender) {
      showError('gender', 'Please select your gender');
      isValid = false;
    }
    
    if (!phoneNumber) {
      showError('phoneNumber', 'Phone number is required');
      isValid = false;
    }
    
    if (!address) {
      showError('address', 'Address is required');
      isValid = false;
    }
    
    if (!city) {
      showError('city', 'City is required');
      isValid = false;
    }
    
    if (!state) {
      showError('state', 'State/Province is required');
      isValid = false;
    }
    
    if (!country) {
      showError('country', 'Please select your country');
      isValid = false;
    }
    
    if (isValid) {
      // Store data
      formData.personalInfo = {
        firstName,
        lastName,
        dateOfBirth,
        gender,
        phoneNumber,
        email: document.getElementById('email').value,
        address,
        city,
        state,
        postalCode: document.getElementById('postalCode').value.trim(),
        country
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
    
    const idType = document.getElementById('idType').value;
    const idNumber = document.getElementById('idNumber').value.trim();
    const idFrontFile = document.getElementById('idFrontFile').files[0];
    const idBackFile = document.getElementById('idBackFile').files[0];
    const selfieFile = document.getElementById('selfieFile').files[0];
    const proofAddressFile = document.getElementById('proofAddressFile').files[0];
    
    if (!idType) {
      showError('idType', 'Please select ID document type');
      isValid = false;
    }
    
    if (!idNumber) {
      showError('idNumber', 'ID number is required');
      isValid = false;
    }
    
    // Check country-specific field
    const country = document.getElementById('country').value;
    if (country === 'NG' || country === 'US') {
      const countrySpecificId = document.getElementById('countrySpecificId').value.trim();
      if (!countrySpecificId) {
        showError('countrySpecificId', 'This field is required');
        isValid = false;
      }
      formData.documents.countrySpecificId = countrySpecificId;
    }
    
    if (!idFrontFile) {
      showError('idFrontFile', 'Please upload front of ID document');
      isValid = false;
    }
    
    if (!idBackFile) {
      showError('idBackFile', 'Please upload back of ID document');
      isValid = false;
    }
    
    if (!selfieFile) {
      showError('selfieFile', 'Please upload a selfie');
      isValid = false;
    }
    
    if (!proofAddressFile) {
      showError('proofAddressFile', 'Please upload proof of address');
      isValid = false;
    }
    
    if (isValid) {
      // Store data
      formData.documents = {
        idType,
        idNumber,
        idFrontFile,
        idBackFile,
        selfieFile,
        proofAddressFile,
        countrySpecificId: formData.documents.countrySpecificId
      };
    }
    
    return isValid;
  }

  // ===================================
  // COUNTRY-SPECIFIC FIELDS
  // ===================================
  document.getElementById('country').addEventListener('change', function() {
    handleCountryChange(this.value);
  });

  function handleCountryChange(countryCode) {
    const countrySpecificField = document.getElementById('countrySpecificField');
    const countrySpecificLabel = document.getElementById('countrySpecificLabel');
    const countrySpecificHelp = document.getElementById('countrySpecificHelp');
    const countrySpecificInput = document.getElementById('countrySpecificId');
    
    if (countryCode === 'NG') {
      // Nigeria - BVN
      countrySpecificField.style.display = 'block';
      countrySpecificLabel.innerHTML = 'BVN (Bank Verification Number) <span class="required">*</span>';
      countrySpecificInput.placeholder = 'Enter your 11-digit BVN';
      countrySpecificHelp.textContent = 'Required for Nigerian residents';
      countrySpecificInput.maxLength = 11;
    } else if (countryCode === 'US') {
      // USA - SSN
      countrySpecificField.style.display = 'block';
      countrySpecificLabel.innerHTML = 'SSN (Social Security Number) <span class="required">*</span>';
      countrySpecificInput.placeholder = 'XXX-XX-XXXX';
      countrySpecificHelp.textContent = 'Required for US residents';
      countrySpecificInput.maxLength = 11;
    } else if (countryCode === 'GB') {
      // UK - National Insurance Number
      countrySpecificField.style.display = 'block';
      countrySpecificLabel.innerHTML = 'National Insurance Number';
      countrySpecificInput.placeholder = 'AB123456C';
      countrySpecificHelp.textContent = 'Optional for UK residents';
      countrySpecificInput.maxLength = 9;
    } else {
      // Other countries - hide field
      countrySpecificField.style.display = 'none';
    }
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
    
    // Camera Button (for mobile)
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
  setupFileUpload('idFrontUpload', 'idFrontFile', 'idFrontPreview', 'idFrontCamera');
  setupFileUpload('idBackUpload', 'idBackFile', 'idBackPreview', 'idBackCamera');
  setupFileUpload('selfieUpload', 'selfieFile', 'selfiePreview', 'selfieCamera');
  setupFileUpload('proofAddressUpload', 'proofAddressFile', 'proofAddressPreview', 'proofAddressCamera');

  // ===================================
  // GENERATE REVIEW PAGE
  // ===================================
  function generateReview() {
    // Personal Info Review
    const personalInfoHTML = `
      <div class="review-item">
        <div class="review-label">Full Name</div>
        <div class="review-value">${formData.personalInfo.firstName} ${formData.personalInfo.lastName}</div>
      </div>
      <div class="review-item">
        <div class="review-label">Date of Birth</div>
        <div class="review-value">${formData.personalInfo.dateOfBirth}</div>
      </div>
      <div class="review-item">
        <div class="review-label">Gender</div>
        <div class="review-value">${formData.personalInfo.gender}</div>
      </div>
      <div class="review-item">
        <div class="review-label">Phone Number</div>
        <div class="review-value">${formData.personalInfo.phoneNumber}</div>
      </div>
      <div class="review-item">
        <div class="review-label">Email</div>
        <div class="review-value">${formData.personalInfo.email}</div>
      </div>
      <div class="review-item">
        <div class="review-label">Address</div>
        <div class="review-value">
          ${formData.personalInfo.address}<br>
          ${formData.personalInfo.city}, ${formData.personalInfo.state} ${formData.personalInfo.postalCode}<br>
          ${getCountryName(formData.personalInfo.country)}
        </div>
      </div>
    `;
    
    document.getElementById('reviewPersonalInfo').innerHTML = personalInfoHTML;
    
    // Documents Review
    const documentsHTML = `
      <div class="review-item">
        <div class="review-label">ID Type</div>
        <div class="review-value">${getIdTypeName(formData.documents.idType)}</div>
      </div>
      <div class="review-item">
        <div class="review-label">ID Number</div>
        <div class="review-value">${formData.documents.idNumber}</div>
      </div>
      <div class="review-item">
        <div class="review-label">Uploaded Documents</div>
        <div class="review-value">
          ✅ ID Front: ${formData.documents.idFrontFile.name}<br>
          ✅ ID Back: ${formData.documents.idBackFile.name}<br>
          ✅ Selfie: ${formData.documents.selfieFile.name}<br>
          ✅ Proof of Address: ${formData.documents.proofAddressFile.name}
        </div>
      </div>
    `;
    
    document.getElementById('reviewDocuments').innerHTML = documentsHTML;
  }

  // Helper functions
  function getCountryName(code) {
    const countries = {
      'NG': 'Nigeria',
      'US': 'United States',
      'GB': 'United Kingdom',
      'CA': 'Canada',
      'GH': 'Ghana',
      'KE': 'Kenya',
      'ZA': 'South Africa'
    };
    return countries[code] || code;
  }

  function getIdTypeName(type) {
    const types = {
      'passport': 'International Passport',
      'drivers_license': "Driver's License",
      'national_id': 'National ID Card',
      'voters_card': "Voter's Card"
    };
    return types[type] || type;
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
    const confirmTerms = document.getElementById('confirmTerms');
    
    if (!confirmAccuracy.checked) {
      showMessage(errorMessage, 'Please confirm that all information is accurate');
      return;
    }
    
    if (!confirmTerms.checked) {
      showMessage(errorMessage, 'Please agree to the Terms & Conditions');
      return;
    }
    
    // Show loading
    showButtonLoading(submitBtn);
    
    try {
      // ===================================
      // SIMULATE API CALL (Replace with real backend later)
      // ===================================
      await simulateKycSubmission();
      
      // Success
      showMessage(successMessage, 'KYC application submitted successfully! You will be redirected to your dashboard...');
      
      // Update user KYC status
      const userData = JSON.parse(localStorage.getItem('suppapay_user') || sessionStorage.getItem('suppapay_user') || '{}');
      userData.kycStatus = 'pending';
      
      if (localStorage.getItem('suppapay_user')) {
        localStorage.setItem('suppapay_user', JSON.stringify(userData));
      } else {
        sessionStorage.setItem('suppapay_user', JSON.stringify(userData));
      }
      
      // Redirect to dashboard after 3 seconds
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
  // (Replace with real backend API call later)
  // ===================================
  async function simulateKycSubmission() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // In real backend, you would:
        // 1. Create FormData object
        // 2. Append all form fields and files
        // 3. Send to backend API
        // 4. Backend stores in database and cloud storage
        // 5. Backend sets KYC status to 'pending'
        // 6. Backend notifies admin for review
        
        console.log('KYC Data to be submitted:');
        console.log('Personal Info:', formData.personalInfo);
        console.log('Documents:', {
          idType: formData.documents.idType,
          idNumber: formData.documents.idNumber,
          files: ['idFront', 'idBack', 'selfie', 'proofOfAddress']
        });
        
        resolve({ success: true });
      }, 3000);
    });
  }

  // ===================================
  // INITIALIZE
  // ===================================
  showStep(currentStep);

  // ===================================
  // CONSOLE MESSAGE
  // ===================================
  console.log('%c Personal KYC Page Loaded! 📋', 'color: #1E3A8A; font-size: 14px; font-weight: bold;');
  console.log('%c Multi-step wizard initialized', 'color: #FF6B00; font-size: 12px;');
  
});