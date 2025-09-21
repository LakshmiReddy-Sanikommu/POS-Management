#!/bin/bash

echo "🚀 Starting Gas Station Backend with MySQL Database"
echo "=================================================="

# Check if MySQL is running
if ! mysqladmin ping &> /dev/null; then
    echo "❌ MySQL service is not running. Please start MySQL first."
    echo "📋 On macOS: brew services start mysql"
    exit 1
fi

# Test database connection
echo "📋 Testing database connection..."
if mysql -u gasstation_user -pgasstation_password gasstation -e "SELECT 1;" &> /dev/null; then
    echo "✅ Database connection successful"
else
    echo "❌ Cannot connect to gasstation database."
    echo "📋 Please run the setup script first: ./setup_local_mysql.sh"
    exit 1
fi

echo "📋 Starting Spring Boot application with MySQL profile..."
cd backend

# Set environment variables for MySQL
export SPRING_PROFILES_ACTIVE=mysql
export SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/gasstation?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
export SPRING_DATASOURCE_USERNAME="gasstation_user"
export SPRING_DATASOURCE_PASSWORD="gasstation_password"

echo "📊 Using configuration:"
echo "  Profile: mysql"
echo "  Database: gasstation@localhost:3306"
echo "  User: gasstation_user"
echo ""

# Start the application
mvn spring-boot:run -Dspring-boot.run.profiles=mysql 