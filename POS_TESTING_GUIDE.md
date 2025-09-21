# Gas Station POS Testing Guide

## Getting Started

### 1. Login Credentials
Use these test accounts to login:

- **Admin**: `admin` / `password123`
- **Manager**: `manager1` / `password123`  
- **Cashier**: `cashier1` / `password123`

### 2. Access the POS System
1. Login to the frontend at `http://localhost:3000`
2. Navigate to **POS** from the sidebar menu
3. You'll see two tabs: **New Sale** and **Transaction History**

## Creating Test Transactions

### Method 1: Using Barcode Search (Recommended)
1. Go to **New Sale** tab
2. In the barcode field, enter one of these test barcodes:
   - `123456789012` (Coca Cola 20oz - $1.89)
   - `123456789013` (Pepsi 20oz - $1.89)
   - `234567890123` (Lay's Classic Chips - $2.49)
   - `234567890124` (Snickers Bar - $1.79)
   - `345678901234` (Marlboro Red Pack - $8.99)
3. Press Enter or click search
4. Product will be added to cart automatically

### Method 2: Product Search and Selection
1. Type a product name in the search field (e.g., "coca", "chips", "snickers")
2. Click on the product from the search results to add to cart
3. Adjust quantity using +/- buttons if needed

### Method 3: Quick Add Popular Items
The system includes these pre-loaded products:
- **Beverages**: Coca Cola, Pepsi, Red Bull, Water, Monster Energy
- **Snacks**: Lay's Chips, Snickers, M&M's, Doritos  
- **Tobacco**: Marlboro, Newport
- **Food**: Bread, Milk, Hot Dog

## Testing Different Payment Scenarios

### Scenario 1: Cash Transaction
1. Add products to cart (e.g., Coca Cola + Lay's Chips)
2. Select **Cash** as payment method
3. Enter amount paid (e.g., $10.00)
4. Click **Complete Transaction**
5. System will calculate change automatically

### Scenario 2: Credit Card Transaction
1. Add mixed items to cart
2. Select **Credit Card** as payment method
3. Click **Complete Transaction** (no cash amount needed)
4. All items will be taxed normally

### Scenario 3: EBT/Food Stamps Transaction
1. Add food stamp eligible items:
   - Coca Cola (eligible)
   - Bread (eligible)  
   - Lay's Chips (eligible)
2. Select **EBT / Food Stamps** as payment method
3. Click **Complete Transaction**
4. Notice: **NO TAX** applied to food stamp eligible items

### Scenario 4: Mixed Cart with Non-Eligible Items
1. Add both eligible and non-eligible items:
   - Coca Cola (food stamp eligible)
   - Red Bull (NOT eligible - energy drink)
2. Select **EBT / Food Stamps**
3. System will show breakdown:
   - Food stamp items: No tax
   - Non-eligible items: Still taxed

### Scenario 5: High-Tax Items (Tobacco)
1. Add tobacco products (Marlboro - 15.50% tax rate)
2. Select any payment method
3. Notice high tax calculation
4. Complete transaction

## Viewing Transaction History

### Access Transaction Details
1. Go to **Transaction History** tab
2. You'll see a list of all completed transactions
3. Each row shows:
   - Transaction number
   - Date and time  
   - Cashier name
   - Payment method
   - Total amount
   - Status

### View Transaction Bill/Receipt
1. Click **View Details** button on any transaction
2. Modal will open showing complete receipt:
   - Store header information
   - Transaction details
   - Itemized list of products
   - Tax calculations
   - Payment information
3. Click **Print Receipt** to print or save as PDF

## Testing Tax Calculations

### Understanding Tax Rates by Category
- **Beverages**: 8.25% tax
- **Snacks**: 8.25% tax  
- **Tobacco**: 15.50% tax
- **Automotive**: 7.50% tax
- **Food**: 6.00% tax

### Food Stamp Eligibility Rules
**Eligible Items** (No tax when paying with EBT):
- Coca Cola, Pepsi, Water
- Lay's Chips, Snickers, M&M's, Doritos
- Bread, Milk

**NOT Eligible** (Always taxed):
- Red Bull, Monster Energy (energy drinks)
- Marlboro, Newport (tobacco)
- Hot Dog (prepared hot food)

## Sample Test Scenarios

### Test 1: Basic Mixed Transaction
```
Items: Coca Cola ($1.89) + Lay's Chips ($2.49)
Payment: Credit Card
Expected Tax: ($1.89 + $2.49) × 8.25% = $0.36
Expected Total: $4.38 + $0.36 = $4.74
```

### Test 2: EBT Transaction  
```
Items: Bread ($2.99) + Milk ($3.49)
Payment: EBT
Expected Tax: $0.00 (food stamp eligible)
Expected Total: $6.48
```

### Test 3: Tobacco Transaction
```
Items: Marlboro ($8.99)  
Payment: Cash ($10.00)
Expected Tax: $8.99 × 15.50% = $1.39
Expected Total: $10.38
Expected Change: $0.00 (insufficient payment)
```

## Pre-Created Sample Transactions

The system should already have 3 sample transactions:
- **TXN-001**: Credit card transaction
- **TXN-002**: EBT transaction  
- **TXN-003**: Cash transaction

You can view these in the Transaction History to see the receipt format.

## Troubleshooting

### Common Issues
1. **Product not found**: Make sure barcode is exactly correct
2. **Transaction fails**: Check that cart is not empty
3. **Tax not calculating**: Verify product has category assigned
4. **EBT validation error**: Ensure food stamp eligible items in cart

### Browser Console
Press F12 and check Console tab for any error messages during transaction processing.

### Backend Logs
Check the terminal where backend is running for detailed error logs.

## Testing Checklist

- [ ] Login with different user roles
- [ ] Add products via barcode search
- [ ] Add products via text search  
- [ ] Test each payment method
- [ ] Verify tax calculations for different categories
- [ ] Test EBT payment with eligible/ineligible items
- [ ] Complete transactions and verify they appear in history
- [ ] View transaction details/receipts
- [ ] Test print receipt functionality
- [ ] Verify change calculation for cash payments
- [ ] Test transaction void functionality (if needed)

This comprehensive testing should give you a full understanding of the POS system capabilities! 