# Movies CRUD API

A simple Node.js and Express CRUD API for movies, built to practice dependency injection, MVC architecture, and interchangeable persistence layers.

The same application can run with three different model implementations:

- `memory`: in-memory data, resets when the server restarts
- `local-file-system`: persists changes in `movies.json`
- `mysql`: stores data in a MySQL database

## Features

- Full movies CRUD
- Dependency injection for swapping the data source
- MVC-style structure
- Request validation with Zod
- CORS support
- Multiple storage strategies behind the same interface

## Tech Stack

- Node.js
- Express
- Zod
- MySQL (`mysql2`)
- Native `fs/promises` for local JSON persistence

## Project Structure

```text
.
├── app.js
├── controllers/
├── db/
├── middlewares/
├── models/
│   ├── memory/
│   ├── local-file-system/
│   └── database/
├── routes/
├── schemas/
├── server-with-memory.js
├── server-with-local.js
└── server-with-mysql.js
```

## Architecture

This project uses a small MVC-style structure:

- `routes/`: defines the HTTP endpoints
- `controllers/`: handles the request/response flow
- `models/`: contains the data access implementations
- `schemas/`: validates input data with Zod
- `app.js`: builds the Express app and injects the selected model

The key idea is dependency injection: the controller does not know whether movies come from memory, a JSON file, or MySQL. It only uses the injected `MovieModel`.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file with your database configuration:

```env
DB_HOST=localhost
DB_USER=your_user
SQL_PASSWORD=your_password
DB_NAME=movies_db
```

### 3. Run the server

You can start the API with the included npm scripts:

#### Default (MySQL)

```bash
npm run dev
```

#### MySQL

```bash
npm run dev:mysql
```

#### Memory

```bash
npm run dev:memory
```

#### Local file system

```bash
npm run dev:local
```

This version reads and writes data to:

```text
models/local-file-system/movies.json
```

## MySQL Notes

The MySQL version includes a SQL schema file at:

```text
db/schema.sql
```

Load it before running the MySQL server:

```bash
mysql -u your_user -p < db/schema.sql
```

The schema creates these tables:

- `movie`
- `genre`
- `movie_genres`

The relationship table uses foreign keys with `ON DELETE CASCADE`, so deleting a movie also removes its related rows from `movie_genres`.

## API Endpoints

Base URL:

```text
http://localhost:1234
```

## Live Demo

The project is live in production at [movies-api-node.onrender.com](https://movies-api-node.onrender.com).

Available endpoints:

- `GET /movies`
- `GET /movies/:id`
- `GET /movies?genre=sci-fi`
- `POST /movies`
- `PATCH /movies/:id`
- `DELETE /movies/:id`

## Example Request

```http
POST /movies
Content-Type: application/json

{
  "title": "The Godfather",
  "director": "Francis Ford Coppola",
  "year": 1972,
  "genre": ["Crime", "Drama"],
  "duration": 175,
  "poster": "https://example.com/poster.jpg",
  "rate": 9.2
}
```

## Validation Rules

Movie payloads are validated with Zod. The schema currently expects:

- `title`: string
- `director`: string
- `year`: integer between `1900` and the current year
- `duration`: positive integer
- `rate`: number between `0` and `10`
- `poster`: valid `.jpg` URL
- `genre`: array of allowed genres

## API Testing

Sample requests are included in [`api.http`](./api.http), which can be used with VS Code REST Client or similar tools.

## Small Frontend

As a small extra, the project also includes a simple browser client in [`public/index.html`](./public/index.html).

## Why This Project

This project is a good example of how to keep business logic isolated from persistence details. By changing only the injected model, the same API can work with different storage backends without changing routes or controllers.

## Possible Improvements

- Add automated tests
- Add Docker support
- Improve error handling consistency
- Add transactions for multi-step DB operations

## License

This project is available for educational and portfolio purposes.
