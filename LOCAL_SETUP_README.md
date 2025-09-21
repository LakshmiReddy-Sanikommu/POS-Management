# Gas Station Application - Local Development Setup

## 🎯 Overview

This Gas Station application is a full-stack solution with a Spring Boot backend and React frontend, using MySQL as the database. This guide will help you set up and run the application locally on your computer.

## 📋 Prerequisites

### Required Software
1. **Java 17** or higher - [Download](https://adoptopenjdk.net/)
2. **Maven 3.6+** - [Download](https://maven.apache.org/download.cgi)
3. **Node.js 16+** - [Download](https://nodejs.org/)
4. **MySQL 8.0+** - [Download](https://dev.mysql.com/downloads/mysql/)

### Verify Installation
```bash
# Check Java version
java -version

# Check Maven version
mvn -version

# Check Node.js version
node -v
npm -v

# Check MySQL installation
mysql --version
```

## 🗄️ Database Setup

### Step 1: Start MySQL Service
```bash
# On macOS (with Homebrew)
brew services start mysql

# On Windows
net start mysql80

# On Linux (Ubuntu/Debian)
sudo systemctl start mysql
```

### Step 2: Create Database and Sample Data
```bash
# Run the automated setup script
./setup_local_mysql.sh
```

**What this script does:**
- Creates `gasstation` database
- Creates `gasstation_user` with appropriate permissions
- Creates all required tables with proper indexes
- Inserts comprehensive sample data for testing all modules

### Step 3: Verify Database Setup
```bash
# Connect to MySQL
mysql -u gasstation_user -pgasstation_password gasstation

# Verify tables exist
SHOW TABLES;

# Check sample data
SELECT COUNT(*) FROM products;
SELECT COUNT(*) FROM users;
```

## 🚀 Application Startup

### Method 1: Using Startup Scripts (Recommended)

```bash
# Terminal 1 - Start Backend
./start_backend_mysql.sh

# Terminal 2 - Start Frontend  
./start_frontend.sh
```

### Method 2: Manual Startup

**Backend:**
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=mysql
```

**Frontend:**
```bash
cd frontend
npm install  # First time only
npm start
```

## 🔗 Application URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **API Health Check**: http://localhost:8080/api/test/health

## 👥 Test User Accounts

| Username | Password | Role | Access Level |
|----------|----------|------|-------------|
| admin | test123 | Administrator | Full system access |
| manager1 | test123 | Manager | Management functions |
| cashier1 | test123 | Cashier | POS and basic functions |
| cashier2 | test123 | Cashier | POS and basic functions |

*Note: All passwords were standardized to `test123` during setup.*

## 🛒 Sample Data Overview

The database comes pre-loaded with realistic sample data:

### Categories & Products
- **8 Categories**: Beverages, Snacks, Tobacco, Alcohol, Food, Auto, Lottery, Phone Cards
- **20+ Products**: Each with barcode, pricing, inventory levels
- **Real Barcodes**: Actual product barcodes for testing scanners

### Inventory & Transactions
- **Current Stock Levels**: Realistic inventory quantities
- **5 Sample Transactions**: Different payment methods and product combinations
- **Inventory History**: Receive, sale, adjustment, and audit records

### Fuel Management
- **6 Fuel Types**: Regular 87, Midgrade 89, Premium 91/93, Diesel, E85
- **Current Pricing**: Realistic fuel prices
- **Delivery Records**: Sample fuel delivery history

### Lottery & Services
- **7 Lottery Games**: Including draw games and scratch-offs
- **Service Logs**: Bill payments, check cashing, money orders, phone cards

### Promotions
- **3 Active Promotions**: 
  - Snack volume discount
  - Energy drink discount
  - Hot food combo deals

## 🧪 Testing All Modules

### 1. Authentication
```bash
# Test login API
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"test123"}'
```

### 2. POS System
- Login as `cashier1` or `cashier2`
- Navigate to POS module
- Test barcode scanning with sample products
- Process transactions with different payment methods

### 3. Inventory Management
- Login as `manager1` or `admin`
- Check current inventory levels
- Add new products
- Adjust inventory quantities
- View inventory transaction history

### 4. Fuel Management
- Update fuel prices
- Record fuel deliveries
- View fuel delivery history

### 5. Lottery Management
- Manage lottery game inventory
- Track lottery sales
- Add new lottery games

### 6. Promotions
- View active promotions
- Create new promotions
- Link promotions to products

### 7. Services & Reports
- Record service transactions
- Generate sales reports
- View transaction history

## 🔧 Configuration

### Database Configuration
The application uses the `mysql` profile by default when running locally. Configuration is in:
- `backend/src/main/resources/application-mysql.yml`

### Frontend Configuration
API URL is configured in:
- `frontend/package.json` (proxy setting)
- `frontend/src/services/authService.js`

## 🐛 Troubleshooting

### Common Issues

**1. MySQL Connection Failed**
```bash
# Check if MySQL is running
mysqladmin ping

# Restart MySQL service
brew services restart mysql  # macOS
sudo systemctl restart mysql  # Linux
```

**2. Database Access Denied**
```bash
# Reset database setup
./setup_local_mysql.sh
```

**3. Backend Won't Start**
```bash
# Check Java version
java -version

# Ensure you're using Java 17+
# Clean and rebuild
cd backend
mvn clean install
```

**4. Frontend Won't Start**
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**5. API Calls Failing**
- Ensure backend is running on port 8080
- Check CORS configuration in `application-mysql.yml`
- Verify JWT token is valid

### Useful Commands

```bash
# View application logs
cd backend && mvn spring-boot:run -Dspring-boot.run.profiles=mysql

# Check MySQL processes
mysql -u root -p -e "SHOW PROCESSLIST;"

# View database size
mysql -u gasstation_user -pgasstation_password gasstation -e "
SELECT 
    table_name AS 'Table',
    table_rows AS 'Rows',
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.tables 
WHERE table_schema = 'gasstation'
ORDER BY (data_length + index_length) DESC;"
```

## 📈 Development Tips

1. **Database Changes**: Use Flyway migrations in `src/main/resources/db/migration/`
2. **API Testing**: Use tools like Postman or curl for API testing
3. **Live Reload**: Frontend supports hot reloading; backend requires restart for Java changes
4. **Debugging**: Enable debug logging in `application-mysql.yml`

## 🎉 Ready to Go!

Your Gas Station application is now set up with:
- ✅ Local MySQL database with sample data
- ✅ Spring Boot backend with MySQL connectivity
- ✅ React frontend with proxy configuration
- ✅ Comprehensive test data for all modules
- ✅ User accounts for different roles

**Start developing and testing all the gas station modules!** 🚀

---

**Need Help?** Check the troubleshooting section or run the health check endpoint to verify everything is working correctly. 