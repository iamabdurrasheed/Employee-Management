// Registration functionality
document.addEventListener('DOMContentLoaded', function() {
    // Profile photo preview functionality
    document.getElementById('profilePhoto').addEventListener('change', function(e) {
        const file = e.target.files[0];
        const preview = document.getElementById('photoPreview');
        
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.innerHTML = `
                    <div style="margin-top: 10px;">
                        <img src="${e.target.result}" style="max-width: 150px; max-height: 150px; border-radius: 10px; object-fit: cover;">
                        <p style="margin-top: 5px; font-size: 0.9rem; color: #666;">Preview</p>
                    </div>
                `;
            };
            reader.readAsDataURL(file);
        } else {
            preview.innerHTML = '';
        }
    });

    // Registration form handler
    document.getElementById('registrationForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Password confirmation check
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (password !== confirmPassword) {
            showMessage('Passwords do not match!', 'error');
            return;
        }
        
        // Get profile photo as base64
        let profilePhotoBase64 = null;
        const photoFile = document.getElementById('profilePhoto').files[0];
        if (photoFile) {
            profilePhotoBase64 = await fileToBase64(photoFile);
        }
        
        // Collect form data
        const formData = {
            employeeId: document.getElementById('employeeId').value,
            email: document.getElementById('email').value,
            password: password,
            fullName: document.getElementById('fullName').value,
            designation: document.getElementById('designation').value,
            dateOfBirth: document.getElementById('dateOfBirth').value,
            dateOfJoining: document.getElementById('dateOfJoining').value,
            ugQualification: document.getElementById('ugQualification').value,
            pgQualification: document.getElementById('pgQualification').value,
            phdQualification: document.getElementById('phdQualification').value,
            previousExperience: collectPreviousExperience(),
            profilePhoto: profilePhotoBase64
        };
        
        try {
            showMessage('Registering employee...', 'info');
            
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                showMessage('Employee registered successfully!', 'success');
                // Reset form
                document.getElementById('registrationForm').reset();
                document.getElementById('previousExperienceContainer').innerHTML = '';
                document.getElementById('photoPreview').innerHTML = '';
                
                setTimeout(() => {
                    window.location.href = '/login?type=employee';
                }, 2000);
            } else {
                showMessage(data.message || 'Registration failed', 'error');
            }
        } catch (error) {
            console.error('Registration error:', error);
            showMessage('Network error. Please try again.', 'error');
        }
    });

    // Set max date for date inputs
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dateOfBirth').max = today;
    document.getElementById('dateOfJoining').max = today;
});

// Convert file to base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Previous experience counter
let previousExperienceCount = 0;

// Add previous experience entry
function addPreviousExperience() {
    const container = document.getElementById('previousExperienceContainer');
    const experienceId = `prevExp_${previousExperienceCount}`;
    
    const experienceHTML = `
        <div class="experience-item" id="${experienceId}">
            <div class="form-row">
                <div class="form-col">
                    <div class="form-group">
                        <label class="form-label">Organization</label>
                        <input type="text" name="organization" class="form-control" required>
                    </div>
                </div>
                <div class="form-col">
                    <button type="button" class="btn btn-danger" onclick="removePreviousExperience('${experienceId}')" style="margin-top: 1.8rem;">Remove</button>
                </div>
            </div>
            <div class="form-row">
                <div class="form-col">
                    <div class="form-group">
                        <label class="form-label">From Date</label>
                        <input type="date" name="fromDate" class="form-control" required>
                    </div>
                </div>
                <div class="form-col">
                    <div class="form-group">
                        <label class="form-label">To Date</label>
                        <input type="date" name="toDate" class="form-control" required>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', experienceHTML);
    previousExperienceCount++;
    
    // Set max date for new date inputs
    const today = new Date().toISOString().split('T')[0];
    const newItem = document.getElementById(experienceId);
    newItem.querySelector('input[name="fromDate"]').max = today;
    newItem.querySelector('input[name="toDate"]').max = today;
    
    // Add validation for date range
    const fromDateInput = newItem.querySelector('input[name="fromDate"]');
    const toDateInput = newItem.querySelector('input[name="toDate"]');
    
    fromDateInput.addEventListener('change', function() {
        toDateInput.min = this.value;
    });
    
    toDateInput.addEventListener('change', function() {
        fromDateInput.max = this.value;
    });
}

// Remove previous experience entry
function removePreviousExperience(experienceId) {
    const element = document.getElementById(experienceId);
    if (element) {
        element.remove();
    }
}

// Collect previous experience data
function collectPreviousExperience() {
    const experiences = [];
    const experienceItems = document.querySelectorAll('.experience-item');
    
    experienceItems.forEach(item => {
        const organization = item.querySelector('input[name="organization"]').value;
        const fromDate = item.querySelector('input[name="fromDate"]').value;
        const toDate = item.querySelector('input[name="toDate"]').value;
        
        if (organization && fromDate && toDate) {
            experiences.push({
                organization,
                fromDate,
                toDate
            });
        }
    });
    
    return experiences;
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
