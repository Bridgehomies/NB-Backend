===================================
NabeeraBareera Backend (Node.js + Express + MongoDB)
===================================

Project Description:
--------------------
This backend powers the NabeeraBareera platform — a simple e-commerce-like system 
with support for product listing, customer order submission, and admin login.

Stack Used:
-----------
- Node.js
- Express
- MongoDB
- Mongoose
- Multer (for image uploads)
- dotenv (for environment variables)
- CORS
- JWT (for authentication)

Folder Structure:
-----------------
/server.js             --> Entry point of the server
/routes/products.js    --> Routes for managing products
/routes/orders.js      --> Routes for managing orders
/routes/auth.js        --> Routes for login/authentication
/models/Product.js     --> Mongoose schema for products
/models/Order.js       --> Mongoose schema for orders
/models/User.js        --> Mongoose schema for users
/uploads/              --> Directory where uploaded product images are stored
.env                   --> Environment variables file

Installation:
-------------
1. Clone this repository:
   git clone <your-repo-url>

2. Navigate to the backend folder:
   cd backend

3. Install dependencies:
   npm install

4. Create a `.env` file in the root directory and add the following:
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000

5. Start the server:
   npm run dev
   or
   node server.js

The server will run at: http://localhost:5000

API Endpoints:
--------------
- [POST]    /api/products             - Add a product (requires image upload)
- [GET]     /api/products             - Get all products
- [PUT]     /api/products/:id         - Update a product
- [DELETE]  /api/products/:id         - Delete a product

- [POST]    /api/orders               - Create a new order
- [GET]     /api/orders               - Get all orders
- [PUT]     /api/orders/:id/status    - Update order status

- [POST]    /api/auth/login           - Login admin (returns JWT token)

- [GET]     /api/dashboard-metrics    - Get dashboard metrics (requires auth)

Authentication:
---------------
- Use the token returned by `/api/auth/login` in the frontend (stored in localStorage).
- Protected routes require Bearer Token in headers:
   Authorization: Bearer <your-token>

Image Upload:
-------------
- Images are uploaded using `multer` to the `/uploads` folder.
- Images can be accessed publicly via:
  http://localhost:5000/uploads/<image-name>

Notes:
------
- Ensure MongoDB is running and accessible.
- Make sure to set proper environment variables in `.env`.
- For production, secure the `/uploads` route and sanitize file inputs.

==============================
