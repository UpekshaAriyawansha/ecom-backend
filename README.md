# ecom-backend

This repository contains the backend API for an e-commerce website built using the MERN stack (MongoDB, Express.js, React, Node.js). The backend handles user authentication, product management, order processing, and more.

## Features

- **User Authentication**: 
  - Register, login, and manage user accounts.
  - Password hashing with bcrypt.
  - JWT-based authentication and authorization.

- **Product Management**:
  - CRUD operations for products.
  - Category management.
  - Image upload and management.

- **Order Management**:
  - Create, view, and manage orders.
  - Handle payment processing (e.g., integration with Stripe).
  - Track order status (e.g., pending, shipped, delivered).

- **Inventory Management**:
  - Manage stock levels for products.
  - Automatic stock updates based on orders.

- **Admin Management**:
  - Role-based access control (e.g., admin, user).
  - Admin panel API routes for managing the platform.

## Prerequisites

- **Node.js**: Ensure you have Node.js 12.x or higher installed.
- **MongoDB**: Install and configure MongoDB for the database.
