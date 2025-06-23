const mongoose = require('mongoose');
const Employee = require('./models/Employee');

async function checkAdmin() {
    try {
        await mongoose.connect('mongodb://localhost:27017/employee-tracker');
        console.log('Connected to MongoDB');
        
        // Find admin users
        const admins = await Employee.find({ role: 'admin' });
        console.log('Admin users found:', admins.length);
        
        if (admins.length > 0) {
            admins.forEach((admin, index) => {
                console.log(`Admin ${index + 1}:`);
                console.log(`  Username: ${admin.username}`);
                console.log(`  Email: ${admin.email}`);
                console.log(`  Role: ${admin.role}`);
                console.log('');
            });
        } else {
            console.log('No admin users found. Creating default admin...');
            
            const defaultAdmin = new Employee({
                username: 'admin',
                email: 'admin@company.com',
                password: 'admin123',
                role: 'admin',
                fullName: 'System Administrator',
                designation: 'Administrator',
                employeeId: 'ADMIN001',
                dateOfBirth: new Date('1990-01-01'),
                dateOfJoining: new Date()
            });
            
            await defaultAdmin.save();
            console.log('Default admin user created:');
            console.log('  Username: admin');
            console.log('  Password: admin123');
            console.log('  Email: admin@company.com');
        }
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

checkAdmin();
