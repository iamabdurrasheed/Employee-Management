# Quick Setup Guide

## Prerequisites
1. **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
2. **MongoDB** - Choose one option:
   - **Local MongoDB**: [Download and install](https://www.mongodb.com/try/download/community)
   - **MongoDB Atlas** (Cloud): [Create free account](https://www.mongodb.com/cloud/atlas)

## Step-by-Step Setup

### 1. Install Dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 2. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB Community Server
2. Start MongoDB service
3. Keep the default `.env` configuration

#### Option B: MongoDB Atlas (Recommended)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user
4. Get the connection string
5. Update `.env` file:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/employee_tracker
   ```

### 3. Email Configuration (Optional)
For password reset functionality, update `.env`:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

**Gmail Setup:**
1. Enable 2-factor authentication
2. Generate an App Password
3. Use the App Password in `EMAIL_PASS`

### 4. JWT Secret
Update the JWT secret in `.env`:
```env
JWT_SECRET=your_very_secure_random_string_here
```

### 5. Seed Sample Data (Optional)
```bash
npm run seed
```

This creates:
- Admin user: admin@example.com / password123
- Regular user: user@example.com / password123
- 5 sample employees with calculated experience

### 6. Start the Application
```bash
npm run dev
```

This will:
- Start the backend server on http://localhost:5000
- Start the frontend on http://localhost:3000
- Open your browser automatically

## Quick Test

1. Go to http://localhost:3000
2. Login with:
   - Email: admin@example.com
   - Password: password123
3. Navigate through the features:
   - Dashboard
   - Employee List
   - Add Employee
   - Admin Panel (admin only)

## Common Issues

### MongoDB Connection Error
- Ensure MongoDB is running (local) or connection string is correct (Atlas)
- Check firewall settings
- Verify database user permissions (Atlas)

### Port Already in Use
- Change `PORT` in `.env` file
- Kill any processes using port 5000 or 3000

### Package Installation Errors
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then `npm install`

## Production Deployment

1. Build the React app:
   ```bash
   npm run build
   ```

2. Start production server:
   ```bash
   npm start
   ```

3. Update `.env` for production:
   ```env
   NODE_ENV=production
   CLIENT_URL=your_production_domain
   ```

## Features Overview

### Employee Management
- ✅ Add/Edit/Delete employees
- ✅ Auto-calculating experience fields
- ✅ Real-time age calculation
- ✅ Search and filter functionality
- ✅ Responsive data tables

### Authentication
- ✅ User registration/login
- ✅ JWT-based authentication
- ✅ Password reset via email
- ✅ Role-based access control

### Admin Features
- ✅ User management
- ✅ Credential updates
- ✅ User status management
- ✅ System statistics

### Experience Calculations
- ✅ Current experience (auto-calculated)
- ✅ Previous experience (manual entry)
- ✅ Total experience (auto-sum)
- ✅ Real-time updates
- ✅ Proper date validation

Need help? Check the full README.md for detailed documentation.
