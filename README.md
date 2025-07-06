
# PrioritiQ - Task Management System

PrioritiQ is a full-stack task management application built with **React** (Frontend) and **Node.js + Express + MySQL** (Backend). It allows users to manage tasks and categories with features like deadline tracking, task completion status, and category-based filtering.

---

## Features

- User-based task and category management
- Task status toggle (complete/incomplete)
- Responsive UI built with Bootstrap, MDBReact
- Filter tasks by deadline and category
- Email notifications using Nodemailer
- Environment-based configuration
- Toast notifications for actions

---

## How to Run the Project

### Prerequisites

- Node.js (v14+)
- npm
- MySQL Server (You can use Clever Cloud or local instance)

---

## Project Structure

```
prioritiq/
├── backend/
│   ├── index.js
│   ├── .env
│   └── routes/
│
├── frontend/
│   ├── src/
│   ├── .env
│   └── App.js
```

---

## Backend Setup

1. Go to the `backend` directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in `/backend` and add:

```env
PORT=5000

MYSQL_ADDON_HOST=your_mysql_host
MYSQL_ADDON_DB=your_database_name
MYSQL_ADDON_USER=your_database_user
MYSQL_ADDON_PORT=3306
MYSQL_ADDON_PASSWORD=your_database_password

API_KEY=your_api_key
JWT_SECRET=your_jwt_secret

MAIL_USER=your_email@example.com
MAIL_PASS=your_email_password_or_app_password
```

4. Start the backend server:
```bash
nodemon start
```

> Make sure MySQL is running and accessible with the provided credentials.

---

## Frontend Setup

1. Go to the `frontend` directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in `/frontend` and add:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_API_KEY=your_api_key_here
```

4. Start the frontend:
```bash
npm start
```

---

## 📌 Assumptions

- Tasks are specific to a single user.
- Cookies are used to store user session and ID.
- API key is required for all requests.

---

## 🛠️ Possible Improvements

- Pagination, sort
- Dockerization and CI/CD pipeline

---

## Tech Stack

### Frontend:
- React.js
- Bootstrap + MDBReact
- js-cookie + react-hot-toast

### Backend:
- Node.js + Express
- Sequelize + MySQL
- Nodemailer + JWT + dotenv

---