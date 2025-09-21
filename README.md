# Gas Station Back-Office Application

A comprehensive modular Gas Station management system built with modern technologies.

## Tech Stack

**Backend:**
- Java 17+ with Spring Boot 3.x
- Spring Security with JWT Authentication
- Hibernate/JPA for ORM
- Supabase PostgreSQL Database
- Flyway for Database Migrations
- Maven for Dependency Management

**Frontend:**
- React.js 18+
- Tailwind CSS for Styling
- React Router for Navigation
- Axios for API Communication
- Context API for State Management

**DevOps:**
- Docker for Containerization
- Maven for Build Management

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

**Supabase PostgreSQL Connection:**
- Project URL: `https://plfdcshdyijssjqlepfo.supabase.co`
- Connection String: `postgresql://postgres:gassamramgas@db.plfdcshdyijssjqlepfo.supabase.co:5432/postgres`

## Getting Started

### Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Docker Setup
```bash
docker-compose up --build
```

## API Documentation

The backend exposes RESTful APIs at:
- Base URL: `http://localhost:8080/api`
- Health Check: `http://localhost:8080/actuator/health`

## Security

- JWT-based authentication
- Role-based access control (Admin, Manager, Cashier)
- Spring Security configuration
- Protected API endpoints

## Development

1. Backend runs on port 8080
2. Frontend runs on port 3000
3. Database migrations handled by Flyway
4. Hot reloading enabled for development 