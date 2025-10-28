 const selectButtons = document.querySelectorAll('.btn-select');
        
        selectButtons.forEach(button => {
            button.addEventListener('click', function() {
                const accountType = this.getAttribute('data-account-type');
                
                // Store account type in sessionStorage
                sessionStorage.setItem('accountType', accountType);
                
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