# Employee Experience Tracker - MERN Stack

A comprehensive employee management system built with the MERN stack that tracks detailed employee information with automatic experience calculations.

## Features

### 🎯 Core Functionality
- **Employee Management**: Complete CRUD operations for employee records
- **Real-time Experience Calculations**: Automatic calculation of current, previous, and total experience
- **Auto-updating Fields**: Experience calculations update automatically when dates are modified
- **Age Calculation**: Automatic age calculation from date of birth

### 👥 User Management
- **Authentication System**: JWT-based authentication with login/register
- **Password Reset**: Forgot password functionality with email reset links
- **Role-based Access**: Admin and User roles with different permissions
- **Admin Panel**: Complete user credential management for administrators

### 📊 Experience Tracking
- **Current Institution Experience**: Auto-calculated from joining date to current date
- **Previous Institution Experience**: Manual entry with validation
- **Total Professional Experience**: Auto-calculated sum of current and previous experience
- **Format**: Displays as "X years Y months Z days"

### 🔧 Technical Features
- **Responsive UI**: Material-UI components with mobile-friendly design
- **Data Tables**: Advanced DataGrid with sorting, filtering, and pagination
- **Form Validation**: Comprehensive client and server-side validation
- **Real-time Updates**: Live experience calculations that update every minute
- **Search & Filter**: Advanced search functionality across employee records

## Tech Stack

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing
- **Nodemailer**: Email functionality for password reset
- **Moment.js**: Date manipulation and formatting

### Frontend
- **React**: User interface library
- **Material-UI (MUI)**: React component library
- **React Router**: Client-side routing
- **Axios**: HTTP client for API requests
- **React Hot Toast**: Toast notifications
- **Moment.js**: Date formatting and calculations

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn package manager

### Backend Setup

1. **Clone and navigate to the project directory**
   ```bash
   cd "Employee app"
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/employee_tracker
   JWT_SECRET=your_jwt_secret_key_here_change_in_production
   JWT_EXPIRE=7d
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   CLIENT_URL=http://localhost:3000
   ```

4. **Database Setup**
   - Install MongoDB locally or use MongoDB Atlas
   - Ensure MongoDB is running on the specified URI

### Frontend Setup

1. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   ```

2. **Return to root directory**
   ```bash
   cd ..
   ```

## Running the Application

### Development Mode

1. **Start both backend and frontend concurrently**
   ```bash
   npm run dev
   ```

   This command will:
   - Start the Express server on port 5000
   - Start the React development server on port 3000
   - Open the application in your default browser

### Individual Services

1. **Backend only**
   ```bash
   npm run server
   ```

2. **Frontend only**
   ```bash
   npm run client
   ```

### Production Mode

1. **Build the React app**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Send password reset email
- `PUT /api/auth/reset-password/:token` - Reset password with token

### Employees
- `GET /api/employees` - Get all employees (with pagination, search, sort)
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee
- `GET /api/employees/:id/experience` - Get real-time experience calculations

### Admin (Admin Only)
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get user by ID
- `POST /api/admin/users` - Create new user
- `PUT /api/admin/users/:id` - Update user credentials
- `DELETE /api/admin/users/:id` - Delete user
- `PUT /api/admin/users/:id/toggle-status` - Toggle user active status
- `GET /api/admin/dashboard` - Get admin dashboard statistics

## Employee Data Structure

### Employee Fields
```javascript
{
  employeeId: String (unique),
  fullName: String,
  designation: String,
  qualifications: {
    ug: String,
    pg: String,
    phd: String
  },
  dateOfBirth: Date,
  dateOfJoining: Date,
  previousExperience: {
    years: Number,
    months: Number,
    days: Number
  }
}
```

### Auto-calculated Fields
```javascript
{
  age: Number, // Calculated from dateOfBirth
  currentExperience: {
    years: Number,
    months: Number,
    days: Number
  }, // Calculated from dateOfJoining to current date
  totalExperience: {
    years: Number,
    months: Number,
    days: Number
  } // Sum of current + previous experience
}
```

## Experience Calculation Logic

### Current Experience
- Calculated from `dateOfJoining` to current date
- Updates automatically in real-time
- Handles month boundaries properly (30 days = 1 month)

### Total Experience
- Sum of current experience and previous experience
- Automatically handles overflow (days → months → years)
- Recalculates when joining date or previous experience is updated

### Validation Rules
- Date of birth must be in the past
- Date of joining cannot be in the future
- Date of birth must be before date of joining
- Experience values cannot be negative
- Months cannot exceed 11
- Days cannot exceed 30

## User Roles & Permissions

### Admin Users
- Full access to employee management
- User credential management
- Create, edit, delete users
- Toggle user active/inactive status
- View admin dashboard with statistics
- Cannot deactivate or delete their own account

### Regular Users
- Employee management (CRUD operations)
- View dashboard with employee statistics
- Cannot access admin panel or user management

## Default Credentials

For testing purposes, you can create users with these credentials:

**Admin User:**
- Email: admin@example.com
- Password: password123
- Role: admin

**Regular User:**
- Email: user@example.com
- Password: password123
- Role: user

## Features in Detail

### Real-time Experience Updates
- Experience calculations update automatically every minute
- Manual refresh option available
- Immediate recalculation when dates are modified
- Server-side calculation ensures accuracy

### Password Reset Flow
1. User requests password reset with email
2. System generates secure reset token
3. Email sent with reset link (10-minute expiry)
4. User clicks link and sets new password
5. Automatic login after successful reset

### Admin User Management
- Create users with specific roles
- Update user credentials (username, email, password, role)
- Toggle user active/inactive status
- Delete users (except self)
- View user statistics and recent activity

### Data Validation
- Client-side validation for immediate feedback
- Server-side validation for security
- Comprehensive error messages
- Form field highlighting for errors

### Search & Filtering
- Real-time search across employee fields
- Search by name, employee ID, or designation
- Server-side pagination for performance
- Sortable columns in data tables

## Deployment

### Environment Variables for Production
Update the `.env` file with production values:
```env
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_strong_jwt_secret
EMAIL_USER=your_production_email
EMAIL_PASS=your_production_email_password
CLIENT_URL=your_production_domain
```

### MongoDB Atlas Setup
1. Create MongoDB Atlas account
2. Create a new cluster
3. Get connection string
4. Update MONGODB_URI in .env

### Email Configuration
Configure SMTP settings for password reset emails:
- Gmail: Use App Passwords for EMAIL_PASS
- Other providers: Use appropriate SMTP settings

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please contact the development team or create an issue in the repository.

---

**Employee Experience Tracker** - Built with ❤️ using the MERN Stack
