# 🍳 The Global Kitchen API

A RESTful API for managing a global digital cookbook. Built with Node.js, Express, and MongoDB following 3-Tier Architecture principles.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose ODM)
- **Configuration:** dotenv

## Project Structure

```
global-kitchen/
├── src/
│   ├── app.js                  # Entry point — Express setup & server start
│   ├── config/
│   │   └── db.js               # Single shared MongoDB connection module
│   ├── routes/
│   │   └── recipe.routes.js    # API endpoint declarations
│   ├── controllers/
│   │   └── recipe.controller.js  # Request/response handling
│   ├── services/
│   │   └── recipe.service.js   # Business logic & DB queries
│   ├── models/
│   │   └── recipe.model.js     # Mongoose schema & model
│   └── middleware/
│       └── errorHandler.js     # Global error handler
├── .env.example
├── .gitignore
├── .eslintrc.json
└── package.json
```

## Features

- **Full CRUD** for recipes (Create, Read, Update, Delete)
- **Category filtering** via query parameter (`GET /recipes?category=Dinner`)
- **Schema validation** with descriptive error messages
- **Global error handler** — no unhandled crashes, proper HTTP status codes
- **Indexed fields** (`category`, `title`) for efficient lookups
- **Async/await** throughout — non-blocking I/O, Event Loop never blocked
- **DRY architecture** — single DB connection module, logic separated by layer

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [your-repo-url]
   cd global-kitchen
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env` file** in the root directory:
   ```bash
   cp .env.example .env
   ```
   Then fill in your values:
   ```env
   PORT=3000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/global-kitchen
   ```

4. **Start the server:**
   ```bash
   # Development (with auto-restart)
   npm run dev

   # Production
   npm start
   ```

## API Endpoints

| Method   | Endpoint         | Description                          |
|----------|-----------------|--------------------------------------|
| `GET`    | `/recipes`       | Get all recipes (supports `?category=`) |
| `GET`    | `/recipes/:id`   | Get a single recipe by ID            |
| `POST`   | `/recipes`       | Create a new recipe                  |
| `PATCH`  | `/recipes/:id`   | Partially update a recipe            |
| `DELETE` | `/recipes/:id`   | Delete a recipe                      |

### Recipe Schema

| Field          | Type     | Required | Constraints                                      |
|---------------|----------|----------|--------------------------------------------------|
| `title`        | String   | ✅       | 2–100 chars, trimmed                             |
| `ingredients`  | [String] | ✅       | At least one item required                       |
| `instructions` | String   | ✅       | Min 10 chars, trimmed                            |
| `cookingTime`  | Number   | ✅       | Positive integer (minutes)                       |
| `difficulty`   | String   | ✅       | `Easy`, `Medium`, or `Hard`                     |
| `category`     | String   | ✅       | `Breakfast`, `Lunch`, `Dinner`, `Dessert`, etc. |
| `createdAt`    | Date     | Auto     | Set on creation                                  |
| `updatedAt`    | Date     | Auto     | Updated on every save                            |

### Example Requests

**Create a recipe:**
```json
POST /recipes
{
  "title": "Shakshuka",
  "ingredients": ["eggs", "tomatoes", "onion", "garlic", "cumin", "paprika"],
  "instructions": "Sauté onion and garlic, add tomatoes and spices, simmer, crack eggs into sauce, cover and cook until set.",
  "cookingTime": 25,
  "difficulty": "Easy",
  "category": "Breakfast"
}
```

**Filter by category:**
```
GET /recipes?category=Breakfast
```

**Update cooking time only:**
```json
PATCH /recipes/:id
{
  "cookingTime": 30
}
```

## Architecture Notes

### 3-Tier Separation of Concerns

- **Routes** — Declare endpoints, map HTTP verbs to controllers. Zero logic.
- **Controllers** — Parse `req`, call services, send `res`. Every path ends with `res.json()`.
- **Services** — All business rules and DB queries live here. Reusable, testable.
- **Models** — Define BSON schema, validation constraints, and indexes.

### Key Design Decisions

- **Single DB module** (`config/db.js`) imported once at startup — no reconnection per file (DRY)
- **`cookingTime` as Number** (not String) — enables numeric comparisons and avoids type coercion bugs
- **`timestamps: true`** — real BSON `Date` types for `createdAt`/`updatedAt`
- **Schema-level `enum` + `required`** — invalid data is rejected before hitting the DB
- **`runValidators: true`** on `findByIdAndUpdate` — validators also run on PATCH, not just POST
- **Global error handler** — catches Mongoose `ValidationError`, `CastError`, duplicate keys

## Environment Variables

| Variable      | Description                  | Example                          |
|--------------|------------------------------|----------------------------------|
| `PORT`        | Port the server listens on   | `3000`                           |
| `MONGODB_URI` | MongoDB connection string     | `mongodb+srv://...`              |

> ⚠️ **Never commit your `.env` file.** It's in `.gitignore`. Use `.env.example` as a template.
