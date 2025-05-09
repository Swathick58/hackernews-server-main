# Comments API

## Description
This is a Hackernews-server project. It allows users to create, retrieve, update, and delete comments while ensuring authentication and authorization.

## Technologies Used
- **Node.js**
- **Hono (Minimal Web Framework)**
- **Prisma (ORM for PostgreSQL)**
- **PostgreSQL**
- **TypeScript**
- **JWT Authentication**

## Installation & Setup

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/jagadish018/hackernews-server.git
cd hackernews-server
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Set Up Environment Variables
Create a `.env` file in the root directory and configure the following variables:
```.env
DATABASE_URL=postgresql://user:password@localhost:5432/your_database
JWT_SECRET=your_jwt_secret
```

### 4️⃣ Run Database Migrations
```sh
npx prisma migrate dev --name "V0"
```

### 5️⃣ Start the Server
```sh
npm run dev
```
API Endpoints

🔹 Authentication

GET /auth/sign-in → Signs up a user (leverages JWT)

GET /auth/log-in → Logs in a user (leverages JWT)

🔹 Users

GET /users/me → Returns the current user's details (based on JWT token).

GET /users → Returns all users in alphabetical order of their names (paginated).

🔹 Posts

GET /posts → Returns all posts in reverse chronological order (paginated).

GET /posts/me → Returns all posts of the current user in reverse chronological order (paginated).

POST /posts → Creates a post (authored by the current user).

DELETE /posts/:postId → Deletes a post if it belongs to the current user.

🔹 Likes

GET /likes/on/:postId → Returns all likes on a post in reverse chronological order (paginated).

POST /likes/on/:postId → Creates a like on a post (one per user per post).

DELETE /likes/on/:postId → Deletes the like if authored by the current user.

🔹 Comments

GET /comments/on/:postId → Returns all comments on a post in reverse chronological order (paginated).

POST /comments/on/:postId → Creates a comment on a post.

DELETE /comments/:commentId → Deletes a comment if authored by the current user.

PATCH /comments/:commentId → Updates a comment's text if authored by the current user.


🛠️ Development Notes

Ensure that PostgreSQL is running.

Use pgAdmin or Prisma Studio (npx prisma studio) to inspect the database.

Run tests before pushing changes (npm test).

📜 License

This project is licensed under the MIT License.

💡 Contributing

Feel free to submit pull requests or report issues!

🚀 Happy Coding!

