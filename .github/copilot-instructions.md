<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# MERN Stack Employee Experience Tracker - Copilot Instructions

This is a full-stack MERN (MongoDB, Express.js, React, Node.js) application for employee experience tracking with automatic calculations.

## Project Structure

- **Backend**: Express.js server with MongoDB database
- **Frontend**: React application with Material-UI components
- **Authentication**: JWT-based with password reset functionality
- **Experience Calculations**: Real-time automatic calculations of employee experience

## Key Features to Understand

### Experience Calculation Logic
- Current experience: From joining date to current date
- Previous experience: Manual entry from previous institutions
- Total experience: Automatic sum with proper month/day overflow handling
- All calculations update in real-time and when data changes

### Authentication & Authorization
- JWT tokens for authentication
- Role-based access (admin/user)
- Password reset with email tokens
- Admin panel for user management

### Real-time Updates
- Experience calculations update every minute
- Immediate recalculation when dates change
- Server-side calculations for accuracy

## Code Patterns to Follow

### Backend
- Use async/await for database operations
- Implement proper error handling with try-catch
- Validate data on both client and server side
- Use Mongoose virtuals for calculated fields
- Include proper authentication middleware

### Frontend
- Use Material-UI components consistently
- Implement proper error states and loading indicators
- Use React hooks for state management
- Follow responsive design principles
- Include proper form validation

### Database Schema
- Employee model with experience calculations as virtuals
- User model with authentication fields
- Proper indexes for performance
- Validation at schema level

## Important Files

- `server.js`: Main Express server
- `models/Employee.js`: Employee schema with experience virtuals
- `models/User.js`: User authentication model
- `routes/employees.js`: Employee CRUD operations
- `routes/admin.js`: Admin user management
- `utils/experienceUtils.js`: Experience calculation utilities

## When Modifying Experience Logic
- Always update both frontend utilities and backend virtuals
- Ensure calculations handle edge cases (month/year boundaries)
- Test with various date combinations
- Maintain consistency between client and server calculations

## Testing Scenarios
- Employee creation with various dates
- Experience updates when joining date changes
- Previous experience modifications
- Real-time calculation updates
- Admin user management operations
- Password reset flow
