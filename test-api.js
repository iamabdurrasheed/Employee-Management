// Test script to validate API endpoints
async function testAPI() {
    const baseURL = 'http://localhost:5000';
    
    console.log('Testing Employee Registration...');
    
    // Test employee registration
    const registrationData = {
        employeeId: 'EMP001',
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test Employee',
        designation: 'Software Developer',
        dateOfBirth: '1990-01-01',
        dateOfJoining: '2023-01-01',
        ugQualification: 'Bachelor of Technology',
        pgQualification: '',
        phdQualification: '',
        previousExperience: [],
        profilePhoto: null
    };
    
    try {
        const response = await fetch(`${baseURL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registrationData)
        });
        
        const result = await response.json();
        console.log('Registration Response:', result);
        
        if (response.ok) {
            console.log('✅ Registration successful');
            
            // Test employee login
            console.log('Testing Employee Login...');
            const loginResponse = await fetch(`${baseURL}/api/auth/employee/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: 'test@example.com',
                    password: 'password123'
                })
            });
            
            const loginResult = await loginResponse.json();
            console.log('Login Response:', loginResult);
            
            if (loginResponse.ok) {
                console.log('✅ Login successful');
                
                // Test getting employee profile
                console.log('Testing Profile Fetch...');
                const profileResponse = await fetch(`${baseURL}/api/employees/profile/email/test@example.com`, {
                    headers: {
                        'Authorization': `Bearer ${loginResult.token}`
                    }
                });
                
                if (profileResponse.ok) {
                    const profile = await profileResponse.json();
                    console.log('✅ Profile fetch successful');
                    console.log('Profile data:', profile);
                } else {
                    console.log('❌ Profile fetch failed');
                }
            } else {
                console.log('❌ Login failed:', loginResult.message);
            }
        } else {
            console.log('❌ Registration failed:', result.message);
        }
    } catch (error) {
        console.error('❌ API Test Error:', error);
    }
    
    // Test admin login
    console.log('Testing Admin Login...');
    try {
        const adminResponse = await fetch(`${baseURL}/api/auth/admin/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'admin',
                password: 'admin123'
            })
        });
        
        const adminResult = await adminResponse.json();
        
        if (adminResponse.ok) {
            console.log('✅ Admin login successful');
        } else {
            console.log('❌ Admin login failed:', adminResult.message);
        }
    } catch (error) {
        console.error('❌ Admin Login Error:', error);
    }
}

// Run the test
testAPI();
