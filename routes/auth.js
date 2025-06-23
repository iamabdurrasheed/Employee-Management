const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');
const router = express.Router();

// Employee Login
router.post('/employee/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find employee by email
        const employee = await Employee.findOne({ email: email.toLowerCase() });
        if (!employee) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, employee.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Recalculate experience for real-time data
        employee.recalculateExperience();
        await employee.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: employee._id, employeeId: employee.employeeId, email: employee.email, role: 'employee' },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: employee._id,
                employeeId: employee.employeeId,
                email: employee.email,
                fullName: employee.fullName,
                role: 'employee'
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin Login
router.post('/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check admin credentials
        if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
            return res.status(400).json({ message: 'Invalid admin credentials' });
        }

        // Generate JWT token for admin
        const token = jwt.sign(
            { role: 'admin', username },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                username,
                role: 'admin'
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Employee Registration
router.post('/register', async (req, res) => {
    try {
        const {
            employeeId,
            email,
            password,
            fullName,
            designation,
            ugQualification,
            pgQualification,
            phdQualification,
            dateOfBirth,
            dateOfJoining,
            previousExperience,
            profilePhoto
        } = req.body;

        // Check if employee already exists by employeeId or email
        const existingEmployee = await Employee.findOne({ 
            $or: [{ employeeId }, { email: email.toLowerCase() }] 
        });
        if (existingEmployee) {
            return res.status(400).json({ 
                message: existingEmployee.employeeId === employeeId 
                    ? 'Employee ID already exists' 
                    : 'Email already registered' 
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new employee
        const employee = new Employee({
            employeeId,
            email: email.toLowerCase(),
            password: hashedPassword,
            fullName,
            designation,
            ugQualification,
            pgQualification,
            phdQualification,
            dateOfBirth: new Date(dateOfBirth),
            dateOfJoining: new Date(dateOfJoining),
            previousExperience: previousExperience || [],
            profilePhoto: profilePhoto || null
        });

        await employee.save();

        res.status(201).json({ message: 'Employee registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
