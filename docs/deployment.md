# SevaConnect Deployment & Operations Guide

## 1. Environment Configuration

### Backend (`backend/.env`)
```dotenv
NODE_ENV=production
PORT=5000
CLIENT_ORIGIN=https://your-frontend-domain.com
DATABASE_PATH=/var/data/sevaconnect.sqlite

JWT_ACCESS_SECRET=your_32_byte_random_secret_for_access_tokens
JWT_REFRESH_SECRET=your_32_byte_random_secret_for_refresh_tokens
JWT_EXPIRES_IN=7d

CODE_ENCRYPTION_KEY=your_exact_32_byte_secret_key_for_aes_gcm!

# Cloudinary credentials for photograph evidence
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (`frontend/.env`)
```dotenv
VITE_API_BASE_URL=https://your-api-domain.com/api/v1
```

---

## 2. Zero-Seed Database Initialization

Initialize the database schema with zero demo records:
```bash
npm run migrate
```
This automatically verifies zero user accounts, zero demo bookings, and sets up only required system categories.

---

## 3. Provisioning the Initial Platform Administrator

To securely create the initial master admin without exposing registration endpoints:
```bash
npm run create-admin -- --name "Master Admin" --email "admin@sevaconnect.in" --password "YourStrongPassword!" --phone "+919999900000"
```

---

## 4. Starting the Services

### Development:
```bash
# Terminal 1: Backend
npm run dev:backend

# Terminal 2: Frontend
npm run dev:frontend
```

### Production Build:
```bash
# Frontend
npm run build:frontend

# Run Tests
npm run test:backend
```
