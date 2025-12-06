# MiniHub - Digital Micro-Product Marketplace

A full-stack web application for buying and selling digital products like templates, designs, and e-books.

## Features

- **User Authentication**: Register and login with JWT tokens
- **Role-Based Access**: Separate buyer and seller accounts
- **Product Management**: Sellers can create and manage products
- **Shopping Cart**: Add multiple items before checkout
- **Order System**: Track purchases and order history
- **Search & Filter**: Find products by category or keywords
- **Responsive Design**: Works on desktop and mobile

## Technology Stack

**Backend:**
- FastAPI (Python web framework)
- SQLAlchemy (Database ORM)
- SQLite (Database)
- JWT Authentication
- Pydantic (Data validation)

**Frontend:**
- React.js
- Axios (HTTP client)
- Modern CSS with gradients and animations

## Project Structure

```
MiniHub-Digital-Micro-Product-Marketplace/
├── backend/               # FastAPI backend
│   ├── main.py           # FastAPI server
│   ├── create_sample_data.py
│   ├── Pipfile           # Backend dependencies
│   ├── Pipfile.lock
│   ├── marketplace.db    # SQLite database
│   └── README.md
├── frontend/             # React application
│   ├── src/
│   │   ├── App.js       # Main React component
│   │   ├── App.css      # Styling
│   │   └── index.js     # React entry point
│   ├── package.json     # Frontend dependencies
│   └── README.md
├── netlify.toml         # Netlify config
└── README.md            # This file
```

## Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 14+
- pipenv (Python package manager)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pipenv install
```

3. Activate virtual environment:
```bash
pipenv shell
```

4. Create sample data:
```bash
python create_sample_data.py
```

5. Start the backend server:
```bash
python main.py
```

The API will be available at `http://127.0.0.1:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## Quick Start

### Terminal 1 - Backend:
```bash
cd backend
pipenv install
pipenv shell
python create_sample_data.py
python main.py
```

### Terminal 2 - Frontend:
```bash
cd frontend
npm install
cp .env.example .env
npm start
```

## Usage

### Demo Account
- Username: `obapluto`
- Password: `plutomania`
- Role: Seller

### Creating New Accounts
1. Click "Register" on the homepage
2. Fill in your details
3. Choose role: Buyer or Seller
4. Click "Create Account"

### For Sellers
- Login and click "Add Product"
- Fill in product details (title, description, price, category)
- Submit to create your product

### For Buyers
- Browse products on the homepage
- Use search and category filters
- Add items to cart or buy immediately
- View your order history in "Orders" section

## API Endpoints

- `POST /api/register` - Create new user account
- `POST /api/login` - User authentication
- `GET /api/users/me` - Get current user profile
- `GET /api/products` - List all products
- `POST /api/products` - Create new product (sellers only)
- `GET /api/categories` - List product categories
- `POST /api/orders` - Place an order (buyers only)
- `GET /api/orders/user` - Get user's order history

## Database Schema

**Users Table:**
- id, username, email, name, role, hashed_password

**Categories Table:**
- id, name, description

**Products Table:**
- id, title, description, price, category_id, user_id, created_at

**Orders Table:**
- id, product_id, buyer_id, quantity, total_price, status, created_at

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input validation with Pydantic
- CORS protection

## Development Notes

This project demonstrates:
- RESTful API design
- Database relationships with SQLAlchemy
- Modern React patterns with hooks
- Responsive CSS design
- Authentication and authorization
- Error handling and validation

## Future Enhancements

- File upload for product images
- Payment integration
- Email notifications
- Product reviews and ratings
- Advanced search filters
- Admin dashboard

---

**Author:** [obed emoni lopeyok]  
**Course:** [software engineering phase 3 project]  
**Date:** December 2025