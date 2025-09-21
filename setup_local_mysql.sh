#!/bin/bash

echo "🗄️  Setting up Local MySQL Database for Gas Station Application"
echo "=============================================================="

# Check if MySQL is installed and running
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL is not installed. Please install MySQL first."
    echo "📋 On macOS: brew install mysql"
    echo "📋 On Ubuntu: sudo apt-get install mysql-server"
    exit 1
fi

# Check if MySQL service is running
if ! mysqladmin ping &> /dev/null; then
    echo "❌ MySQL service is not running. Please start MySQL first."
    echo "📋 On macOS: brew services start mysql"
    echo "📋 On Ubuntu: sudo systemctl start mysql"
    exit 1
fi

echo "✅ MySQL is installed and running"

# Prompt for MySQL root password
echo "📋 Enter your MySQL root password:"
read -s MYSQL_ROOT_PASSWORD

# Test MySQL root connection
if ! mysql -u root -p"$MYSQL_ROOT_PASSWORD" -e "SELECT 1;" &> /dev/null; then
    echo "❌ Failed to connect to MySQL with provided password."
    exit 1
fi

echo "✅ MySQL root connection successful"

echo "📋 Step 1: Creating database and user..."
if mysql -u root -p"$MYSQL_ROOT_PASSWORD" < create_mysql_database.sql; then
    echo "✅ Database and tables created successfully"
else
    echo "❌ Failed to create database schema"
    exit 1
fi

echo "📋 Step 2: Inserting sample data..."
if mysql -u root -p"$MYSQL_ROOT_PASSWORD" < insert_sample_data.sql; then
    echo "✅ Sample data inserted successfully"
else
    echo "❌ Failed to insert sample data"
    exit 1
fi

echo "📋 Step 3: Testing database connection..."
if mysql -u gasstation_user -pgasstation_password gasstation -e "SELECT COUNT(*) as product_count FROM products; SELECT COUNT(*) as user_count FROM users;" 2>/dev/null; then
    echo "✅ Database connection test successful"
else
    echo "❌ Database connection test failed"
    exit 1
fi

echo ""
echo "🎉 MySQL Database Setup Completed Successfully!"
echo "================================================"
echo ""
echo "📊 Database Connection Information:"
echo "  Host: localhost"
echo "  Port: 3306"
echo "  Database: gasstation"
echo "  Username: gasstation_user"
echo "  Password: gasstation_password"
echo ""
echo "👥 Test User Accounts (password: admin123):"
echo "  admin     - System Administrator"
echo "  manager1  - Store Manager"
echo "  cashier1  - Cashier (Jane)"
echo "  cashier2  - Cashier (Bob)"
echo ""
echo "🛒 Sample Data Included:"
echo "  ✓ 8 Product categories"
echo "  ✓ 20+ Products with inventory"
echo "  ✓ 7 Lottery games"
echo "  ✓ 6 Fuel types with current prices"
echo "  ✓ 3 Active promotions"
echo "  ✓ 5 Sample transactions"
echo "  ✓ Service logs (bill pay, check cashing, etc.)"
echo ""
echo "🚀 Next Steps:"
echo "1. Start the backend application:"
echo "   cd backend && mvn spring-boot:run -Dspring-boot.run.profiles=mysql"
echo ""
echo "2. Start the frontend application:"
echo "   cd frontend && npm start"
echo ""
echo "3. Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8080/api"
echo ""
echo "🔍 To connect to MySQL directly:"
echo "   mysql -u gasstation_user -pgasstation_password gasstation"
echo ""
echo "🧪 Test the API:"
echo "   curl http://localhost:8080/api/test/health"
echo "" 