# Setup & Run

How to install dependencies, configure environment variables, and run the microservices Todo application.

---

## 1. Prerequisites

- **Node.js** (v18+ recommended)
- **MongoDB** (local or remote; two databases used: `user-service`, `todo-service`)
- **RabbitMQ** (default: `amqp://localhost:5672`)

---

## 2. Install Dependencies

From the repository root:

```bash
npm run install:all
```

This runs `npm install` in:

- `services/user-service`
- `services/todo-service`
- `services/email-service`

If the Todo/Email services use the local shared RabbitMQ package, ensure that package is built/linked as required by their `package.json` (e.g. `@tanuj_malode/rabbitmq`).

---

## 3. Environment Variables

Create a `.env` file in **each** service directory (or set variables in the shell).

### 3.1 User Service (`services/user-service/.env`)

| Variable      | Description                    | Default                          |
|---------------|--------------------------------|----------------------------------|
| `PORT`        | HTTP server port               | `3001`                           |
| `MONGODB_URI` | MongoDB connection string      | `mongodb://localhost:27017/user-service` |
| `JWT_SECRET`  | Secret for signing JWTs        | `default_secret` (use a strong secret in production) |

### 3.2 Todo Service (`services/todo-service/.env`)

| Variable      | Description               | Default                          |
|---------------|---------------------------|----------------------------------|
| `PORT`        | HTTP server port          | `3002`                           |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/todo-service` |
| RabbitMQ      | Optional (if client reads env) | —                            |

### 3.3 Email Service (`services/email-service/.env`)

| Variable         | Description           | Default              |
|------------------|-----------------------|----------------------|
| `PORT`           | HTTP server port      | `3003`               |
| `EMAIL_HOST`     | SMTP host             | `smtp.gmail.com`     |
| `EMAIL_PORT`     | SMTP port             | `587`                |
| `EMAIL_SECURE`   | Use TLS               | `false`              |
| `EMAIL_USER`     | SMTP username         | — (required)         |
| `EMAIL_PASSWORD` | SMTP password / app password | — (required) |
| `EMAIL_FROM`     | From address          | `noreply@todoapp.com` |

For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833) and set `EMAIL_USER` and `EMAIL_PASSWORD`.

---

## 4. Running the Services

Start each service in its own terminal (or use a process manager).

**1. User Service**

```bash
cd services/user-service
npm run dev
# Listens on http://localhost:3001
```

**2. Todo Service**

```bash
cd services/todo-service
npm run dev
# Listens on http://localhost:3002
```

**3. Email Service**

```bash
cd services/email-service
npm run dev
# Listens on http://localhost:3003, consumes from RabbitMQ
```

**Order**: Start MongoDB and RabbitMQ first, then User Service, then Todo Service, then Email Service (so the consumer is ready when todos are created).

---

## 5. Health Checks

After starting, verify:

- User Service: `curl http://localhost:3001/health`
- Todo Service: `curl http://localhost:3002/health`
- Email Service: `curl http://localhost:3003/health`

Each should return `{ "status": "ok", "service": "<service-name>" }`.

---

## 6. Build for Production

Each service:

```bash
cd services/<service-name>
npm run build
npm start
```

---

## 7. Quick Test Flow

1. **Register**:  
   `curl -X POST http://localhost:3001/api/users/register -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"test123","name":"Test"}' -c cookies.txt`

2. **Create todo** (use the cookie file):  
   `curl -X POST http://localhost:3002/api/todos -H "Content-Type: application/json" -b cookies.txt -d '{"title":"My first todo","priority":"high"}'`

3. Check Email Service logs to confirm `todo_created` was consumed (and that SMTP is configured if you want the email to be sent).

---

For architecture and APIs, see [ARCHITECTURE.md](./ARCHITECTURE.md) and [API.md](./API.md).
