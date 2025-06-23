const express = require('express');
const Employee = require('../models/Employee');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware to verify JWT token
const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Get all employees (Admin only)
router.get('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const employees = await Employee.find().select('-password');
        
        // Recalculate experience for all employees for real-time data
        const updatedEmployees = await Promise.all(
            employees.map(async (emp) => {
                emp.recalculateExperience();
                await emp.save();
                return emp;
            })
        );

        res.json(updatedEmployees);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single employee (Employee can only view their own data)
router.get('/:id', auth, async (req, res) => {
    try {
        let employee;
        
        if (req.user.role === 'admin') {
            employee = await Employee.findById(req.params.id).select('-password');        } else {
            // Employee can only view their own data
            employee = await Employee.findOne({ 
                _id: req.params.id, 
                email: req.user.email 
            }).select('-password');
        }

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Recalculate experience for real-time data
        employee.recalculateExperience();
        await employee.save();

        res.json(employee);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get employee by employee ID (for login dashboard)
router.get('/profile/:employeeId', auth, async (req, res) => {
    try {
        let employee;
        
        if (req.user.role === 'admin') {
            employee = await Employee.findOne({ employeeId: req.params.employeeId }).select('-password');
        } else {
            // Employee can only view their own data
            if (req.user.employeeId !== req.params.employeeId) {
                return res.status(403).json({ message: 'Access denied' });
            }
            employee = await Employee.findOne({ employeeId: req.params.employeeId }).select('-password');
        }

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Recalculate experience for real-time data
        employee.recalculateExperience();
        await employee.save();

        res.json(employee);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get employee by email (for login dashboard)
router.get('/profile/email/:email', auth, async (req, res) => {
    try {
        let employee;
        
        if (req.user.role === 'admin') {
            employee = await Employee.findOne({ email: req.params.email.toLowerCase() }).select('-password');
        } else {
            // Employee can only view their own data
            if (req.user.email !== req.params.email.toLowerCase()) {
                return res.status(403).json({ message: 'Access denied' });
            }
            employee = await Employee.findOne({ email: req.params.email.toLowerCase() }).select('-password');
        }

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Recalculate experience for real-time data
        employee.recalculateExperience();
        await employee.save();

        res.json(employee);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update employee (Admin only or employee updating their own non-sensitive data)
router.put('/:id', auth, async (req, res) => {
    try {
        let employee = await Employee.findById(req.params.id);
        
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }        // Check permissions
        if (req.user.role !== 'admin' && req.user.email !== employee.email) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const {
            fullName,
            designation,
            ugQualification,
            pgQualification,
            phdQualification,
            dateOfBirth,
            dateOfJoining,
            previousExperience,
            profilePhoto
        } = req.body;        // Update fields
        if (fullName) employee.fullName = fullName;
        if (designation) employee.designation = designation;
        if (ugQualification !== undefined) employee.ugQualification = ugQualification;
        if (pgQualification !== undefined) employee.pgQualification = pgQualification;
        if (phdQualification !== undefined) employee.phdQualification = phdQualification;
        if (dateOfBirth) employee.dateOfBirth = new Date(dateOfBirth);
        if (dateOfJoining) employee.dateOfJoining = new Date(dateOfJoining);
        if (previousExperience) employee.previousExperience = previousExperience;
        if (profilePhoto !== undefined) employee.profilePhoto = profilePhoto;

        await employee.save();

        // Return updated employee without password
        const updatedEmployee = await Employee.findById(req.params.id).select('-password');
        res.json(updatedEmployee);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete employee (Admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const employee = await Employee.findById(req.params.id);
        
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        await Employee.findByIdAndDelete(req.params.id);
        res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
