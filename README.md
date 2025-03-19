# Wow-Tours API

Wow-Tours API is a **RESTful backend service** built using **Node.js, Express.js, and MongoDB** to manage travel tours. It supports **JWT authentication, RBAC, CRUD operations, aggregation pipelines, and performance optimizations**.

## Features

- **User Authentication**: JWT-based authentication with role-based access control (RBAC)
- **Tour Management**: CRUD operations for tours
- **Filtering, Sorting & Pagination**
- **Aggregation Pipelines**: Efficient data processing in MongoDB
- **Security Best Practices**: Helmet, rate limiting, data sanitization
- **Scalability**: Supports horizontal scaling and sharding
- **API Testing**: Postman collections included

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ORM)
- **Security**: JWT, Helmet, Rate Limiting, Data Sanitization
- **Testing**: Postman

## Installation

### Prerequisites

- Node.js installed
- MongoDB running locally or using a cloud service (MongoDB Atlas)

### Steps

```sh
# Clone the repository
git clone https://github.com/your-username/wow-tours.git
cd wow-tours

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Update .env file with your configurations

# Start the development server
npm run dev

# Production mode
npm start
```

## API Endpoints

### **Auth Routes**

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| POST   | /api/v1/users/signup | Register a new user |
| POST   | /api/v1/users/login  | Login and get JWT   |

### **Tour Routes**

| Method | Endpoint           | Description                    |
| ------ | ------------------ | ------------------------------ |
| GET    | /api/v1/tours      | Get all tours with filtering   |
| POST   | /api/v1/tours      | Create a new tour (Admin only) |
| GET    | /api/v1/tours/\:id | Get a tour by ID               |
| PATCH  | /api/v1/tours/\:id | Update tour (Admin only)       |
| DELETE | /api/v1/tours/\:id | Delete tour (Admin only)       |

## Authentication & Authorization

- JWT Token required for accessing protected routes.
- Admin role required for modifying tour data.

## Environment Variables (.env)

```
PORT=5000
DATABASE_URL=mongodb+srv://your-db-url
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=30d
```

## Deployment

wow-tours.onrender.com

## Postman Collection

[Download Postman Collection](link-to-postman.json)

## Contributing

Feel free to raise issues or contribute via pull requests.



