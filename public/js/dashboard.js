// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard loading...');
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Ensure modal is hidden on page load
    const modal = document.getElementById('employeeModal');
    if (modal) {
        console.log('Hiding modal on page load');
        modal.classList.add('hidden');
        modal.style.display = 'none';
    }
    
    // Check if user is logged in
    if (!token || !user.role) {
        window.location.href = '/login';
        return;
    }
    
    console.log('User role:', user.role);
    // Initialize dashboard based on user role
    initializeDashboard(user);
});

// Initialize dashboard
function initializeDashboard(user) {
    console.log('Initializing dashboard for user:', user);
    const userInfo = document.getElementById('userInfo');
    const dashboardTitle = document.getElementById('dashboardTitle');
    const modal = document.getElementById('employeeModal');
    
    if (user.role === 'admin') {
        console.log('Setting up admin dashboard');
        userInfo.textContent = `Welcome, Admin (${user.username})`;
        dashboardTitle.textContent = 'Admin Dashboard';
        
        // Hide employee dashboard if visible
        const employeeDashboard = document.getElementById('employeeDashboard');
        if (employeeDashboard) {
            employeeDashboard.classList.add('hidden');
        }
        
        showAdminDashboard();
    } else if (user.role === 'employee') {
        console.log('Setting up employee dashboard');
        userInfo.textContent = `Welcome, ${user.fullName} (${user.email})`;
        dashboardTitle.textContent = 'Employee Dashboard';
        
        // Hide admin dashboard if visible
        const adminDashboard = document.getElementById('adminDashboard');
        if (adminDashboard) {
            adminDashboard.classList.add('hidden');
        }
        
        // Hide modal completely for employee users
        if (modal) {
            modal.style.display = 'none';
            modal.classList.add('hidden');
        }
        
        showEmployeeDashboard(user.email);
    }
}

// Show employee dashboard
async function showEmployeeDashboard(email) {
    const employeeDashboard = document.getElementById('employeeDashboard');
    const loading = document.getElementById('loading');
    const modal = document.getElementById('employeeModal');
    
    // Ensure modal is hidden for employee dashboard
    if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
    }
    
    try {
        loading.classList.remove('hidden');
        
        const response = await fetch(`/api/employees/profile/email/${encodeURIComponent(email)}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (response.ok) {
            const employee = await response.json();
            populateEmployeeDetails(employee);
            employeeDashboard.classList.remove('hidden');
        } else {
            throw new Error('Failed to load employee data');
        }
    } catch (error) {
        console.error('Error loading employee data:', error);
        alert('Error loading employee data');
    } finally {
        loading.classList.add('hidden');
    }
}

// Show admin dashboard
async function showAdminDashboard() {
    console.log('Loading admin dashboard...');
    const adminDashboard = document.getElementById('adminDashboard');
    const loading = document.getElementById('loading');
    
    try {
        loading.classList.remove('hidden');
        
        console.log('Fetching employees...');
        const response = await fetch('/api/employees', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        console.log('Response status:', response.status);
        
        if (response.ok) {
            const employees = await response.json();
            console.log('Employees received:', employees.length, employees);
            populateEmployeeTable(employees);
            adminDashboard.classList.remove('hidden');
        } else {
            const errorData = await response.json();
            console.error('Failed to load employees:', errorData);
            throw new Error(`Failed to load employees data: ${errorData.message || response.statusText}`);
        }
    } catch (error) {
        console.error('Error loading employees data:', error);
        
        // Show error message in the admin dashboard
        const adminDashboard = document.getElementById('adminDashboard');
        adminDashboard.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h2 class="card-title">Error Loading Data</h2>
                </div>
                <div style="padding: 2rem; text-align: center;">
                    <p style="color: #e74c3c; font-size: 1.1rem;">
                        ${error.message}
                    </p>
                    <button class="btn btn-primary" onclick="showAdminDashboard()">Retry</button>
                </div>
            </div>
        `;
        adminDashboard.classList.remove('hidden');
    } finally {
        loading.classList.add('hidden');
    }
}

