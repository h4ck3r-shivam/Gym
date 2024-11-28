# GymFlex - Gym Membership Booking Platform

A modern web application for managing gym memberships and bookings.

## Features

- User Authentication & Authorization
- Gym Search and Booking
- Membership Management
- Admin Dashboard
- Dark Mode Support
- Responsive Design
- Secure Payment Integration

## Tech Stack

### Frontend
- React.js 18
- TypeScript
- Material-UI
- React Router
- Axios
- Context API for State Management

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Stripe Payment Integration

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/gym-app.git
cd gym-app
```

2. Install dependencies for both frontend and backend:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../gym-app
npm install
```

3. Set up environment variables:
```bash
# Copy example env files
cp .env.example .env
```
Update the `.env` file with your configuration.

## Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd gym-app
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
gym-app/
├── backend/             # Backend server
│   ├── src/
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Custom middleware
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   └── index.ts      # Server entry point
│   └── package.json
│
└── gym-app/            # Frontend application
    ├── src/
    │   ├── components/   # Reusable components
    │   ├── contexts/     # React contexts
    │   ├── hooks/        # Custom hooks
    │   ├── pages/        # Page components
    │   ├── services/     # API services
    │   ├── types/        # TypeScript types
    │   └── utils/        # Utility functions
    └── package.json
```

## Available Scripts

### Backend
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm start`: Start production server

### Frontend
- `npm start`: Start development server
- `npm run build`: Build for production
- `npm test`: Run tests
- `npm run eject`: Eject from Create React App

## API Documentation

### Authentication
- `POST /api/auth/register`: Register new user
- `POST /api/auth/login`: Login user
- `GET /api/auth/me`: Get current user
- `PATCH /api/auth/update-profile`: Update user profile
- `PATCH /api/auth/change-password`: Change password

### Gyms
- `GET /api/gyms`: Get all gyms
- `GET /api/gyms/:id`: Get specific gym
- `POST /api/gyms`: Create new gym (admin/gym-owner)
- `PATCH /api/gyms/:id`: Update gym (admin/gym-owner)
- `DELETE /api/gyms/:id`: Delete gym (admin)

### Slots
- `GET /api/slots/gym/:gymId`: Get gym slots
- `POST /api/slots/:gymId`: Create slot (gym-owner)
- `PATCH /api/slots/:id`: Update slot (gym-owner)
- `DELETE /api/slots/:id`: Delete slot (gym-owner)

### Bookings
- `POST /api/bookings/:slotId`: Create booking
- `GET /api/bookings/my-bookings`: Get user's bookings
- `PATCH /api/bookings/cancel/:id`: Cancel booking

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
