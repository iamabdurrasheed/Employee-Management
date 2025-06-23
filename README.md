# Employee Experience Tracker

A comprehensive employee management system built with **MongoDB, Express.js, Node.js, HTML, CSS, and JavaScript** that tracks detailed employee information including automatic experience calculations.

## Features

### 🎯 **Experience Tracking**
- **Current Institution Experience**: Auto-calculated from joining date
- **Previous Institution Experience**: Manual entry with organization details
- **Total Professional Experience**: Auto-calculated sum of current + previous
- **Real-time Updates**: Experience recalculated on every access

### 👤 **Employee Information Management**
- Employee ID (unique identifier)
- Full Name, Designation/Role
- Educational Qualifications (UG, PG, PhD)
- Date of Birth (with automatic age calculation)
- Date of Joining (current institution)

### 🔐 **Security & Access Control**
- **Employee Login**: View personal details only
- **Admin Login**: Manage all employees
- **Registration**: Add new employees
- JWT-based authentication

### 📊 **Experience Calculations**
- Automatic calculation of age from date of birth
- Current experience from joining date
- Total experience (current + previous)
- Display in "X years Y months Z days" format
- Proper handling of month boundaries
- Server-side calculations for accuracy

## Technical Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcryptjs

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

### Step 1: Clone/Download
```bash
cd c:\Users\abdur\OneDrive\Desktop\FS Mern\Employee app
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Environment Configuration
Create a `.env` file in the root directory with:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/employee-tracker
JWT_SECRET=your-secret-key-here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### Step 4: Start MongoDB
Make sure MongoDB is running on your system:
```bash
# If using local MongoDB
mongod

# If using MongoDB service
net start MongoDB
```

### Step 5: Run the Application
```bash
npm start
# or for development with auto-restart
npm run dev
```

### Step 6: Access the Application
Open your browser and navigate to: `http://localhost:5000`

## Usage Guide

### 1. Home Page
- Access the main page at `http://localhost:5000`
- Choose from Employee Login, Admin Login, or Registration

### 2. Employee Registration
- Click "Register Employee"
- Fill in all required fields:
  - Employee ID (unique)
  - Password
  - Full Name
  - Designation
  - Date of Birth
  - Date of Joining
  - Educational Qualifications (optional)
  - Previous Experience (optional)

### 3. Employee Login
- Use Employee ID and Password
- View personal dashboard with:
  - Experience summary cards
  - Personal information
  - Educational qualifications
  - Previous experience details

### 4. Admin Login
- Use admin credentials (admin/admin123)
- View all employees in a table
- Click "View" to see detailed employee information
- Delete employees if needed

## API Endpoints

### Authentication
- `POST /api/auth/employee/login` - Employee login
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/register` - Employee registration

### Employee Management
- `GET /api/employees` - Get all employees (Admin only)
- `GET /api/employees/:id` - Get employee by ID
- `GET /api/employees/profile/:employeeId` - Get employee by Employee ID
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee (Admin only)

## Experience Calculation Logic

### Current Experience
- Calculated from `dateOfJoining` to current date
- Updates automatically on every access

### Previous Experience
- Manual entry with organization details
- From date and To date validation
- Automatic duration calculation

### Total Experience
- Sum of current + all previous experiences
- Proper handling of days, months, years
- Conversion: 30 days = 1 month, 12 months = 1 year

## File Structure

```
Employee app/
├── models/
│   └── Employee.js          # Employee schema with calculations
├── routes/
│   ├── auth.js              # Authentication routes
│   └── employees.js         # Employee CRUD routes
├── public/
│   ├── css/
│   │   └── style.css        # Modern responsive styles
│   ├── js/
│   │   ├── login.js         # Login functionality
│   │   ├── register.js      # Registration functionality
│   │   └── dashboard.js     # Dashboard functionality
│   ├── index.html           # Home page
│   ├── login.html           # Login page
│   ├── register.html        # Registration page
│   └── dashboard.html       # Dashboard page
├── .env                     # Environment variables
├── package.json             # Dependencies
├── server.js                # Main server file
└── README.md               # This file
```

## Default Admin Credentials

- **Username**: admin
- **Password**: admin123

## Key Features Implemented

✅ **Automatic Experience Calculations**
- Real-time current experience calculation
- Automatic total experience summation
- Proper date handling and validation

✅ **Comprehensive Employee Management**
- Complete CRUD operations
- Role-based access control
- Secure authentication

✅ **Modern User Interface**
- Responsive design
- Glass-morphism effects
- Smooth animations and transitions

✅ **Data Validation**
- Form validation on frontend
- Server-side validation
- Proper error handling

✅ **Security Features**
- Password hashing
- JWT authentication
- Protected routes

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify MongoDB service is started

### Application Won't Start
- Check if port 5000 is available
- Verify all dependencies are installed
- Check for any typos in `.env` file

### Login Issues
- Verify credentials are correct
- Check browser console for errors
- Clear browser cache and cookies

## Future Enhancements

- Employee profile editing
- Advanced reporting and analytics
- File upload for documents
- Email notifications
- Backup and restore functionality
- Multiple admin roles

## Support

For issues or questions, please check:
1. Console logs for error messages
2. Network tab in browser dev tools
3. Server logs in terminal

---

**Employee Experience Tracker** - Built with ❤️ for comprehensive employee management
