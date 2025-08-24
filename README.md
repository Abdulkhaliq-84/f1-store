# 🏎️ F1 Store - Formula 1 E-Commerce Platform

A modern, full-stack e-commerce application for Formula 1 merchandise built with React, TypeScript, ASP.NET Core, and Entity Framework Core.

![F1 Store](https://img.shields.io/badge/F1-Store-dc143c?style=for-the-badge&logo=formula1&logoColor=white)
[![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![.NET](https://img.shields.io/badge/.NET_Core-8.0+-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![Entity Framework](https://img.shields.io/badge/Entity_Framework-Core-512BD4?style=for-the-badge&logo=microsoft&logoColor=white)](https://docs.microsoft.com/en-us/ef/)

## 📋 Table of Contents

- [🌟 Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [🔧 Installation](#-installation)
- [⚙️ Configuration](#️-configuration)
- [📖 API Documentation](#-api-documentation)
- [🎨 UI/UX Features](#-uiux-features)
- [🔐 Authentication](#-authentication)
- [🛒 E-Commerce Features](#-e-commerce-features)
- [📱 Responsive Design](#-responsive-design)
- [🧪 Testing](#-testing)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👨‍💻 Developer](#-developer)

## 🌟 Features

### 🛍️ E-Commerce Core
- **Product Catalog** - Browse F1 merchandise by teams and drivers
- **Shopping Cart** - Add, update, and remove items with real-time totals
- **Order Management** - Complete checkout process with order tracking
- **User Authentication** - Secure sign-up, sign-in, and user sessions
- **Admin Dashboard** - Comprehensive management interface

### 🏁 F1 Specific
- **Team Products** - Merchandise organized by F1 teams (Mercedes, Ferrari, Red Bull, etc.)
- **Driver Products** - Items featuring specific F1 drivers
- **Saudi Riyal Currency** - Localized pricing with ﷼ symbol
- **F1 Branding** - Authentic Formula 1 design and theming

### 🎛️ Admin Features
- **Product Management** - CRUD operations for inventory
- **Order Tracking** - Real-time order status updates
- **User Management** - Customer account oversight
- **Analytics Dashboard** - Revenue and sales insights
- **Inventory Control** - Stock management and reporting

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe JavaScript development
- **React Router DOM** - Client-side routing
- **CSS3** - Custom styling with modern features
- **Context API** - State management for authentication
- **Responsive Design** - Mobile-first approach

### Backend
- **ASP.NET Core 8** - High-performance web API
- **Entity Framework Core** - ORM for database operations
- **SQLite** - Lightweight database for development
- **RESTful API** - Standard HTTP methods and status codes
- **CORS Support** - Cross-origin resource sharing
- **Dependency Injection** - Built-in IoC container

### Development Tools
- **Vite** - Fast build tool and dev server
- **npm** - Package management
- **Git** - Version control
- **VS Code** - Recommended IDE

## 📁 Project Structure

```
f1-store/
├── f1-store-frontend/          # React TypeScript Frontend
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── layout/         # Navigation, Footer
│   │   │   ├── sections/       # Page sections
│   │   │   └── ui/             # UI components (Price, etc.)
│   │   ├── pages/              # Route components
│   │   ├── contexts/           # React contexts
│   │   ├── types/              # TypeScript type definitions
│   │   ├── utils/              # Utility functions
│   │   └── constants/          # App constants
│   ├── package.json
│   └── vite.config.ts
│
├── f1-store-backend/           # ASP.NET Core Backend
│   └── f1-store-api/
│       ├── Controllers/        # API controllers
│       ├── Models/             # Entity models
│       │   └── DTOs/           # Data transfer objects
│       ├── Services/           # Business logic
│       ├── Data/               # Database context
│       ├── Migrations/         # EF Core migrations
│       └── Program.cs          # Application entry point
│
└── README.md                   # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.0 or higher)
- **.NET 8 SDK**
- **Git**
- **Code Editor** (VS Code recommended)

### Quick Start
```bash
# Clone the repository
git clone https://github.com/Abdulkhaliq-84/f1-store.git
cd f1-store

# Start backend
cd f1-store-backend/f1-store-api
dotnet restore
dotnet ef database update
dotnet run

# Start frontend (in new terminal)
cd f1-store-frontend
npm install
npm run dev
```

## 🔧 Installation

### Backend Setup
```bash
cd f1-store-backend/f1-store-api

# Restore dependencies
dotnet restore

# Create database
dotnet ef migrations add InitialCreate
dotnet ef database update

# Run the API
dotnet run
```
The API will be available at `https://localhost:7295`

### Frontend Setup
```bash
cd f1-store-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
The frontend will be available at `http://localhost:5173`

## ⚙️ Configuration

### Backend Configuration
Configure the API in `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=f1store.db"
  },
  "Cors": {
    "AllowedOrigins": ["http://localhost:5173"]
  }
}
```

### Frontend Configuration
Update API endpoints in `src/constants/index.ts`:
```typescript
export const API_BASE_URL = 'https://localhost:7295/api';
```

## 📖 API Documentation

### Authentication Endpoints
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login

### Product Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create new product (Admin)
- `PUT /api/products/{id}` - Update product (Admin)
- `DELETE /api/products/{id}` - Delete product (Admin)

### Cart Endpoints
- `GET /api/cart/{userId}` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/{itemId}` - Update cart item
- `DELETE /api/cart/{itemId}` - Remove cart item
- `POST /api/cart/checkout` - Process checkout

### Order Endpoints
- `GET /api/order` - Get all orders (Admin)
- `GET /api/order/user/{userId}` - Get user orders
- `PUT /api/order/{id}/status` - Update order status (Admin)
- `GET /api/order/analytics/revenue` - Revenue analytics (Admin)
- `GET /api/order/analytics/count` - Order count analytics (Admin)

## 🎨 UI/UX Features

### Design System
- **F1 Red Theme** (#dc143c) - Primary brand color
- **Modern Typography** - Clean, readable fonts
- **Card-Based Layout** - Organized content presentation
- **Hover Effects** - Interactive feedback
- **Loading States** - User feedback during operations

### Components
- **Reusable Price Component** - Consistent currency formatting
- **Responsive Navigation** - Mobile-friendly menu
- **Product Cards** - Attractive product presentation
- **Admin Dashboard** - Professional management interface

## 🔐 Authentication

### User Authentication
- **JWT-based** sessions (ready for implementation)
- **Role-based** access control (User/Admin)
- **Protected Routes** - Auth guards for sensitive pages
- **Persistent Sessions** - Local storage integration

### Security Features
- **Input Validation** - Client and server-side validation
- **SQL Injection Protection** - Entity Framework parameterized queries
- **CORS Configuration** - Secure cross-origin requests

## 🛒 E-Commerce Features

### Shopping Experience
- **Product Browsing** - Filter by teams and drivers
- **Search Functionality** - Find products quickly
- **Shopping Cart** - Persistent cart state
- **Checkout Process** - Streamlined purchase flow
- **Order History** - Track past purchases

### Inventory Management
- **Stock Tracking** - Real-time inventory updates
- **Product Categories** - Organized merchandise
- **Image Management** - Product photo handling
- **Pricing Control** - Dynamic pricing support

## 📱 Responsive Design

### Mobile-First Approach
- **Breakpoints**: 320px, 768px, 1024px, 1440px
- **Touch-Friendly** - Optimized for mobile interactions
- **Fast Loading** - Optimized images and code splitting
- **Cross-Browser** - Chrome, Firefox, Safari, Edge support

### Performance Optimizations
- **Lazy Loading** - Images and components
- **Code Splitting** - Reduced bundle sizes
- **Caching** - Browser and API response caching
- **Minification** - Optimized production builds

## 🧪 Testing

### Frontend Testing
```bash
cd f1-store-frontend
npm run test       # Unit tests
npm run test:e2e   # End-to-end tests
npm run lint       # Code linting
```

### Backend Testing
```bash
cd f1-store-backend/f1-store-api
dotnet test        # Unit tests
dotnet build       # Build verification
```

## 🚀 Deployment

### Frontend Deployment
```bash
cd f1-store-frontend
npm run build      # Create production build
```

### Backend Deployment
```bash
cd f1-store-backend/f1-store-api
dotnet publish -c Release
```

### Environment Variables
Create `.env` files for different environments:
```env
VITE_API_URL=https://your-api-domain.com/api
```

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow **TypeScript** best practices
- Write **descriptive** commit messages
- Add **tests** for new features
- Update **documentation** as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Abdulkhaliq Alsubaie**
- GitHub: [@Abdulkhaliq-84](https://github.com/Abdulkhaliq-84)
- Email: [Contact Developer](mailto:contact@example.com)

### Project Stats
- **Total Files**: 50+ components and services
- **Lines of Code**: 5,000+ (Frontend + Backend)
- **Development Time**: Full-stack implementation
- **Database Tables**: Users, Products, Cart, Orders, etc.

---

### 🏁 Ready to Race?

Experience the thrill of Formula 1 shopping with our modern e-commerce platform!

```bash
git clone https://github.com/Abdulkhaliq-84/f1-store.git
cd f1-store
# Follow installation steps above
```

**Built with ❤️ and ⚡ by Abdulkhaliq Alsubaie**
