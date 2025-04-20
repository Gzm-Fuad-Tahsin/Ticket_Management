
# Ticket Management System

A full-featured ticket management system built using **Node.js**, **Express**, **TypeScript**, and **Mongoose**. This project includes features like authentication, role-based access, ticket purchasing, and more.

## Features

- RESTful API with Express and TypeScript
- Authentication using JWT
- Role-based access control
- Secure password handling with Bcrypt
- Environment configuration using dotenv
- Input validation using Zod
- Nodemailer for email functionalities
- Organized code structure with scalable architecture

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Gzm-Fuad-Tahsin/Ticket_Management.git
cd Ticket_Management
```

### 2. Install Dependencies

```bash
npm install
```

---

## Environment Setup

Create a `.env` file in the root directory and copy the contents of `example.env` into it. Fill in the required values.

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=mongodb://localhost:27017/ticket-management
BCRYPT_SALT_ROUND=10
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_VERIFIED_USER_SECRET=your_verified_user_secret
JWT_ACCESS_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
RESET_PASSWORD_URI=http://localhost:5000/reset-password
SERVER_URL=http://localhost:5000
GOOGLE_CLIENT_ID=your_google_client_id
```

---

## Running the Project

### In Development

```bash
npm run start:dev
```

This will run the server with hot-reloading using `ts-node-dev`.

### In Production

```bash
npm run build
npm run start:prod
```

This will compile the TypeScript code to JavaScript and start the production server.

---

## Code Formatting and Linting

### Lint Check

```bash
npm run lint
```

### Auto-fix Lint Issues

```bash
npm run lint:fix
```

### Format Code with Prettier

```bash
npm run prettier
```

---

## Project Structure

```
src/
├── app.ts            # Main application setup
├── server.ts         # Server entry point
├── config/           # Configuration and env
├── modules/          # Feature modules (users, tickets, etc.)
├── middlewares/      # Custom middlewares
├── utils/            # Utility functions
└── ...               # Other folders/files
```

---

## License

This project is licensed under the ISC License.

---

## Contribution

Feel free to open issues or submit pull requests. Contributions are welcome!

```
