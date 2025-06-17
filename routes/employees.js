const express = require('express');
const { body, validationResult } = require('express-validator');
const Employee = require('../models/Employee');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/employees
// @desc    Get all employees
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search || '';
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    let query = {};
    if (search) {
      query = {
        $or: [
          { fullName: { $regex: search, $options: 'i' } },
          { employeeId: { $regex: search, $options: 'i' } },
          { designation: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const employees = await Employee.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'username')
      .lean();

    // Add calculated fields to each employee
    const employeesWithCalculations = employees.map(emp => {
      const employee = new Employee(emp);
      return {
        ...emp,
        age: employee.age,
        currentExperience: employee.currentExperience,
        totalExperience: employee.totalExperience
      };
    });

    const total = await Employee.countDocuments(query);

    res.json({
      employees: employeesWithCalculations,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/employees/:id
// @desc    Get employee by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate('createdBy', 'username');

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json(employee);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/employees
// @desc    Create new employee
// @access  Private
router.post('/', [
  auth,
  body('employeeId').notEmpty().withMessage('Employee ID is required'),
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('designation').notEmpty().withMessage('Designation is required'),
  body('dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
  body('dateOfJoining').isISO8601().withMessage('Valid date of joining is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      employeeId,
      fullName,
      designation,
      qualifications,
      dateOfBirth,
      dateOfJoining,
      previousExperience
    } = req.body;

    // Check if employee ID already exists
    let existingEmployee = await Employee.findOne({ employeeId });
    if (existingEmployee) {
      return res.status(400).json({ message: 'Employee ID already exists' });
    }

    // Validate dates
    const dob = new Date(dateOfBirth);
    const doj = new Date(dateOfJoining);
    const today = new Date();

    if (dob >= today) {
      return res.status(400).json({ message: 'Date of birth must be in the past' });
    }

    if (doj > today) {
      return res.status(400).json({ message: 'Date of joining cannot be in the future' });
    }

    if (dob >= doj) {
      return res.status(400).json({ message: 'Date of birth must be before date of joining' });
    }

    // Create employee
    const employee = new Employee({
      employeeId,
      fullName,
      designation,
      qualifications: qualifications || {},
      dateOfBirth: dob,
      dateOfJoining: doj,
      previousExperience: previousExperience || { years: 0, months: 0, days: 0 },
      createdBy: req.user._id
    });

    await employee.save();
    await employee.populate('createdBy', 'username');

    res.status(201).json(employee);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Employee ID already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/employees/:id
// @desc    Update employee
// @access  Private
router.put('/:id', [
  auth,
  body('employeeId').optional().notEmpty().withMessage('Employee ID cannot be empty'),
  body('fullName').optional().notEmpty().withMessage('Full name cannot be empty'),
  body('designation').optional().notEmpty().withMessage('Designation cannot be empty'),
  body('dateOfBirth').optional().isISO8601().withMessage('Valid date of birth is required'),
  body('dateOfJoining').optional().isISO8601().withMessage('Valid date of joining is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const {
      employeeId,
      fullName,
      designation,
      qualifications,
      dateOfBirth,
      dateOfJoining,
      previousExperience
    } = req.body;

    // Check if new employee ID conflicts with existing one
    if (employeeId && employeeId !== employee.employeeId) {
      const existingEmployee = await Employee.findOne({ employeeId });
      if (existingEmployee) {
        return res.status(400).json({ message: 'Employee ID already exists' });
      }
    }

    // Validate dates if provided
    if (dateOfBirth || dateOfJoining) {
      const dob = dateOfBirth ? new Date(dateOfBirth) : employee.dateOfBirth;
      const doj = dateOfJoining ? new Date(dateOfJoining) : employee.dateOfJoining;
      const today = new Date();

      if (dob >= today) {
        return res.status(400).json({ message: 'Date of birth must be in the past' });
      }

      if (doj > today) {
        return res.status(400).json({ message: 'Date of joining cannot be in the future' });
      }

      if (dob >= doj) {
        return res.status(400).json({ message: 'Date of birth must be before date of joining' });
      }
    }

    // Update fields
    if (employeeId) employee.employeeId = employeeId;
    if (fullName) employee.fullName = fullName;
    if (designation) employee.designation = designation;
    if (qualifications) employee.qualifications = { ...employee.qualifications, ...qualifications };
    if (dateOfBirth) employee.dateOfBirth = new Date(dateOfBirth);
    if (dateOfJoining) employee.dateOfJoining = new Date(dateOfJoining);
    if (previousExperience) {
      employee.previousExperience = {
        years: previousExperience.years || 0,
        months: previousExperience.months || 0,
        days: previousExperience.days || 0
      };
    }

    await employee.save();
    await employee.populate('createdBy', 'username');

    res.json(employee);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Employee not found' });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Employee ID already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/employees/:id
// @desc    Delete employee
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/employees/:id/experience
// @desc    Get real-time experience calculations for an employee
// @access  Private
router.get('/:id/experience', auth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json({
      age: employee.age,
      currentExperience: employee.currentExperience,
      totalExperience: employee.totalExperience,
      lastCalculated: new Date()
    });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
