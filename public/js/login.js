// Login functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check URL parameters to determine login type
    const urlParams = new URLSearchParams(window.location.search);
    const loginType = urlParams.get('type');
      if (loginType === 'admin') {
        showTab('admin');
    } else {
        showTab('employee');
    }

    // Employee login form handler
    document.getElementById('employeeLoginForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('employeeEmail').value;
        const password = document.getElementById('employeePassword').value;
        
        try {
            showMessage('Logging in...', 'info');
            
            const response = await fetch('/api/auth/employee/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Store token and user info
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                showMessage('Login successful! Redirecting...', 'success');
                
                // Force redirect after a short delay
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1500);
            } else {
                showMessage(data.message || 'Login failed', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            showMessage('Network error. Please try again.', 'error');
        }
    });

    // Admin login form handler
    document.getElementById('adminLoginForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('adminUsername').value;
        const password = document.getElementById('adminPassword').value;
        
        try {
            showMessage('Logging in...', 'info');
            
            const response = await fetch('/api/auth/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Store token and user info
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                  showMessage('Login successful! Redirecting...', 'success');
                
                // Force redirect after a short delay
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1500);
            } else {
                showMessage(data.message || 'Login failed', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            showMessage('Network error. Please try again.', 'error');
        }
    });
});

// Tab switching functionality
function showTab(tabName) {
    // Hide all forms
    const forms = document.querySelectorAll('.login-form');
    forms.forEach(form => form.classList.remove('active'));
    
    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.login-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Show selected form and tab
    document.getElementById(tabName + 'LoginForm').classList.add('active');
    
    // Add active class to the correct tab
    const targetTab = Array.from(tabs).find(tab => tab.textContent.toLowerCase().includes(tabName));
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // Clear form fields
    const activeForm = document.querySelector('.login-form.active');
    if (activeForm) {
        const inputs = activeForm.querySelectorAll('input');
        inputs.forEach(input => input.value = '');
    }
    
    // Clear message
    showMessage('', '');
}

// Message display function
function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.innerHTML = message;
    messageDiv.className = 'mt-2 text-center';
    
    if (type === 'success') {
        messageDiv.style.color = '#27ae60';
    } else if (type === 'error') {
        messageDiv.style.color = '#e74c3c';
    } else if (type === 'info') {
        messageDiv.style.color = '#3498db';
    } else {
        messageDiv.style.color = '#333';
    }
}
