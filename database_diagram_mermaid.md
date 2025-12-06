# MiniHub Database ER Diagram (Mermaid)

## Entity Relationship Diagram

```mermaid
erDiagram
    USERS ||--o{ PRODUCTS : "creates"
    USERS ||--o{ ORDERS : "places"
    CATEGORIES ||--o{ PRODUCTS : "contains"
    PRODUCTS ||--o{ ORDERS : "ordered_in"

    USERS {
        int id PK
        string username UK
        string email UK
        string name
        string role
        string hashed_password
    }

    CATEGORIES {
        int id PK
        string name UK
        string description
    }

    PRODUCTS {
        int id PK
        string title
        string description
        float price
        int category_id FK
        int user_id FK
        datetime created_at
    }

    ORDERS {
        int id PK
        int product_id FK
        int buyer_id FK
        int quantity
        float total_price
        string status
        datetime created_at
    }
```

## How to View This Diagram

1. **On GitHub:** This diagram will render automatically when you view this file on GitHub
2. **VS Code:** Install the "Markdown Preview Mermaid Support" extension
3. **Online:** Copy the mermaid code to https://mermaid.live/

## Relationship Descriptions

- **USERS creates PRODUCTS**: One seller can create multiple products (1:N)
- **USERS places ORDERS**: One buyer can place multiple orders (1:N)
- **CATEGORIES contains PRODUCTS**: One category can have multiple products (1:N)
- **PRODUCTS ordered_in ORDERS**: One product can be in multiple orders (1:N)
