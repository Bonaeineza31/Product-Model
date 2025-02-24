Product Management API
A simple Node.js REST API for product management with image upload capabilities.
Setup Instructions

Clone the repository
git clone <repository-url>
cd Product-Model

Install dependencies
npm install

Configure environment variables
Create a .env file with:

PORT=5000
DB_USER=your_mongodb_username
DB_PASS=your_mongodb_password
DB_NAME=your_database_name
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

Create uploads directory
mkdir uploads

Start the server
npm start


API Endpoints

POST /products - Create a product (form-data with productName, productPrice, productCategory, productDiscount, productImage)
GET /products - List all products
GET /products/:id - Get a specific product
PUT /products/:id - Update a product
DELETE /products/:id - Delete a product

The server will run at http://localhost:5000