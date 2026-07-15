# 📚 Library Management System

> A full-stack library management system built with **Node.js**, **Express.js**, **Vue 3**, and **MongoDB**, designed to streamline library operations through secure authentication, role-based access control, and complete circulation workflows.

<p align="center">

![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Vue](https://img.shields.io/badge/Vue_3-42B883?style=for-the-badge&logo=vuedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Authentication-blue?style=for-the-badge)

</p>

---

# 📖 Overview

Library Management System is a full-stack web application that digitalizes daily library operations, including catalog management, borrowing workflows, inventory tracking, and administrative reporting.

The project focuses on implementing practical business processes rather than simple CRUD operations, combining secure authentication, role-based authorization, and responsive management interfaces into a complete information system.

Developed independently as a personal project to strengthen full-stack development and software engineering skills.

---

# ✨ Key Highlights

- 📚 Complete library circulation workflow
- 🔐 Secure authentication with JWT & Google OAuth 2.0
- 👥 Role-based authorization
- 📧 Automated email notifications using Nodemailer
- 📊 Statistical reports and management dashboard
- 🔍 Searching, filtering and image management
- 📱 Responsive administration interface
- 🏗 RESTful API architecture

---

# 🏛 System Architecture

```text
                  Vue 3 + Vuetify
                         │
                     Pinia Store
                         │
──────────────────────────────────────────────
               Express REST API
──────────────────────────────────────────────
 Authentication │ Books │ Borrow │ Reports
──────────────────────────────────────────────
 JWT │ OAuth │ Nodemailer │ Middleware
──────────────────────────────────────────────
                     MongoDB
```

---

# 🚀 Core Modules

## Authentication & Security

- JWT Authentication
- Google OAuth 2.0 Login
- Password Hashing
- Forgot Password
- Email-based Password Recovery
- Protected REST APIs
- Role-based Authorization

---

## Library Management

- Book Management
- Reader Management
- Staff Management
- Publisher Management
- Book Categories
- Book Cover Upload

---

## Circulation Workflow

- Borrow Books
- Return Books
- Borrow Renewal
- Borrow History
- Inventory Updates

The borrowing workflow automatically maintains inventory consistency while recording transaction history for future tracking and reporting.

---

## Administration

- Dashboard
- Statistical Reports
- Search & Filtering
- User Management
- Responsive Management Interface

---

# 🔄 Business Workflow

```text
User Authentication
        │
        ▼
Browse & Search Books
        │
        ▼
Borrow Request
        │
        ▼
Borrow Approval
        │
        ▼
Inventory Updated
        │
        ▼
Return / Renewal
        │
        ▼
Borrow History & Statistics
```

---

# 🔒 Security Design

Security was implemented as a core part of the system rather than an additional feature.

The application combines multiple authentication and authorization mechanisms:

- JWT for stateless authentication
- Google OAuth 2.0 integration
- Password hashing
- Protected API endpoints
- Role-based access control
- Email-based password recovery

---

# 🛠 Technology Stack

## Backend

- Node.js
- Express.js
- RESTful APIs
- JWT Authentication
- Google OAuth 2.0
- Nodemailer

## Frontend

- Vue 3
- Vuetify
- Pinia
- Vue Router

## Database

- MongoDB

## Development Tools

- Git
- Postman
- VS Code

---

# 📂 Project Structure

```text
backend
├── controllers
├── middleware
├── models
├── routes
├── services
└── utils

frontend
├── components
├── views
├── router
├── stores
└── services
```

---

# 🚀 Getting Started

### Backend

```bash
npm install
npm run dev
```

### Frontend

```bash
npm install
npm run dev
```

---

# 📸 Screenshots

Add screenshots for:

- Login
- Dashboard
- Book Management
- Borrow Management
- Statistics
- User Management

---

# 💡 Engineering Decisions

### Why MongoDB?

MongoDB provides a flexible document model suitable for managing books, users, borrowing records, and related metadata while simplifying schema evolution during development.

### Why JWT?

JWT enables stateless authentication, making the backend scalable and simplifying secure API communication.

### Why Google OAuth?

OAuth provides a convenient and secure login experience while reducing password management overhead.

### Why Nodemailer?

Automated email notifications improve user experience by supporting password recovery and system notifications.

---

# 📚 Lessons Learned

Throughout this project, I gained practical experience in:

- Designing RESTful APIs
- Authentication & Authorization
- Business workflow implementation
- Responsive dashboard development
- Full-stack application architecture
- State management with Pinia
- API integration between frontend and backend

---

# 📄 License

This project was developed for educational purposes.
