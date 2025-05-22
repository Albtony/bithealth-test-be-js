# bithealth-test-be-js
This is the backend repository for BitHealth's take-home test.
It provides a backend service for a first-party online shop with support for customizable product attributes, order management, and user roles.


📄 ERD:
- View the database schema

⚙️ Tech Stack
- Node.js
- Express.js
- Sequelize (PostgreSQL / MySQL)
- UUID, bcrypt, and JWT for authentication
- Swagger for API documentation [not yet implemented]

🚀 Key Features
- 🔐 RBAC: Role-based access for employees and customers
- 🛍️ Product Models & Variants: Products can have multiple attribute combinations
- 🧩 Custom Attributes: Support for category-level and model-level attributes
- 📦 Inventory Management: Track stock by product variant
