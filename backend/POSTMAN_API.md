# MERN Backend – Postman API Guide

**Base URL:** `http://localhost:3000` (or your `PORT` from `.env`)

---

## Todo API (`/api/todo`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `http://localhost:3000/api/todo` | Get all todos |
| POST | `http://localhost:3000/api/todo/create` | Create a todo |
| PUT | `http://localhost:3000/api/todo/update/:id` | Update a todo by ID |
| DELETE | `http://localhost:3000/api/todo/delete/:id` | Delete a todo by ID |

### Examples

**GET all todos**
- **URL:** `GET http://localhost:3000/api/todo`
- **Body:** none

**POST create todo**
- **URL:** `POST http://localhost:3000/api/todo/create`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "task": "Learn MERN stack"
}
```

**PUT update todo**
- **URL:** `PUT http://localhost:3000/api/todo/update/PASTE_TODO_ID_HERE`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "task": "Updated task text",
  "completed": true
}
```

**DELETE todo**
- **URL:** `DELETE http://localhost:3000/api/todo/delete/PASTE_TODO_ID_HERE`
- **Body:** none

---

## User API (`/api/user`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `http://localhost:3000/api/user` | Get all users |
| GET | `http://localhost:3000/api/user/:id` | Get user by ID |
| POST | `http://localhost:3000/api/user/create` | Create a user |
| PUT | `http://localhost:3000/api/user/update/:id` | Update a user by ID |
| DELETE | `http://localhost:3000/api/user/delete/:id` | Delete a user by ID |

### Examples

**GET all users**
- **URL:** `GET http://localhost:3000/api/user`

**GET user by ID**
- **URL:** `GET http://localhost:3000/api/user/PASTE_USER_ID_HERE`

**POST create user**
- **URL:** `POST http://localhost:3000/api/user/create`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

**PUT update user**
- **URL:** `PUT http://localhost:3000/api/user/update/PASTE_USER_ID_HERE`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

**DELETE user**
- **URL:** `DELETE http://localhost:3000/api/user/delete/PASTE_USER_ID_HERE`

---

## How to use in Postman

1. Open **Postman**.
2. Create a new request and set **Method** and **URL** as in the tables above.
3. For **POST** and **PUT**, set:
   - **Body** → **raw** → **JSON**.
   - Paste the example JSON and edit as needed.
4. Replace `PASTE_TODO_ID_HERE` or `PASTE_USER_ID_HERE` with real IDs from **GET** responses (e.g. `_id` from MongoDB).

---

## Import Postman collection

Import the file **`MERN_Backend_Postman_Collection.json`** in this folder:

- In Postman: **File → Import** → choose the JSON file.

This will add a collection with all the requests above, using base URL `http://localhost:3000`.
