# POS Management System

A comprehensive modular Gas Station management system built with modern technologies. This application provides a complete point-of-sale solution for gas stations with inventory management, user authentication, and real-time transaction processing.

## Tech Stack

**Backend:**
- Java 17+ with Spring Boot 3.x
- Spring Security with JWT Authentication
- Hibernate/JPA for ORM
- H2 Database (In-Memory) for Development
- MySQL/PostgreSQL Support for Production
- Maven for Dependency Management

**Frontend:**
- React.js 18+
- Tailwind CSS for Styling
- React Router for Navigation
- Axios for API Communication
- Context API for State Management

## Project Structure

```
gas-station-app/
├── backend/                          # Spring Boot Backend
│   ├── src/main/java/com/gasstation/
│   │   ├── config/                   # Configuration classes
│   │   ├── controller/               # REST Controllers
│   │   ├── dto/                      # Data Transfer Objects
│   │   ├── entity/                   # JPA Entities
│   │   ├── repository/               # JPA Repositories
│   │   ├── service/                  # Business Logic Services
│   │   ├── security/                 # Security Configuration
│   │   └── exception/                # Exception Handlers
│   ├── src/main/resources/
│   │   ├── db/migration/             # Flyway Migrations
│   │   └── application.yml           # Configuration
│   ├── Dockerfile
│   └── pom.xml
├── frontend/                         # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/               # Reusable Components
│   │   ├── pages/                    # Page Components
│   │   ├── context/                  # React Context
│   │   ├── services/                 # API Services
│   │   ├── utils/                    # Utility Functions
│   │   └── styles/                   # Global Styles
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml                # Multi-container setup
└── README.md
```

## Modules

1. **Dashboard** - Overview with alerts and analytics
2. **Category Management** - Product category CRUD
3. **Pricebook Management** - Product management with barcode support
4. **Inventory Management** - Stock management and auditing
5. **Live Sales (POS)** - Point of sale simulation
6. **Lottery Management** - Lottery games management
7. **Fuel Management** - Fuel deliveries and pricing
8. **Promotions** - Promotional campaigns
9. **Services Logging** - Additional services tracking
10. **User Access Management** - Role-based authentication

## Database Configuration

**Development (H2 In-Memory Database):**
- Automatically configured for local development
- Sample data is loaded on startup
- No additional setup required

**Production Options:**
- MySQL Database (see `setup_local_mysql.sh` for setup)
- PostgreSQL Database (configure in `application.yml`)

## Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- Maven 3.6 or higher

### Quick Start (Recommended)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/LakshmiReddy-Sanikommu/POS-Management.git
   cd POS-Management
   ```

2. **Start the Backend:**
   ```bash
   cd backend
   mvn spring-boot:run -Dspring-boot.run.profiles=h2
   ```
   The backend will start on `http://localhost:8080`

3. **Start the Frontend:**
   ```bash
   cd frontend
   npm install
   npm start
   ```
   The frontend will start on `http://localhost:3000`

4. **Access the Application:**
   - Open your browser and go to `http://localhost:3000`
   - Use the login credentials below

### Login Credentials

**Demo Accounts (All passwords: `password123`):**
- **Admin:** `admin` / `password123` - Full system access
- **Manager:** `manager1` / `password123` - Management and cashier functions
- **Cashier:** `cashier1` / `password123` - Point of sale operations

### Alternative Setup Methods

**Backend Setup (Manual):**
```bash
cd backend
mvn clean install
mvn spring-boot:run -Dspring-boot.run.profiles=h2
```

**Frontend Setup (Manual):**
```bash
cd frontend
npm install
npm start
```

**MySQL Setup (Optional):**
```bash
# Setup MySQL database
./setup_local_mysql.sh

# Start with MySQL
./start_backend_mysql.sh
```

## API Documentation

The backend exposes RESTful APIs at:
- Base URL: `http://localhost:8080/api`
- Health Check: `http://localhost:8080/actuator/health`
- Authentication: `http://localhost:8080/api/auth/signin`

### Key API Endpoints:
- `POST /api/auth/signin` - User login
- `GET /api/products` - Get all products
- `GET /api/pos/transactions` - Get transaction history
- `GET /api/categories` - Get product categories
- `GET /api/users` - Get user list (Admin only)

## Security

- JWT-based authentication with 24-hour token expiration
- Role-based access control (Admin, Manager, Cashier)
- Spring Security configuration
- Protected API endpoints
- Password encryption using BCrypt

## Features

### Dashboard
- Real-time system overview
- Sales analytics and alerts
- Quick access to all modules

### Point of Sale (POS)
- Barcode scanning support
- Multiple payment methods (Cash, Credit Card, Debit Card, EBT)
- Tax calculation
- Receipt generation
- Transaction history

### Inventory Management
- Product catalog with categories
- Stock level monitoring
- Low stock alerts
- Barcode management

### User Management
- Role-based access control
- User authentication and authorization
- Secure password management

## Development

### Current Status
- ✅ Backend: Running on port 8080
- ✅ Frontend: Running on port 3000
- ✅ Database: H2 in-memory with sample data
- ✅ Authentication: Working with demo credentials
- ✅ All modules: Functional and tested

### Development Notes
1. Backend runs on port 8080 with H2 database
2. Frontend runs on port 3000 with hot reloading
3. Sample data automatically loaded on startup
4. JWT tokens valid for 24 hours
5. All API endpoints protected except authentication

### Troubleshooting

**If login fails:**
- Ensure backend is running on port 8080
- Check that H2 profile is active
- Verify credentials: `admin` / `password123`

**If frontend can't connect:**
- Check backend health: `http://localhost:8080/actuator/health`
- Verify CORS configuration
- Check browser console for errors

**Database issues:**
- H2 database resets on each restart
- Sample data is automatically loaded
- For persistent data, use MySQL setup 
