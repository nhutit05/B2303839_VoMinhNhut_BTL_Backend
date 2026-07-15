# 📚 Library Management System

> A role-based library management system built with **Node.js**, **Express.js**, **Vue 3**, and **MongoDB**.

<p align="center">

![Node.js](https://img.shields.io/badge/Node.js-20-green)
![Express](https://img.shields.io/badge/Express.js-black)
![Vue](https://img.shields.io/badge/Vue_3-42b883)
![MongoDB](https://img.shields.io/badge/MongoDB-green)
![JWT](https://img.shields.io/badge/JWT-Authentication-blue)

</p>

---

# 📖 Overview

Library Management System is a full-stack web application designed to digitize library operations, streamline circulation workflows, and simplify daily management for librarians.

The system provides secure role-based access control, complete borrowing workflows, inventory management, and reporting features through a responsive web interface.

Unlike a simple CRUD application, the project focuses on business processes commonly found in real-world library management systems.

---

# ✨ Highlights

- 📖 Complete library circulation workflow
- 🔐 JWT Authentication
- 🔑 Google OAuth Login
- 📧 Email notifications with Nodemailer
- 👤 Role-based Authorization
- 📊 Statistics & Reports
- 📷 Image Upload
- 🔍 Searching & Filtering
- 📱 Responsive Dashboard

---

# 🏗 System Architecture

```
                 Vue 3 + Vuetify

                        │

                  Pinia State

                        │

────────────────────────────────────────────

              Express REST API

────────────────────────────────────────────

 Authentication │ Books │ Borrow │ Reports

────────────────────────────────────────────

 JWT │ Google OAuth │ Nodemailer

────────────────────────────────────────────

                 MongoDB
```

---

# 🚀 Core Features

## Authentication

- JWT Authentication
- Google OAuth 2.0 Login
- Password Hashing
- Forgot Password
- Email Verification

---

## Library Management

- Book Management
- Reader Management
- Staff Management
- Book Categories
- Publisher Management

---

## Circulation Workflow

- Borrow Books
- Return Books
- Renew Borrowing
- Borrow History
- Due Date Management

---

## Administration

- User Management
- Statistics Dashboard
- Search & Filtering
- Image Upload
- Responsive Dashboard

---

# 🔐 Security

The application implements several security mechanisms to protect user accounts and sensitive operations.

- JWT Authentication
- Password Hashing
- Google OAuth 2.0
- Protected REST APIs
- Role-based Authorization

---

# 📊 Business Workflow

```
User Login

↓

Search Book

↓

Borrow Request

↓

Book Issued

↓

Return / Renewal

↓

Inventory Updated

↓

History Recorded
```

---

# 🛠 Technology Stack

## Backend

- Node.js
- Express.js
- JWT
- Google OAuth
- Nodemailer

## Frontend

- Vue 3
- Vuetify
- Pinia

## Database

- MongoDB

---

# 📂 Project Structure

```
backend/

 controllers/

 routes/

 models/

 middleware/

 services/

frontend/

 views/

 components/

 stores/

 router/
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

> Add screenshots of:

- Login
- Dashboard
- Book Management
- Borrowing
- Statistics
- User Management

---

# 📌 Roadmap

- [x] Authentication
- [x] Google OAuth
- [x] Book Management
- [x] Borrow / Return
- [x] Renewal
- [x] Statistics
- [x] Email Notification
- [x] Responsive UI

---

# 👨‍💻 Author

Developed independently as a personal full-stack project.

---

# 📄 License

This project was developed for educational purposes.
