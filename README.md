# Products REST API

A simple REST API for managing products built with Node.js and Express.

## Features
- Get all products
- Get single product by ID
- Create new product
- Update product
- Delete product

## Installation

1. Clone the repository
```bash
git https://github.com/SidneyEmeka/expressserver.git
cd expressserver
```

2. Install dependencies
```bash
npm install
```

3. Run the server
```bash
node app.js
```

The server will start on `http://localhost:2`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products/all` | Get all products |
| GET | `/products/:id` | Get product by ID |
| POST | `/products/addproduct` | Create new product |
| PATCH | `/products/:id` | Update product |
| DELETE | `/products/:id` | Delete product |

## Example Request
```bash
# Get all products
curl http://localhost:2/products/all

# Create a product
curl -X POST http://localhost:2/products \
  -H "Content-Type: application/json" \
  -d '{
    "product": "Keyboard",
    "price": 15000,
    "store": "Tech Store",
    "quantity": 25,
    "isStoreVerified": true
  }'
```

## Technologies Used
- Node.js
- Express.js
- Body-parser

## Error Codes
- 2xx - Success:

- 200 OK - Request succeeded (default for GET, PATCH, PUT)
- 201 Created - Resource created successfully (POST)
<!-- - 204 No Content - Success, but no data to return (DELETE) -->

- 4xx - Client Errors:

- 400 Bad Request - Invalid data sent by client
- 404 Not Found - Resource doesn't exist
<!-- 401 Unauthorized - Authentication required
403 Forbidden - Authenticated but not allowed
409 Conflict - Conflict with existing data -->

<!-- 5xx - Server Errors:

500 Internal Server Error - Something broke on server
503 Service Unavailable - Server temporarily down -->