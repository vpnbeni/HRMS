# HRMS Dashboard

A comprehensive Human Resource Management System built with the MERN stack.

## Features

1. Authentication and Authorization
   - JWT-based authentication
   - 2-hour session validity
   - Auto-logout functionality

2. Candidate Management
   - Create and manage candidate profiles
   - Resume download functionality
   - Candidate to employee conversion
   - Advanced filtering and search

3. Employee Management
   - CRUD operations for employee details
   - Role assignment
   - Advanced filtering and search

4. Attendance Management
   - Track employee attendance
   - Filtering and search capabilities

5. Leave Management
   - Leave application and approval system
   - Leave calendar visualization
   - Document download functionality
   - Advanced filtering and search

## Tech Stack

- MongoDB
- Express.js
- React
- Node.js
- JWT for authentication
- Vanilla CSS for styling

## Project Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd HRMS
```

2. Install dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Environment Setup
   - Create a `.env` file in the server directory
   - Add the following variables:
     ```
     MONGODB_URI=your_mongodb_uri
     JWT_SECRET=your_jwt_secret
     PORT=5000
     ```

4. Running the Application
```bash
# Start the server (from server directory)
npm run dev

# Start the client (from client directory)
npm start
```

## Project Structure

```
HRMS/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── utils/
│   │   ├── assets/
│   │   └── styles/
│   └── package.json
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── utils/
│   └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 