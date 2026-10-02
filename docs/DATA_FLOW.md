# Data Flow

This document describes the main end-to-end flows with sequence diagrams (Mermaid). Use it to see how a request or event moves through the system.

---

## 1. User Registration

Client sends email, password, and name. User Service creates the user, hashes the password, and returns a JWT (in body and in cookie).

```mermaid
sequenceDiagram
  participant C as Client
  participant US as User Service
  participant DB as MongoDB (user-service)

  C->>US: POST /api/users/register { email, password, name }
  US->>US: Validate input
  US->>DB: findOne({ email })
  alt User exists
    US->>C: 400 User already exists
  else New user
    US->>US: hashPassword(password)
    US->>DB: save User { email, hashedPassword, name }
    US->>US: generateToken(userId, name, email)
    US->>C: 201 { token, user } + Set-Cookie: authToken
  end
```

---

## 2. User Login

Client sends email and password. User Service validates and returns a JWT (in body and in cookie).

```mermaid
sequenceDiagram
  participant C as Client
  participant US as User Service
  participant DB as MongoDB (user-service)

  C->>US: POST /api/users/login { email, password }
  US->>DB: findOne({ email })
  alt User not found
    US->>C: 401 Invalid credentials
  else User found
    US->>US: comparePassword(password, user.password)
    alt Invalid password
      US->>C: 401 Invalid credentials
    else Valid
      US->>US: generateToken(userId, name, email)
      US->>C: 200 { token, user } + Set-Cookie: authToken
    end
  end
```

---

## 3. Create Todo (with Auth)

Client sends todo payload with the auth cookie. Todo Service validates the token, saves the todo, and publishes an event. The response is returned immediately; email is sent asynchronously.

```mermaid
sequenceDiagram
  participant C as Client
  participant TS as Todo Service
  participant DB as MongoDB (todo-service)
  participant MQ as RabbitMQ

  C->>TS: POST /api/todos { title, ... } + Cookie: authToken
  TS->>TS: authenticateToken (decode JWT → userId)
  alt No/invalid token
    TS->>C: 401 / 403
  else Valid
    TS->>TS: createTodo(userId, body)
    TS->>DB: save Todo { userId, title, description, dueDate, priority }
    TS->>MQ: publishToQueue("todo_created", { todoId, userId, title, ... })
    TS->>C: 201 Todo
  end
```

---

## 4. Todo Created → Email (Async)

RabbitMQ delivers the `todo_created` message to the Email Service, which builds and sends the notification email.

```mermaid
sequenceDiagram
  participant MQ as RabbitMQ
  participant ES as Email Service
  participant SMTP as SMTP Server

  MQ->>ES: Message: { todoId, userId, title, description, dueDate, priority }
  ES->>ES: handleTodoCreated(event)
  Note over ES: Resolve user (email, name) from event or User Service
  ES->>ES: Build subject, text, HTML
  ES->>SMTP: sendMail({ to, subject, text, html })
  SMTP-->>ES: OK
  ES->>MQ: ack(message)
```

**Note**: In the current code, user info (email, name) for the email is expected from the event (e.g. decoded from a token). The `todo_created` payload only has `userId`. For production, either include user email/name in the event (from Todo Service) or have Email Service call User Service’s API with `userId` to fetch user details.

---

## 5. End-to-End: Register → Login → Create Todo → Email

Single diagram tying the main flow together (client perspective and backend events).

```mermaid
sequenceDiagram
  participant C as Client
  participant US as User Service
  participant TS as Todo Service
  participant MQ as RabbitMQ
  participant ES as Email Service

  C->>US: POST /register
  US->>C: 201 + authToken cookie

  C->>US: POST /login (or reuse cookie)
  US->>C: 200 + authToken cookie

  C->>TS: POST /api/todos + authToken cookie
  TS->>TS: Save todo
  TS->>MQ: todo_created
  TS->>C: 201 Todo

  MQ->>ES: todo_created event
  ES->>ES: handleTodoCreated
  ES->>C: (Email sent to user)
```

---

## 6. Component Dependency Overview

```mermaid
flowchart TB
  subgraph "HTTP"
    C[Client]
  end

  subgraph "Services"
    US[User Service]
    TS[Todo Service]
    ES[Email Service]
  end

  subgraph "Persistence & Messaging"
    UDB[(User DB)]
    TDB[(Todo DB)]
    MQ[RabbitMQ]
  end

  C --> US
  C --> TS
  US --> UDB
  TS --> TDB
  TS --> MQ
  MQ --> ES
```

For setup and environment variables, see [SETUP.md](./SETUP.md).
