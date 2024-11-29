Course Selling Website Backend

This project is a backend system for a course-selling website. It features separate routes and functionalities for users and administrators, ensuring secure and efficient management of courses and user data.

Features
User Authentication:
Implemented using JSON Web Tokens (JWT).
Middleware for verifying and validating JWT tokens for protected routes.

Role-Based Access Control:
Separate routes for users and administrators.
Users can browse and purchase courses.
Admins can add, update, or delete courses.

Scalable Architecture:
Modular folder structure for routes, middleware, and configuration.
Centralized error handling and secure API endpoints.

Clone the repository:
git clone 

Navigate to the project directory:
Copy code
cd 

Install dependencies:
npm install

Create a .env file in the root directory based on .env.example and add the required environment variables.

Start the server:
npm start


Technologies Used
Node.js: Backend runtime environment.
Express.js: Web framework for handling routes and middleware.
MongoDB: Database for storing user and course information.
JWT: Secure user authentication.
dotenv: Environment variable management.


API Endpoints
User Routes (routes/user.js)
User registration and login.
Access to browse and purchase courses.

Admin Routes (routes/admin.js)
Add, update, and delete courses.
Manage user data.

Course Routes (routes/course.js)
List available courses.
Fetch course details.

Middleware
middleware/admin.js: Ensures only admins can access certain routes.
middleware/user.js: Authenticates user access using JWT.
