# API Reference

HTTP endpoints exposed by the User Service and Todo Service. The Email Service does not expose application APIs (only a health check).

**Base URLs** (default):

- User Service: `http://localhost:3001`
- Todo Service: `http://localhost:3002`
- Email Service: `http://localhost:3003` (health only)

---

## 1. User Service (`:3001`)

All user routes are under `/api/users`.

### 1.1 Register

Create a new user and receive a JWT in the response and in an HTTP-only cookie.

**Request**

- **Method**: `POST`
- **Path**: `/api/users/register`
- **Headers**: `Content-Type: application/json`
- **Body**:

```json
{
  "email": "user@example.com",
  "password": "yourPassword",
  "name": "Your Name"
}
```

**Response**

- **Success**: `201`
- **Body**: `{ "token": "<jwt>", "user": { "id", "email", "name", "createdAt" } }`
- **Cookie**: `authToken=<jwt>` (httpOnly, secure, sameSite, maxAge 1h)

**Errors**

- `400`: Missing email, password, or name; or "User already exists with this email".

---

### 1.2 Login

Authenticate and receive a JWT in the response and in an HTTP-only cookie.

**Request**

- **Method**: `POST`
- **Path**: `/api/users/login`
- **Headers**: `Content-Type: application/json`
- **Body**:

```json
{
  "email": "user@example.com",
  "password": "yourPassword"
}
```

**Response**

- **Success**: `200`
- **Body**: `{ "token": "<jwt>", "user": { "id", "email", "name", "createdAt" } }`
- **Cookie**: `authToken=<jwt>`

**Errors**

- `400`: Missing email or password.
- `401`: "Invalid credentials".

---

### 1.3 Health

- **Method**: `GET`
- **Path**: `/health`
- **Response**: `200` — `{ "status": "ok", "service": "user-service" }`

---

## 2. Todo Service (`:3002`)

All todo routes are under `/api/todos`. **Every request must include the auth cookie** (`authToken`) set by User Service (login/register).

### 2.1 Create Todo

Create a todo for the authenticated user. The service publishes a `todo_created` event to RabbitMQ (consumed by Email Service).

**Request**

- **Method**: `POST`
- **Path**: `/api/todos`
- **Headers**: `Content-Type: application/json`; **Cookie**: `authToken=<jwt>`
- **Body**:

```json
{
  "title": "My todo title",
  "description": "Optional description",
  "dueDate": "2026-12-31",
  "priority": "high"
}
```

- **Required**: `title`
- **Optional**: `description` (string), `dueDate` (ISO date string), `priority` (`"low"` | `"medium"` | `"high"`, default `"medium"`)

**Response**

- **Success**: `201`
- **Body**: Created todo document (e.g. `_id`, `title`, `description`, `completed`, `userId`, `dueDate`, `priority`, `createdAt`, `updatedAt`)

**Errors**

- `400`: "Title is required".
- `401`: "Access token required" (no cookie).
- `403`: "Invalid or expired token".
- `500`: Server/validation error.

---

### 2.2 Health

- **Method**: `GET`
- **Path**: `/health`
- **Response**: `200` — `{ "status": "ok", "service": "todo-service" }`

---

## 3. Email Service (`:3003`)

No application API. Only health check.

### 3.1 Health

- **Method**: `GET`
- **Path**: `/health`
- **Response**: `200` — `{ "status": "ok", "service": "email-service" }`

---

## 4. Typical Client Usage

1. **Register or login** via User Service → receive `authToken` in cookie (and optionally in response body).
2. **Create todo** via Todo Service with the same cookie sent automatically by the browser (same origin) or explicitly in the `Cookie` header.
3. Email Service runs in the background; no client calls needed for “todo created” emails.

For flow details and sequence diagrams, see [DATA_FLOW.md](./DATA_FLOW.md).
