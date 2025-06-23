// Database check script
const mongoose = require('mongoose');
const Employee = require('./models/Employee');

async function checkDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://localhost:27017/employee-tracker', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('Connected to MongoDB');
        
        // Count employees
        const count = await Employee.countDocuments();
        console.log('Total employees in database:', count);
        
        // Get all employees
        const employees = await Employee.find({}, 'employeeId fullName email designation');
        console.log('Employees:');
        employees.forEach(emp => {
            console.log(`- ${emp.employeeId}: ${emp.fullName} (${emp.email}) - ${emp.designation}`);
        });
        
        if (employees.length === 0) {
            console.log('No employees found. Creating a test employee...');
            
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash('password123', 10);
            
            const testEmployee = new Employee({
                employeeId: 'TEST001',
                email: 'test@example.com',
                password: hashedPassword,
                fullName: 'Test Employee',
                designation: 'Software Developer',
                dateOfBirth: new Date('1990-01-01'),
                dateOfJoining: new Date('2023-01-01'),
                ugQualification: 'Bachelor of Technology',
                pgQualification: '',
                phdQualification: '',
                previousExperience: []
            });
            
            await testEmployee.save();
            console.log('Test employee created successfully!');
        }
        
    } catch (error) {
        console.error('Database error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

checkDatabase();
