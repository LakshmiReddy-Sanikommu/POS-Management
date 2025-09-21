import React, { useState, useEffect } from 'react';
import authService from '../services/authService';

const POS = () => {
  const [activeTab, setActiveTab] = useState('new');
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [barcodeSearch, setBarcodeSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('CASH');
  const [customerPaid, setCustomerPaid] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedPromotions, setAppliedPromotions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);

  const paymentMethods = [
    { value: 'CASH', label: 'Cash' },
    { value: 'CREDIT_CARD', label: 'Credit Card' },
    { value: 'DEBIT_CARD', label: 'Debit Card' },
    { value: 'CHECK', label: 'Check' },
    { value: 'EBT', label: 'EBT / Food Stamps' },
    { value: 'GIFT_CARD', label: 'Gift Card' }
  ];

  useEffect(() => {
    if (activeTab === 'new') {
      fetchProducts();
      fetchPromotions();
    } else {
      fetchTransactions();
    }
  }, [activeTab]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await authService.getApiInstance().get('/pos/transactions');
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await authService.getApiInstance().get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPromotions = async () => {
    try {
      const response = await authService.getApiInstance().get('/promotions');
      const activePromotions = response.data.filter(promotion => {
        const now = new Date();
        const start = new Date(promotion.startDate);
        const end = new Date(promotion.endDate);
        return promotion.active && now >= start && now <= end;
      });
      setPromotions(activePromotions);
    } catch (error) {
      console.error('Error fetching promotions:', error);
    }
  };

  const fetchTransactionDetails = async (transactionId) => {
    try {
      const response = await authService.getApiInstance().get(`/pos/transactions/${transactionId}`);
      setSelectedTransaction(response.data);
      setShowTransactionDetails(true);
    } catch (error) {
      console.error('Error fetching transaction details:', error);
      alert('Error loading transaction details');
    }
  };

  const handleBarcodeSearch = async () => {
    if (!barcodeSearch.trim()) return;
    
    try {
      const response = await authService.getApiInstance().get(`/products/barcode/${barcodeSearch}`);
      const product = response.data;
      addToCart(product, 1);
      setBarcodeSearch('');
    } catch (error) {
      console.error('Product not found:', error);
      alert('Product not found');
    }
  };

  const handleProductSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const filtered = products.filter(product =>
      product.currentStock > 0 &&
      (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       product.barcode.includes(searchTerm))
    );
    setSearchResults(filtered.slice(0, 10));
  };

  const addToCart = (product, quantity = 1) => {
    if (product.currentStock <= 0) {
      alert(`${product.name} is out of stock`);
      return;
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.currentStock) {
          alert(`Cannot add more ${product.name}. Only ${product.currentStock} available in stock.`);
          return prevCart;
        }
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        if (quantity > product.currentStock) {
          alert(`Cannot add ${quantity} ${product.name}. Only ${product.currentStock} available in stock.`);
          return prevCart;
        }
        return [...prevCart, { product, quantity }];
      }
    });
  };

  const updateCartItemQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prevCart =>
        prevCart.map(item => {
          if (item.product.id === productId) {
            if (newQuantity > item.product.currentStock) {
              alert(`Cannot set quantity to ${newQuantity}. Only ${item.product.currentStock} available in stock.`);
              return item; // Keep the current quantity
            }
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
      );
    }
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  // Calculate tax for food stamp eligible items (no tax when paying with food stamps)
  const calculateFoodStampEligibleSubtotal = () => {
    return cart
      .filter(item => item.product.foodStampEligible)
      .reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  // Calculate tax for non-food stamp eligible items
  const calculateNonFoodStampSubtotal = () => {
    return cart
      .filter(item => !item.product.foodStampEligible)
      .reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const [promotionDiscount, setPromotionDiscount] = useState(0);

  // Calculate promotions when cart or promotions change
  useEffect(() => {
    if (cart.length === 0 || promotions.length === 0) {
      setAppliedPromotions([]);
      setPromotionDiscount(0);
      return;
    }

    let totalDiscount = 0;
    const appliedPromos = [];

    promotions.forEach(promotion => {
      let isEligible = false;
      let applicableAmount = 0;

      // Check if promotion applies to any items in cart
      cart.forEach(item => {
        let itemEligible = false;

        // If no specific products or categories are set, promotion applies to all
        if ((!promotion.eligibleProductIds || promotion.eligibleProductIds.length === 0) &&
            (!promotion.eligibleCategoryIds || promotion.eligibleCategoryIds.length === 0)) {
          itemEligible = true;
        } else {
          // Check if product is in eligible products
          if (promotion.eligibleProductIds && promotion.eligibleProductIds.includes(item.product.id)) {
            itemEligible = true;
          }
          // Check if product's category is in eligible categories
          if (promotion.eligibleCategoryIds && promotion.eligibleCategoryIds.includes(item.product.category?.id)) {
            itemEligible = true;
          }
        }

        if (itemEligible) {
          isEligible = true;
          applicableAmount += item.product.price * item.quantity;
        }
      });

      if (isEligible && applicableAmount > 0) {
        // Check minimum purchase amount
        const subtotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
        if (!promotion.minPurchaseAmount || subtotal >= promotion.minPurchaseAmount) {
          let discount = 0;
          if (promotion.promotionType === 'PERCENTAGE') {
            discount = applicableAmount * (promotion.discountValue / 100);
          } else {
            discount = Math.min(promotion.discountValue, applicableAmount);
          }
          
          totalDiscount += discount;
          appliedPromos.push({
            ...promotion,
            discount: discount,
            applicableAmount: applicableAmount
          });
        }
      }
    });

    setAppliedPromotions(appliedPromos);
    setPromotionDiscount(totalDiscount);
  }, [cart, promotions]);

  const getPaymentBreakdown = () => {
    const foodStampSubtotal = calculateFoodStampEligibleSubtotal();
    const nonFoodStampSubtotal = calculateNonFoodStampSubtotal();
    
    // Calculate tax for non-food stamp items
    const nonFoodStampTax = cart
      .filter(item => !item.product.foodStampEligible)
      .reduce((tax, item) => {
        const taxRate = item.product.category ? item.product.category.taxRate / 100 : 0;
        return tax + (item.product.price * item.quantity * taxRate);
      }, 0);
    
    // Calculate tax for food stamp items (only if not paying with EBT)
    const foodStampTax = selectedPaymentMethod === 'EBT' ? 0 : cart
      .filter(item => item.product.foodStampEligible)
      .reduce((tax, item) => {
        const taxRate = item.product.category ? item.product.category.taxRate / 100 : 0;
        return tax + (item.product.price * item.quantity * taxRate);
      }, 0);

    // Use calculated promotion discount
    const totalDiscounts = discountAmount + promotionDiscount;

    return {
      foodStampSubtotal,
      foodStampTax,
      foodStampTotal: foodStampSubtotal + foodStampTax,
      nonFoodStampSubtotal,
      nonFoodStampTax,
      nonFoodStampTotal: nonFoodStampSubtotal + nonFoodStampTax,
      totalTax: foodStampTax + nonFoodStampTax,
      promotionDiscount,
      totalDiscounts,
      grandTotal: foodStampSubtotal + foodStampTax + nonFoodStampSubtotal + nonFoodStampTax - totalDiscounts
    };
  };

  const calculateChange = () => {
    const paid = parseFloat(customerPaid) || 0;
    const breakdown = getPaymentBreakdown();
    return Math.max(0, paid - breakdown.grandTotal);
  };

  const handleCompleteTransaction = async () => {
    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }

    const breakdown = getPaymentBreakdown();
    const total = breakdown.grandTotal;
    const paid = parseFloat(customerPaid) || 0;

    // Validate food stamp payments
    if (selectedPaymentMethod === 'EBT') {
      if (breakdown.foodStampSubtotal === 0) {
        alert('No food stamp eligible items in cart. Please select a different payment method.');
        return;
      }
      
      if (breakdown.nonFoodStampSubtotal > 0) {
        alert(`This cart contains non-food stamp eligible items totaling $${breakdown.nonFoodStampTotal.toFixed(2)}. You need to pay for these items with another payment method. Please complete this transaction separately or choose a different payment method.`);
        return;
      }
    }

    // Validate cash payments
    if (selectedPaymentMethod === 'CASH' && paid < total) {
      alert('Insufficient payment amount');
      return;
    }

    try {
      const transactionItems = cart.map(item => ({
        quantity: item.quantity,
        unitPrice: item.product.price,
        totalPrice: item.product.price * item.quantity,
        discountAmount: 0,
        product: {
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          barcode: item.product.barcode,
          category: item.product.category || null
        }
      }));

      const subtotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
      const taxAmount = cart.reduce((tax, item) => {
        const taxRate = item.product.category ? item.product.category.taxRate / 100 : 0;
        return tax + (item.product.price * item.quantity * taxRate);
      }, 0);

      const transactionData = {
        paymentMethod: selectedPaymentMethod,
        totalAmount: total,
        items: transactionItems.map(item => ({
          product: { id: item.product.id },
          quantity: item.quantity,
          unitPrice: item.unitPrice
        }))
      };

      const response = await authService.getApiInstance().post('/pos/transactions', transactionData);
      
      // Clear cart and reset form
      setCart([]);
      setCustomerPaid('');
      setDiscountAmount(0);
      setAppliedPromotions([]);
      setSelectedPaymentMethod('CASH');
      
      alert('Transaction completed successfully!');
      
      // Refresh transactions if we're on the history tab
      if (activeTab === 'history') {
        fetchTransactions();
      }
    } catch (error) {
      console.error('Error completing transaction:', error);
      alert('Error completing transaction');
    }
  };

  const handleVoidTransaction = async (transactionId) => {
    try {
      await authService.getApiInstance().patch(`/pos/transactions/${transactionId}/void`);
      alert('Transaction voided successfully');
      fetchTransactions();
    } catch (error) {
      console.error('Error voiding transaction:', error);
      alert('Error voiding transaction');
    }
  };

  const createSampleTransactions = async () => {
    try {
      // Create a few sample transactions for testing
      const sampleTransactions = [
        {
          paymentMethod: 'CREDIT_CARD',
          items: [
            { productId: 1, quantity: 1 }, // Coca Cola
            { productId: 6, quantity: 1 }  // Lay's Chips
          ]
        },
        {
          paymentMethod: 'EBT',
          items: [
            { productId: 12, quantity: 1 }, // Bread
            { productId: 13, quantity: 1 }  // Milk
          ]
        },
        {
          paymentMethod: 'CASH',
          customerPaid: 15.00,
          items: [
            { productId: 10, quantity: 1 }, // Marlboro
          ]
        }
      ];

      for (const transactionData of sampleTransactions) {
        await authService.getApiInstance().post('/pos/transactions', transactionData);
      }
      
      alert('Sample transactions created successfully!');
      fetchTransactions();
    } catch (error) {
      console.error('Error creating sample transactions:', error);
      alert('Error creating sample transactions. You can create them manually using the POS interface.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatTransactionStatus = (status) => {
    const statusMap = {
      'COMPLETED': { label: 'Completed', color: 'bg-green-100 text-green-800' },
      'PENDING': { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
      'VOIDED': { label: 'Voided', color: 'bg-red-100 text-red-800' }
    };
    return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Point of Sale</h1>
      </div>

      {/* Tabs */}
      <div className="mb-4">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('new')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'new'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            New Transaction
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'history'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Transaction History
          </button>
        </nav>
      </div>

      {activeTab === 'new' ? (
        <div className="grid grid-cols-2 gap-6">
          {/* Product Search and Cart */}
          <div className="space-y-4">
            {/* Barcode Search */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold mb-2">Barcode Scanner</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={barcodeSearch}
                  onChange={(e) => setBarcodeSearch(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleBarcodeSearch()}
                  placeholder="Scan or enter barcode"
                  className="flex-1 border rounded px-3 py-2"
                />
                <button
                  onClick={handleBarcodeSearch}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Product Search */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold mb-2">Product Search</h3>
              <input
                type="text"
                onChange={(e) => handleProductSearch(e.target.value)}
                placeholder="Search products by name..."
                className="w-full border rounded px-3 py-2 mb-2"
              />
              {searchResults.length > 0 && (
                <div className="max-h-48 overflow-y-auto border rounded">
                  {searchResults.map(product => (
                    <div
                      key={product.id}
                      onClick={() => addToCart(product)}
                      className="p-2 hover:bg-gray-100 cursor-pointer border-b"
                    >
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-500">
                        {product.barcode} • ${product.price.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold mb-2">Cart</h3>
              {cart.length === 0 ? (
                <p className="text-gray-500">Cart is empty</p>
              ) : (
                <div className="space-y-2">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex items-center justify-between border-b pb-2">
                      <div className="flex-1">
                        <div className="font-medium">{item.product.name}</div>
                        <div className="text-sm text-gray-500">
                          ${item.product.price.toFixed(2)} each
                          {item.product.foodStampEligible && (
                            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Food Stamp Eligible
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateCartItemQuantity(item.product.id, item.quantity - 1)}
                          className="bg-gray-200 text-gray-600 w-6 h-6 rounded text-sm"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateCartItemQuantity(item.product.id, item.quantity + 1)}
                          className="bg-gray-200 text-gray-600 w-6 h-6 rounded text-sm"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="bg-red-500 text-white w-6 h-6 rounded text-sm ml-2"
                        >
                          ×
                        </button>
                      </div>
                      <div className="text-right w-20">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Transaction Summary and Payment */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold mb-4">Transaction Summary</h3>
              
              {(() => {
                const breakdown = getPaymentBreakdown();
                const hasFood = breakdown.foodStampSubtotal > 0;
                const hasNonFood = breakdown.nonFoodStampSubtotal > 0;
                
                return (
                  <div className="space-y-2 text-sm">
                    {selectedPaymentMethod === 'EBT' && hasFood && hasNonFood ? (
                      // Show breakdown when using EBT and have mixed items
                      <>
                        <div className="text-sm font-medium text-blue-600 mb-2">Food Stamp Eligible Items:</div>
                        <div className="flex justify-between pl-4">
                          <span>Subtotal:</span>
                          <span>${breakdown.foodStampSubtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between pl-4">
                          <span>Tax:</span>
                          <span>${breakdown.foodStampTax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between pl-4 font-medium">
                          <span>Food Stamp Total:</span>
                          <span>${breakdown.foodStampTotal.toFixed(2)}</span>
                        </div>
                        
                        <div className="text-sm font-medium text-green-600 mb-2 mt-3">Other Payment Required:</div>
                        <div className="flex justify-between pl-4">
                          <span>Subtotal:</span>
                          <span>${breakdown.nonFoodStampSubtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between pl-4">
                          <span>Tax:</span>
                          <span>${breakdown.nonFoodStampTax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between pl-4 font-medium">
                          <span>Other Payment Total:</span>
                          <span>${breakdown.nonFoodStampTotal.toFixed(2)}</span>
                        </div>
                        
                        {discountAmount > 0 && (
                          <div className="flex justify-between">
                            <span>Discount:</span>
                            <span>-${discountAmount.toFixed(2)}</span>
                          </div>
                        )}
                        <hr />
                        <div className="flex justify-between font-bold text-lg">
                          <span>Grand Total:</span>
                          <span>${breakdown.grandTotal.toFixed(2)}</span>
                        </div>
                        
                        <div className="mt-2 p-2 bg-yellow-50 border-l-4 border-yellow-400">
                          <p className="text-xs text-yellow-700">
                            <strong>Note:</strong> Food stamp eligible items (${breakdown.foodStampTotal.toFixed(2)}) can be paid with EBT. 
                            Remaining ${breakdown.nonFoodStampTotal.toFixed(2)} requires another payment method.
                          </p>
                        </div>
                      </>
                    ) : (
                      // Standard breakdown for other payment methods
                      <>
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>${calculateSubtotal().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax:</span>
                          <span>${breakdown.totalTax.toFixed(2)}</span>
                        </div>
                        {discountAmount > 0 && (
                          <div className="flex justify-between">
                            <span>Discount:</span>
                            <span>-${discountAmount.toFixed(2)}</span>
                          </div>
                        )}
                        <hr />
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total:</span>
                          <span>${breakdown.grandTotal.toFixed(2)}</span>
                        </div>
                        
                        {selectedPaymentMethod === 'EBT' && hasFood && !hasNonFood && (
                          <div className="mt-2 p-2 bg-green-50 border-l-4 border-green-400">
                            <p className="text-xs text-green-700">
                              <strong>EBT:</strong> All items are food stamp eligible. No tax applied.
                            </p>
                          </div>
                        )}
                        
                        {selectedPaymentMethod === 'EBT' && !hasFood && (
                          <div className="mt-2 p-2 bg-red-50 border-l-4 border-red-400">
                            <p className="text-xs text-red-700">
                              <strong>Warning:</strong> No food stamp eligible items in cart. Please select a different payment method.
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })()}

              <div className="mt-4 space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Discount Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                    className="w-full border rounded px-3 py-2"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Payment Method</label>
                  <select
                    value={selectedPaymentMethod}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  >
                    {paymentMethods.map(method => (
                      <option key={method.value} value={method.value}>
                        {method.label}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedPaymentMethod === 'CASH' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">Amount Paid</label>
                      <input
                        type="number"
                        step="0.01"
                        value={customerPaid}
                        onChange={(e) => setCustomerPaid(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        placeholder="0.00"
                      />
                    </div>
                    {customerPaid && (
                      <div className="text-lg font-semibold">
                        Change: ${calculateChange().toFixed(2)}
                      </div>
                    )}
                  </>
                )}

                <button
                  onClick={handleCompleteTransaction}
                  disabled={cart.length === 0}
                  className="w-full bg-green-500 text-white py-3 rounded font-semibold hover:bg-green-600 disabled:bg-gray-300"
                >
                  Complete Transaction
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Transaction History */
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          {/* Header with Create Sample Transactions button */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Transaction History</h3>
            {transactions.length === 0 && (
              <button
                onClick={createSampleTransactions}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
              >
                Create Sample Transactions
              </button>
            )}
          </div>

          {transactions.length === 0 ? (
            /* Empty State */
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM13 8.5a.5.5 0 11-1 0 .5.5 0 011 0zM9 15.5a.5.5 0 11-1 0 .5.5 0 011 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first transaction using the "New Sale" tab above.
              </p>
              <div className="mt-4 space-y-2">
                <button
                  onClick={() => setActiveTab('new')}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
                >
                  Start New Sale
                </button>
                <button
                  onClick={createSampleTransactions}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Create Sample Transactions
                </button>
              </div>
            </div>
          ) : (
            /* Transaction Table */
            <table className="min-w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date/Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cashier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => {
                  const status = formatTransactionStatus(transaction.status);
                  return (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{transaction.transactionNumber || transaction.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.transactionDate ? formatDate(transaction.transactionDate) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.cashier?.username || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {paymentMethods.find(pm => pm.value === transaction.paymentMethod)?.label || transaction.paymentMethod}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                        ${transaction.totalAmount?.toFixed(2) || transaction.total?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {transaction.status === 'COMPLETED' && (
                          <>
                            <button
                              onClick={() => handleVoidTransaction(transaction.id)}
                              className="text-red-600 hover:text-red-900 mr-2"
                            >
                              Void
                            </button>
                            <button
                              onClick={() => fetchTransactionDetails(transaction.id)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View Details
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Transaction Details Modal */}
      {showTransactionDetails && selectedTransaction && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              {/* Header */}
              <div className="flex justify-between items-center pb-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Transaction Details</h3>
                <button
                  onClick={() => setShowTransactionDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Bill Content */}
              <div className="mt-4 p-6 bg-white border border-gray-200 rounded-lg" style={{fontFamily: 'monospace'}}>
                {/* Store Header */}
                <div className="text-center mb-4">
                  <h2 className="text-xl font-bold">GAS STATION MART</h2>
                  <p className="text-sm">123 Main Street</p>
                  <p className="text-sm">Your City, ST 12345</p>
                  <p className="text-sm">Phone: (555) 123-4567</p>
                </div>

                <div className="border-t border-b border-gray-300 py-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Transaction #: {selectedTransaction.transactionNumber || selectedTransaction.id}</span>
                    <span>{formatDate(selectedTransaction.transactionDate || selectedTransaction.createdAt)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Cashier: {selectedTransaction.cashier?.username || 'Unknown'}</span>
                    <span>Payment: {paymentMethods.find(pm => pm.value === selectedTransaction.paymentMethod)?.label || selectedTransaction.paymentMethod}</span>
                  </div>
                </div>

                {/* Items */}
                <div className="mb-4">
                  <div className="text-sm font-semibold mb-2">ITEMS PURCHASED:</div>
                  {selectedTransaction.items && selectedTransaction.items.length > 0 ? (
                    selectedTransaction.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm mb-1">
                        <span className="flex-1">
                          {item.product?.name || 'Unknown Product'} 
                          <span className="text-gray-600 ml-2">
                            ({item.quantity} @ ${item.unitPrice?.toFixed(2) || '0.00'})
                          </span>
                        </span>
                        <span className="font-medium">${item.totalPrice?.toFixed(2) || (item.quantity * item.unitPrice).toFixed(2) || '0.00'}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500">
                      <p>No detailed items available for this transaction.</p>
                      <p className="mt-1">This may be a system-generated sample transaction.</p>
                    </div>
                  )}
                </div>

                {/* Totals */}
                <div className="border-t border-gray-300 pt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Subtotal:</span>
                    <span>${selectedTransaction.subtotal?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Tax:</span>
                    <span>${selectedTransaction.taxAmount?.toFixed(2) || '0.00'}</span>
                  </div>
                  {(selectedTransaction.discountAmount > 0) && (
                    <div className="flex justify-between text-sm mb-1">
                      <span>Discount:</span>
                      <span>-${selectedTransaction.discountAmount?.toFixed(2) || '0.00'}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-2">
                    <span>TOTAL:</span>
                    <span>${selectedTransaction.totalAmount?.toFixed(2) || selectedTransaction.total?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-4 pt-4 border-t border-gray-300 text-sm">
                  <p>Thank you for your business!</p>
                  <p>Please come again!</p>
                  <div className="mt-2">
                    <span className={`px-2 py-1 rounded text-xs ${formatTransactionStatus(selectedTransaction.status).color}`}>
                      Status: {formatTransactionStatus(selectedTransaction.status).label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => window.print()}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Print Receipt
                </button>
                <button
                  onClick={() => setShowTransactionDetails(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POS; 