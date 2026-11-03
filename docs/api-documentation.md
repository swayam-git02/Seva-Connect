# SevaConnect API Documentation (v1)

Base URL: `http://localhost:5000/api/v1`

## 1. Authentication Endpoints

### Register Customer
- **Endpoint**: `POST /api/v1/auth/signup`
- **Body**:
  ```json
  {
    "name": "Customer Name",
    "email": "customer@example.com",
    "phone": "9876543210",
    "password": "StrongPassword123!",
    "city": "Faridabad",
    "address": "Sector 15, Faridabad"
  }
  ```
- **Response**: `201 Created` with JWT `token` and `user` object.

### Register Provider
- **Endpoint**: `POST /api/v1/auth/provider-signup`
- **Body**:
  ```json
  {
    "name": "Provider Name",
    "businessName": "Electricals & More",
    "email": "provider@example.com",
    "phone": "9811223344",
    "password": "StrongPassword123!",
    "category": "electrician",
    "city": "Faridabad",
    "hourlyRate": 499
  }
  ```
- **Response**: `201 Created` with JWT `token` and `user` object (`verified: false`, `kycStatus: "pending"`).

### Login
- **Endpoint**: `POST /api/v1/auth/login`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "StrongPassword123!",
    "role": "customer"
  }
  ```
- **Response**: `200 OK` with JWT `token` and `user` object.

---

## 2. Bookings & Verification Endpoints

### Create Booking
- **Endpoint**: `POST /api/v1/bookings`
- **Auth**: Customer required
- **Body**:
  ```json
  {
    "providerId": "prov-uuid",
    "serviceTitle": "Fan Installation",
    "scheduledDate": "2026-11-05",
    "scheduledTime": "11:00 AM",
    "customerAddress": "House 123, Sector 15, Faridabad",
    "customerPhone": "9876543210",
    "paymentMethod": "PAY_AFTER_SERVICE",
    "basePrice": 399
  }
  ```
- **Response**: `201 Created` with booking ID (`SC-XXXXX`), status `confirmed`, and two 6-digit cryptographic verification codes returned only to the customer.

### Customer Get Verification Codes
- **Endpoint**: `GET /api/v1/bookings/:id/codes`
- **Auth**: Customer ownership required
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "startingCode": "482731",
      "endingCode": "615904",
      "startingCodeVerified": false,
      "endingCodeVerified": false,
      "status": "confirmed"
    }
  }
  ```

### Provider Verify Starting Code
- **Endpoint**: `POST /api/v1/bookings/:id/verify-start-code`
- **Auth**: Assigned provider required
- **Body**:
  ```json
  {
    "code": "482731"
  }
  ```
- **Response**: `200 OK` — Transitions booking status to `in_progress`.

### Provider Verify Ending Code
- **Endpoint**: `POST /api/v1/bookings/:id/verify-end-code`
- **Auth**: Assigned provider required
- **Body**:
  ```json
  {
    "code": "615904"
  }
  ```
- **Response**: `200 OK` — Transitions booking status to `completed` and settles wallet payment.

---

## 3. Photograph Evidence Endpoints

### Upload Before-Service Photo
- **Endpoint**: `POST /api/v1/bookings/:id/photos/before`
- **Auth**: Assigned provider required
- **Content-Type**: `multipart/form-data` (`photos`, `caption`)
- **Response**: `201 Created`

### Upload After-Service Photo
- **Endpoint**: `POST /api/v1/bookings/:id/photos/after`
- **Auth**: Assigned provider required
- **Content-Type**: `multipart/form-data` (`photos`, `caption`)
- **Response**: `201 Created`

### Get Booking Photos
- **Endpoint**: `GET /api/v1/bookings/:id/photos`
- **Auth**: Customer, Assigned Provider, or Admin
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "before": [{ "id": "...", "imageUrl": "...", "caption": "..." }],
      "after": [{ "id": "...", "imageUrl": "...", "caption": "..." }],
      "total": 2
    }
  }
  ```