// Populate employee details
function populateEmployeeDetails(employee) {
    // Experience summary
    document.getElementById('currentExp').textContent = formatExperience(employee.currentExperience);
    document.getElementById('previousExp').textContent = formatExperience(employee.totalPreviousExperience);
    document.getElementById('totalExp').textContent = formatExperience(employee.totalExperience);
    document.getElementById('age').textContent = formatExperience(employee.age);
    
    // Personal information
    document.getElementById('empFullName').textContent = employee.fullName;
    document.getElementById('empId').textContent = employee.employeeId;
    document.getElementById('empEmail').textContent = employee.email;
    document.getElementById('empDesignation').textContent = employee.designation;
    document.getElementById('empDOB').textContent = formatDate(employee.dateOfBirth);
    document.getElementById('empDOJ').textContent = formatDate(employee.dateOfJoining);
    
    // Profile photo
    const photoContainer = document.getElementById('empPhoto');
    if (employee.profilePhoto) {
        photoContainer.innerHTML = `<img src="${employee.profilePhoto}" alt="Profile Photo" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover;">`;
    } else {
        photoContainer.innerHTML = `<div style="width: 100px; height: 100px; border-radius: 50%; background: #ecf0f1; display: flex; align-items: center; justify-content: center; color: #7f8c8d;">No Photo</div>`;
    }
    
    // Educational qualifications
    document.getElementById('empUG').textContent = employee.ugQualification || 'Not specified';
    document.getElementById('empPG').textContent = employee.pgQualification || 'Not specified';
    document.getElementById('empPhD').textContent = employee.phdQualification || 'Not specified';
    
    // Previous experience
    populatePreviousExperience(employee.previousExperience);
}

// Populate previous experience
function populatePreviousExperience(previousExperience) {
    const container = document.getElementById('previousExperienceList');
    
    if (!previousExperience || previousExperience.length === 0) {
        container.innerHTML = '<p>No previous experience recorded.</p>';
        return;
    }
    
    container.innerHTML = previousExperience.map(exp => `
        <div class="experience-item">
            <h4>${exp.organization}</h4>
            <div class="detail-item">
                <span class="detail-label">Duration</span>
                <span class="detail-value">${formatDate(exp.fromDate)} to ${formatDate(exp.toDate)}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Experience</span>
                <span class="detail-value">${exp.years} years, ${exp.months} months, ${exp.days} days</span>
            </div>
        </div>
    `).join('');
}

// Populate employee table for admin
function populateEmployeeTable(employees) {
    console.log('Populating employee table with', employees.length, 'employees');
    const tbody = document.getElementById('employeeTableBody');
    
    if (!tbody) {
        console.error('Employee table body not found');
        return;
    }
    
    if (employees.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center">No employees found</td></tr>';
        return;
    }
    
    tbody.innerHTML = employees.map(emp => {
        console.log('Processing employee:', emp.fullName, 'ID:', emp._id);
        return `
        <tr>
            <td>${emp.employeeId}</td>
            <td>${emp.fullName}</td>
            <td>${emp.email}</td>
            <td>${emp.designation}</td>
            <td>${formatExperience(emp.age)}</td>
            <td>${formatExperience(emp.currentExperience)}</td>
            <td>${formatExperience(emp.totalExperience)}</td>
            <td>
                <button class="btn btn-primary" onclick="viewEmployee('${emp._id}')">View</button>
                <button class="btn btn-danger" onclick="deleteEmployee('${emp._id}', '${emp.fullName}')">Delete</button>
            </td>
        </tr>`;
    }).join('');
    
    console.log('Employee table populated successfully');
}

