# MiniHub Database Schema Diagram

## Database Tables and Relationships

```
┌─────────────────────────────────────┐
│            USERS                    │
├─────────────────────────────────────┤
│ PK  id (Integer)                    │
│     username (String, Unique)       │
│     email (String, Unique)          │
│     name (String)                   │
│     role (String)                   │
│     hashed_password (String)        │
└─────────────────────────────────────┘
         │                    │
         │ 1                  │ 1
         │                    │
         │ *                  │ *
         ▼                    ▼
┌──────────────────┐   ┌──────────────────┐
│    PRODUCTS      │   │     ORDERS       │
├──────────────────┤   ├──────────────────┤
│ PK  id           │   │ PK  id           │
│     title        │◄──┤ FK  product_id   │
│     description  │   │ FK  buyer_id     │
│     price        │   │     quantity     │
│ FK  category_id  │   │     total_price  │
│ FK  user_id      │   │     status       │
│     created_at   │   │     created_at   │
└──────────────────┘   └──────────────────┘
         ▲
         │ *
         │
         │ 1
         │
┌──────────────────┐
│   CATEGORIES     │
├──────────────────┤
│ PK  id           │
│     name         │
│     description  │
└──────────────────┘


## Relationships

1. **USERS → PRODUCTS** (One-to-Many)
   - One user (seller) can have many products
   - Foreign Key: products.user_id → users.id

2. **USERS → ORDERS** (One-to-Many)
   - One user (buyer) can have many orders
   - Foreign Key: orders.buyer_id → users.id

3. **CATEGORIES → PRODUCTS** (One-to-Many)
   - One category can have many products
   - Foreign Key: products.category_id → categories.id

4. **PRODUCTS → ORDERS** (One-to-Many)
   - One product can be in many orders
   - Foreign Key: orders.product_id → products.id


## Table Details

### USERS
- **Primary Key:** id
- **Unique Constraints:** username, email
- **Purpose:** Store user accounts (buyers and sellers)
- **Relationships:** 
  - Has many products (as seller)
  - Has many orders (as buyer)

### CATEGORIES
- **Primary Key:** id
- **Unique Constraints:** name
- **Purpose:** Organize products into categories
- **Relationships:** Has many products

### PRODUCTS
- **Primary Key:** id
- **Foreign Keys:** 
  - category_id → categories.id
  - user_id → users.id
- **Purpose:** Store digital products for sale
- **Relationships:** 
  - Belongs to one category
  - Belongs to one user (seller)
  - Has many orders

### ORDERS
- **Primary Key:** id
- **Foreign Keys:** 
  - product_id → products.id
  - buyer_id → users.id
- **Purpose:** Track product purchases
- **Relationships:** 
  - Belongs to one product
  - Belongs to one user (buyer)
