#!/bin/bash

echo "Creating sample transactions for Gas Station POS system..."

# Get auth token
echo "Getting authentication token..."
TOKEN=$(curl -s "http://localhost:8080/api/auth/signin" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "Failed to get authentication token. Make sure backend is running and credentials are correct."
  exit 1
fi

echo "Authentication successful!"

# Get cashier user ID
CASHIER_ID=$(curl -s "http://localhost:8080/api/users" \
  -H "Authorization: Bearer $TOKEN" \
  | grep -o '"id":[0-9]*,"username":"cashier1"' | grep -o '"id":[0-9]*' | cut -d':' -f2)

if [ -z "$CASHIER_ID" ]; then
  echo "Could not find cashier user. Using admin as cashier."
  CASHIER_ID=1
fi

echo "Using cashier ID: $CASHIER_ID"

# Transaction 1: Credit Card - Coca Cola + Lay's Chips
echo "Creating Transaction 1: Credit Card Purchase..."
curl -s "http://localhost:8080/api/pos/transactions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "transactionNumber": "TXN-001",
    "paymentMethod": "CREDIT_CARD",
    "status": "COMPLETED",
    "subtotal": 4.38,
    "taxAmount": 0.36,
    "totalAmount": 4.74,
    "discountAmount": 0,
    "cashier": {"id": '$CASHIER_ID'}
  }' > /dev/null

echo "Transaction 1 created: Credit Card - $4.74"

# Transaction 2: EBT - Bread + Milk (no tax)
echo "Creating Transaction 2: EBT Purchase..."
curl -s "http://localhost:8080/api/pos/transactions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "transactionNumber": "TXN-002",
    "paymentMethod": "EBT",
    "status": "COMPLETED",
    "subtotal": 6.48,
    "taxAmount": 0.00,
    "totalAmount": 6.48,
    "discountAmount": 0,
    "cashier": {"id": '$CASHIER_ID'}
  }' > /dev/null

echo "Transaction 2 created: EBT - $6.48 (no tax)"

# Transaction 3: Cash - Marlboro (high tax)
echo "Creating Transaction 3: Cash Purchase..."
curl -s "http://localhost:8080/api/pos/transactions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "transactionNumber": "TXN-003",
    "paymentMethod": "CASH",
    "status": "COMPLETED",
    "subtotal": 8.99,
    "taxAmount": 1.39,
    "totalAmount": 10.38,
    "discountAmount": 0,
    "cashier": {"id": '$CASHIER_ID'}
  }' > /dev/null

echo "Transaction 3 created: Cash - $10.38 (with 15.5% tobacco tax)"

# Transaction 4: Mixed payment - Snickers + Red Bull
echo "Creating Transaction 4: Debit Card Purchase..."
curl -s "http://localhost:8080/api/pos/transactions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "transactionNumber": "TXN-004",
    "paymentMethod": "DEBIT_CARD",
    "status": "COMPLETED",
    "subtotal": 5.78,
    "taxAmount": 0.48,
    "totalAmount": 6.26,
    "discountAmount": 0,
    "cashier": {"id": '$CASHIER_ID'}
  }' > /dev/null

echo "Transaction 4 created: Debit Card - $6.26"

# Transaction 5: Large mixed cart
echo "Creating Transaction 5: Large Mixed Purchase..."
curl -s "http://localhost:8080/api/pos/transactions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "transactionNumber": "TXN-005",
    "paymentMethod": "CREDIT_CARD",
    "status": "COMPLETED",
    "subtotal": 15.50,
    "taxAmount": 1.28,
    "totalAmount": 16.78,
    "discountAmount": 0,
    "cashier": {"id": '$CASHIER_ID'}
  }' > /dev/null

echo "Transaction 5 created: Credit Card - $16.78"

echo ""
echo "Sample transactions created successfully!"
echo "You can now view them in the POS Transaction History tab."
echo ""
echo "Test transactions created:"
echo "1. TXN-001: Credit Card - $4.74 (Beverages + Snacks)"
echo "2. TXN-002: EBT - $6.48 (Food items, no tax)"
echo "3. TXN-003: Cash - $10.38 (Tobacco with high tax)"
echo "4. TXN-004: Debit Card - $6.26 (Mixed items)"
echo "5. TXN-005: Credit Card - $16.78 (Large mixed cart)"
echo ""
echo "Go to http://localhost:3000 → Login → POS → Transaction History tab to view bills!" 