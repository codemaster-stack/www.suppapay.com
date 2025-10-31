 const chatButton = document.getElementById('chatButton');
        const chatWindow = document.getElementById('chatWindow');
        const chatClose = document.getElementById('chatClose');
        const chatInput = document.getElementById('chatInput');
        const chatSendBtn = document.getElementById('chatSendBtn');
        const chatBody = document.getElementById('chatBody');
        const typingIndicator = document.getElementById('typingIndicator');
        const quickActionBtns = document.querySelectorAll('.quick-action-btn');
        const chatBadge = document.querySelector('.chat-badge');
        
        // Toggle chat window
        chatButton.addEventListener('click', () => {
            chatWindow.classList.toggle('active');
            chatButton.classList.toggle('active');
            if (chatWindow.classList.contains('active')) {
                chatInput.focus();
                // Hide badge when opened
                if (chatBadge) chatBadge.style.display = 'none';
            }
        });
        
        chatClose.addEventListener('click', () => {
            chatWindow.classList.remove('active');
            chatButton.classList.remove('active');
        });
        
        // Send message function
        function sendMessage(message) {
            if (!message.trim()) return;
            
            // Add user message
            const userMessage = document.createElement('div');
            userMessage.className = 'chat-message user';
            userMessage.innerHTML = `
                <div class="message-content">
                    <div class="message-bubble">${message}</div>
                    <div class="message-time">${getCurrentTime()}</div>
                </div>
                <div class="message-avatar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                    </svg>
                </div>
            `;
            
            chatBody.appendChild(userMessage);
            chatInput.value = '';
            scrollToBottom();
            
            // Show typing indicator
            setTimeout(() => {
                typingIndicator.classList.add('active');
                scrollToBottom();
            }, 500);
            
            // Simulate response
            setTimeout(() => {
                typingIndicator.classList.remove('active');
                addSupportMessage(getAutoResponse(message));
            }, 2000);
        }
        
        // Auto response based on message
        function getAutoResponse(message) {
            const msg = message.toLowerCase();
            
            if (msg.includes('send') || msg.includes('transfer')) {
                return "Great! To send money, go to your dashboard and click 'Send Money'. You can transfer to 150+ countries with low fees. Need help with a specific transfer?";
            } else if (msg.includes('track') || msg.includes('status')) {
                return "You can track your transfer anytime! Go to 'My Transfers' in your dashboard and click on the transaction you want to track. You'll see real-time updates.";
            } else if (msg.includes('fee') || msg.includes('cost')) {
                return "Our fees are transparent and competitive! They vary by country and amount. You can see the exact fee before confirming any transfer. Would you like to know fees for a specific country?";
            } else if (msg.includes('account') || msg.includes('verify')) {
                return "Account verification usually takes 24-48 hours. You'll receive an email once verified. Need help with your verification documents?";
            } else if (msg.includes('security') || msg.includes('safe')) {
                return "Your security is our top priority! We use bank-level encryption, 2FA, and are fully regulated. All transfers are monitored 24/7. Is there a specific security concern?";
            } else {
                return "Thanks for your message! Our support team will help you with that. For immediate assistance, you can also check our Help Center or call us at +1-800-XXX-XXXX.";
            }
        }
        
        // Add support message
        function addSupportMessage(message) {
            const supportMessage = document.createElement('div');
            supportMessage.className = 'chat-message support';
            supportMessage.innerHTML = `
                <div class="message-avatar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                    </svg>
                </div>
                <div class="message-content">
                    <div class="message-bubble">${message}</div>
                    <div class="message-time">${getCurrentTime()}</div>
                </div>
            `;
            
            chatBody.appendChild(supportMessage);
            scrollToBottom();
        }
        
        // Get current time
        function getCurrentTime() {
            const now = new Date();
            return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        }
        
        // Scroll to bottom
        function scrollToBottom() {
            chatBody.scrollTop = chatBody.scrollHeight;
        }
        
        // Send button click
        chatSendBtn.addEventListener('click', () => {
            sendMessage(chatInput.value);
        });
        
        // Enter key to send
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage(chatInput.value);
            }
        });
        
        // Quick action buttons
        quickActionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.getAttribute('data-action');
                sendMessage(action);
            });
        });
        
        // Show notification badge after 3 seconds (demo)
        setTimeout(() => {
            if (!chatWindow.classList.contains('active') && chatBadge) {
                chatBadge.style.display = 'flex';
            }
        }, 3000);