// View employee details (admin)
async function viewEmployee(employeeId) {
    console.log('viewEmployee called with ID:', employeeId);
    try {
        const response = await fetch(`/api/employees/${employeeId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        console.log('Response status:', response.status);
        
        if (response.ok) {
            const employee = await response.json();
            console.log('Employee data received:', employee);
            showEmployeeModal(employee);
        } else {
            const errorData = await response.json();
            console.error('API Error:', errorData);
            throw new Error(`Failed to load employee details: ${errorData.message || response.statusText}`);
        }
    } catch (error) {
        console.error('Error loading employee details:', error);
        alert(`Error loading employee details: ${error.message}`);
    }
}

// Show employee modal
function showEmployeeModal(employee) {
    console.log('Showing modal for employee:', employee.fullName);
    const modal = document.getElementById('employeeModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    if (!modal || !modalTitle || !modalBody) {
        console.error('Modal elements not found');
        return;
    }
    
    modalTitle.textContent = `${employee.fullName} - Details`;
    modalBody.innerHTML = `
        <div class="text-center mb-2">
            ${employee.profilePhoto ? 
                `<img src="${employee.profilePhoto}" alt="Profile Photo" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin-bottom: 1rem;">` :
                `<div style="width: 120px; height: 120px; border-radius: 50%; background: #ecf0f1; display: flex; align-items: center; justify-content: center; color: #7f8c8d; margin: 0 auto 1rem;">No Photo</div>`
            }
        </div>
        <div class="employee-details">
            <div class="detail-section">
                <h3>Personal Information</h3>
                <div class="detail-item">
                    <span class="detail-label">Full Name</span>
                    <span class="detail-value">${employee.fullName}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Employee ID</span>
                    <span class="detail-value">${employee.employeeId}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Email</span>
                    <span class="detail-value">${employee.email}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Designation</span>
                    <span class="detail-value">${employee.designation}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Date of Birth</span>
                    <span class="detail-value">${formatDate(employee.dateOfBirth)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Date of Joining</span>
                    <span class="detail-value">${formatDate(employee.dateOfJoining)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Age</span>
                    <span class="detail-value">${formatExperience(employee.age)}</span>
                </div>
            </div>
            
            <div class="detail-section">
                <h3>Educational Qualifications</h3>
                <div class="detail-item">
                    <span class="detail-label">UG Qualification</span>
                    <span class="detail-value">${employee.ugQualification || 'Not specified'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">PG Qualification</span>
                    <span class="detail-value">${employee.pgQualification || 'Not specified'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">PhD Qualification</span>
                    <span class="detail-value">${employee.phdQualification || 'Not specified'}</span>
                </div>
            </div>
            
            <div class="detail-section">
                <h3>Experience Summary</h3>
                <div class="detail-item">
                    <span class="detail-label">Current Experience</span>
                    <span class="detail-value">${formatExperience(employee.currentExperience)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Previous Experience</span>
                    <span class="detail-value">${formatExperience(employee.totalPreviousExperience)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Total Experience</span>
                    <span class="detail-value">${formatExperience(employee.totalExperience)}</span>
                </div>
            </div>
        </div>
        
        ${employee.previousExperience && employee.previousExperience.length > 0 ? `
            <div class="detail-section">
                <h3>Previous Experience Details</h3>
                ${employee.previousExperience.map(exp => `
                    <div class="experience-item">
                        <h4>${exp.organization}</h4>
                        <div class="detail-item">
                            <span class="detail-label">Duration</span>
                            <span class="detail-value">${formatDate(exp.fromDate)} to ${formatDate(exp.toDate)}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Experience</span>
                            <span class="detail-value">${exp.years} years, ${exp.months} months, ${exp.days} days</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        ` : ''}
    `;
    
    // Remove hidden class and show the modal
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
    console.log('Modal should now be visible');
}

// Close modal
function closeModal() {
    console.log('Closing modal');
    const modal = document.getElementById('employeeModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
        // Clear modal content
        const modalBody = document.getElementById('modalBody');
        if (modalBody) {
            modalBody.innerHTML = '';
        }
    }
}

// Also close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('employeeModal');
    if (modal && event.target === modal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Delete employee (admin)
async function deleteEmployee(employeeId, employeeName) {
    if (!confirm(`Are you sure you want to delete ${employeeName}?`)) {
        return;
    }
    
    try {
        const response = await fetch(`/api/employees/${employeeId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (response.ok) {
            alert('Employee deleted successfully');
            // Refresh admin dashboard
            showAdminDashboard();
        } else {
            throw new Error('Failed to delete employee');
        }
    } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Error deleting employee');
    }
}

// Edit employee (placeholder)
function editEmployee() {
    alert('Edit functionality will be implemented in future updates');
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatExperience(exp) {
    if (!exp || (exp.years === 0 && exp.months === 0 && exp.days === 0)) {
        return 'N/A';
    }
    
    const parts = [];
    if (exp.years > 0) parts.push(`${exp.years} year${exp.years !== 1 ? 's' : ''}`);
    if (exp.months > 0) parts.push(`${exp.months} month${exp.months !== 1 ? 's' : ''}`);
    if (exp.days > 0) parts.push(`${exp.days} day${exp.days !== 1 ? 's' : ''}`);
      return parts.join(', ') || 'N/A';
}

// Make functions globally accessible for onclick handlers
window.viewEmployee = viewEmployee;
window.deleteEmployee = deleteEmployee;
window.closeModal = closeModal;
window.editEmployee = editEmployee;
