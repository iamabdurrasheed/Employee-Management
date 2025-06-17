const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Employee = require('./models/Employee');

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Employee.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminUser = new User({
      username: 'admin',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });

    await adminUser.save();
    console.log('Admin user created');

    // Create regular user
    const regularUser = new User({
      username: 'user',
      email: 'user@example.com',
      password: 'password123',
      role: 'user'
    });

    await regularUser.save();
    console.log('Regular user created');

    // Create sample employees
    const sampleEmployees = [
      {
        employeeId: 'EMP001',
        fullName: 'John Doe',
        designation: 'Software Engineer',
        qualifications: {
          ug: 'B.Tech Computer Science',
          pg: 'M.Tech Software Engineering',
          phd: ''
        },
        dateOfBirth: new Date('1990-05-15'),
        dateOfJoining: new Date('2020-01-15'),
        previousExperience: {
          years: 2,
          months: 6,
          days: 0
        },
        createdBy: adminUser._id
      },
      {
        employeeId: 'EMP002',
        fullName: 'Jane Smith',
        designation: 'Project Manager',
        qualifications: {
          ug: 'B.E Electronics',
          pg: 'MBA',
          phd: ''
        },
        dateOfBirth: new Date('1988-08-22'),
        dateOfJoining: new Date('2019-03-10'),
        previousExperience: {
          years: 5,
          months: 2,
          days: 15
        },
        createdBy: adminUser._id
      },
      {
        employeeId: 'EMP003',
        fullName: 'Mike Johnson',
        designation: 'Senior Developer',
        qualifications: {
          ug: 'B.Sc Computer Science',
          pg: 'M.Sc Software Engineering',
          phd: 'Ph.D Computer Science'
        },
        dateOfBirth: new Date('1985-12-03'),
        dateOfJoining: new Date('2018-07-20'),
        previousExperience: {
          years: 8,
          months: 9,
          days: 10
        },
        createdBy: regularUser._id
      },
      {
        employeeId: 'EMP004',
        fullName: 'Sarah Williams',
        designation: 'UI/UX Designer',
        qualifications: {
          ug: 'B.Des Visual Communication',
          pg: 'M.Des Interaction Design',
          phd: ''
        },
        dateOfBirth: new Date('1992-03-18'),
        dateOfJoining: new Date('2021-09-01'),
        previousExperience: {
          years: 1,
          months: 8,
          days: 25
        },
        createdBy: regularUser._id
      },
      {
        employeeId: 'EMP005',
        fullName: 'David Brown',
        designation: 'Data Scientist',
        qualifications: {
          ug: 'B.Tech Information Technology',
          pg: 'M.Tech Data Science',
          phd: 'Ph.D Machine Learning'
        },
        dateOfBirth: new Date('1987-11-12'),
        dateOfJoining: new Date('2022-02-14'),
        previousExperience: {
          years: 6,
          months: 4,
          days: 8
        },
        createdBy: adminUser._id
      }
    ];

    await Employee.insertMany(sampleEmployees);
    console.log('Sample employees created');

    console.log('\n=== Seed Data Created Successfully ===');
    console.log('\nDefault Login Credentials:');
    console.log('Admin User:');
    console.log('  Email: admin@example.com');
    console.log('  Password: password123');
    console.log('\nRegular User:');
    console.log('  Email: user@example.com');
    console.log('  Password: password123');
    console.log('\nSample employees have been created with automatic experience calculations.');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
