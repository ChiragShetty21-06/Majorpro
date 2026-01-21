# API Documentation

## Base URL
```
http://localhost:5000/api
```

---

## Authentication Endpoints

### 1. Register User
**POST** `/auth/register`

Register a new user account.

#### Request Body:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "passwordConfirm": "password123"
}
```

#### Fields:
| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| firstName | string | Yes | Trim, max 50 chars |
| lastName | string | Yes | Trim, max 50 chars |
| email | string | Yes | Valid email format, unique |
| password | string | Yes | Min 6 characters |
| passwordConfirm | string | Yes | Must match password |

#### Success Response (201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "user",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Error Responses:

**400 - Missing Fields:**
```json
{
  "success": false,
  "message": "Please provide all required fields"
}
```

**400 - Passwords Don't Match:**
```json
{
  "success": false,
  "message": "Passwords do not match"
}
```

**400 - Email Already in Use:**
```json
{
  "success": false,
  "message": "Email already in use"
}
```

**500 - Server Error:**
```json
{
  "success": false,
  "message": "Server error during registration"
}
```

#### Example Usage:
```javascript
const response = await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'password123',
    passwordConfirm: 'password123'
  })
});
const data = await response.json();
localStorage.setItem('token', data.token);
```

---

### 2. Login User
**POST** `/auth/login`

Authenticate user and receive JWT token.

#### Request Body:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Fields:
| Field | Type | Required |
|-------|------|----------|
| email | string | Yes |
| password | string | Yes |

#### Success Response (200):
```json
{
  "success": true,
  "message": "User logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "user",
    "isActive": true
  }
}
```

#### Error Responses:

**400 - Missing Credentials:**
```json
{
  "success": false,
  "message": "Please provide email and password"
}
```

**401 - Invalid Credentials:**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

#### Example Usage:
```javascript
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'password123'
  })
});
const data = await response.json();
if (data.success) {
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
}
```

---

### 3. Get Current User
**GET** `/auth/me`

Retrieve information about the currently authenticated user.

#### Authorization:
```
Authorization: Bearer <token>
```

#### Headers:
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Success Response (200):
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "user",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Error Responses:

**401 - No Token:**
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

**401 - Invalid Token:**
```json
{
  "success": false,
  "message": "Token is no longer valid"
}
```

**404 - User Not Found:**
```json
{
  "success": false,
  "message": "User not found"
}
```

#### Example Usage:
```javascript
const token = localStorage.getItem('token');
const response = await fetch('http://localhost:5000/api/auth/me', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
console.log(data.user);
```

#### cURL Example:
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 4. Logout User
**POST** `/auth/logout`

Logout the currently authenticated user.

#### Authorization:
```
Authorization: Bearer <token>
```

#### Success Response (200):
```json
{
  "success": true,
  "message": "User logged out successfully"
}
```

#### Error Response:

**401 - Not Authenticated:**
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

#### Example Usage:
```javascript
const token = localStorage.getItem('token');
const response = await fetch('http://localhost:5000/api/auth/logout', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
if (response.ok) {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}
```

---

## Health Check Endpoint

### 5. Health Check
**GET** `/health`

Check if server is running.

#### Success Response (200):
```json
{
  "success": true,
  "message": "Server is running"
}
```

#### Example Usage:
```javascript
const response = await fetch('http://localhost:5000/api/health');
const data = await response.json();
console.log(data.message); // "Server is running"
```

---

## Error Handling

### Common HTTP Status Codes:

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Auth required |
| 404 | Not Found - Resource not found |
| 500 | Server Error |

### Error Response Format:
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## JWT Token Format

### Token Structure:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImlhdCI6MTcwNTA3MjYwMCwiZXhwIjoxNzA1Njc3NDAwfQ.
abcdefghijklmnopqrstuvwxyz
```

### Decoded Payload:
```json
{
  "id": "507f1f77bcf86cd799439011",
  "iat": 1705072600,
  "exp": 1705677400
}
```

### Token Details:
- **Expires in:** 7 days
- **Algorithm:** HS256 (HMAC SHA-256)
- **Signing Key:** JWT_SECRET from .env

### Verify Token Online:
Visit [jwt.io](https://jwt.io) and paste your token to decode it.

---

## Request Headers

### Required for Protected Endpoints:
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### Example:
```javascript
const headers = {
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
};
```

---

## Rate Limiting

**Current:** None (add for production)

**Recommended Production Rates:**
- Registration: 5 requests per hour per IP
- Login: 10 requests per minute per IP
- API calls: 1000 requests per hour per token

---

## CORS

**Allowed Origins:**
- Development: `http://localhost:5173`
- Production: Configure in `server.js`

**Allowed Methods:**
- GET, POST, PUT, DELETE, OPTIONS

**Allowed Headers:**
- Content-Type, Authorization

---

## Best Practices

### 1. Store Token Securely:
```javascript
// Good - localStorage (for demo)
localStorage.setItem('token', token);

// Better for production - HttpOnly Cookie
// (Set on server, automatically included in requests)
```

### 2. Always Include Token:
```javascript
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};
```

### 3. Handle Token Expiration:
```javascript
try {
  const response = await fetch('/api/auth/me', { headers });
  if (response.status === 401) {
    // Token expired - redirect to login
    window.location.href = '/login';
  }
} catch (error) {
  // Handle error
}
```

### 4. Validate Before Requests:
```javascript
const token = localStorage.getItem('token');
if (!token) {
  // Redirect to login
  window.location.href = '/login';
}
```

---

## Testing API with Tools

### Using Postman:
1. Import collection from `POSTMAN_COLLECTION.json` (if provided)
2. Set base URL to `http://localhost:5000/api`
3. Create requests for each endpoint
4. Use environment variables for token

### Using cURL:
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "passwordConfirm": "password123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "password123"}'

# Get user (replace TOKEN)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

---

## Response Examples

### Successful Registration:
**Request:**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "password": "secure123",
  "passwordConfirm": "secure123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YTdmOWNlZGM4ZmEwMTYyZjhjNzc5MCIsImlhdCI6MTcwNTA3MzQyMCwiZXhwIjoxNzA1Njc4MjIwfQ.KL9wZ...",
  "user": {
    "_id": "67a7f9cedc8fa0162f8c7790",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com",
    "role": "user",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:20.000Z",
    "updatedAt": "2024-01-15T10:30:20.000Z"
  }
}
```

---

## Changelog

### Version 1.0.0 (Current)
- ✅ User registration
- ✅ User login
- ✅ JWT authentication
- ✅ Get current user
- ✅ Logout
- ✅ Password hashing

### Future (v2.0.0)
- [ ] Email verification
- [ ] Password reset
- [ ] Refresh tokens
- [ ] Google OAuth
- [ ] GitHub OAuth
- [ ] 2FA support

---

## Support

For API issues:
1. Check error message and HTTP status
2. Verify token is valid
3. Ensure all required fields are sent
4. Check server logs for details
5. See `SETUP.md` troubleshooting section

**Last Updated:** January 2024
**API Version:** 1.0.0
