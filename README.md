# Simple E-Commerce (Car Spare Parts)

## Purpose

This project is a comprehensive full-stack e-commerce web application specifically tailored for selling car spare parts. It is structured as a modern **Monorepo** (using Turborepo) to efficiently manage both the frontend interface and the backend API within a single repository.

The primary goal of this application is to provide a seamless shopping experience for customers looking for automotive parts, while equipping administrators with robust tools to easily manage their catalog and track incoming orders.

## Core Technologies

- **Frontend**: Next.js, Bootstrap 5 for responsive UI, and ECharts/Select2 for interactive components.
- **Backend**: Express, implementing a middleware-centric and RESTful architecture.
- **Database**: PostgreSQL, managed via Prisma ORM for type-safe database queries.
- **Architecture**: Turborepo Monorepo (Apps: `web`, `api` | Packages: `database`).

## Key Features

- **User Authentication**: Secure Login, Registration, and "Forgot Password" functionality.
- **Product Catalog**: Browse spare parts complete with images, categories, brands, and car compatibility details.
- **Admin Management**: Dedicated admin pages to register new Categories, Brands, and Products.
- **Auto-Generated SKUs**: The system automatically generates unique, configurable Part Numbers (SKUs) for every new product registered.
- **Shopping Cart & Checkout**: Client-side cart management with a streamlined manual checkout process (Bank Transfer).
- **Order History**: Users can track their past purchases and payment statuses.

## Usage & Setup Instructions

To get this project up and running on your local machine, please refer to our detailed documentation located in the `docs` folder:

1. **[Getting Started Guide](./docs/getting-started-monorepo.md)**: Step-by-step instructions on setting up the monorepo, configuring environment variables, running database migrations, and starting the development servers.
2. **[Troubleshooting](./docs/troubleshooting.md)**: Common issues and how to resolve them.
3. **[Implementation Plans](./docs/implementation_plan.md)**: Details regarding the architectural decisions and completed modules.
4. **[Walkthrough](./docs/walkthrough.md)**: A summary of the core modules' behavior and features.

---

_Built with precision and modern best practices for robust web application development._
