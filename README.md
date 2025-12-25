erDiagram

    USER {
        int id PK
        string username
        string email
        string role
    }

    ROLE {
        int id PK
        string name
    }

    RESTAURANT_TABLE {
        int id PK
        int table_number
        int seating_capacity
        string status
    }

    MENU_ITEM {
        int id PK
        string name
        string category
        float price
        boolean is_available
    }

    ORDER {
        int id PK
        string status
        datetime created_at
    }

    ORDER_ITEM {
        int id PK
        int quantity
        float price
    }

    BILL {
        int id PK
        float subtotal
        float tax
        float total
        string status
        datetime created_at
    }

    ROLE ||--o{ USER : assigns
    USER ||--o{ ORDER : creates
    RESTAURANT_TABLE ||--o{ ORDER : has
    ORDER ||--o{ ORDER_ITEM : contains
    MENU_ITEM ||--o{ ORDER_ITEM : included_in
    RESTAURANT_TABLE ||--|| BILL : generates
    USER ||--o{ BILL : processes
