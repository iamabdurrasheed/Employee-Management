// Fix database records
const mongoose = require('mongoose');
const Employee = require('./models/Employee');

async function fixDatabase() {
    try {
        await mongoose.connect('mongodb://localhost:27017/employee-tracker', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('Connected to MongoDB');
        
        // Find employees without email
        const employeesWithoutEmail = await Employee.find({ 
            $or: [
                { email: { $exists: false } },
                { email: null },
                { email: '' }
            ]
        });
        
        console.log('Employees without email:', employeesWithoutEmail.length);
        
        for (let emp of employeesWithoutEmail) {
            console.log(`Fixing employee: ${emp.employeeId} - ${emp.fullName}`);
            
            // Set a default email based on employee ID
            emp.email = `${emp.employeeId.toLowerCase()}@company.com`;
            await emp.save();
            
            console.log(`Updated email to: ${emp.email}`);
        }
        
        // Verify all employees now have email
        const allEmployees = await Employee.find({}, 'employeeId fullName email designation');
        console.log('\nAll employees after fix:');
        allEmployees.forEach(emp => {
            console.log(`- ${emp.employeeId}: ${emp.fullName} (${emp.email}) - ${emp.designation}`);
        });
        
    } catch (error) {
        console.error('Database error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');
    }
}

fixDatabase();
