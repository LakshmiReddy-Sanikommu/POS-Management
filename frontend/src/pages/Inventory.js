import React, { useState, useEffect } from 'react';
import authService from '../services/authService';

const Inventory = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [formData, setFormData] = useState({
    productId: '',
    transactionType: 'RECEIVE',
    quantity: '',
    notes: ''
  });

  const transactionTypes = [
    { value: 'RECEIVE', label: 'Receive Inventory' },
    { value: 'ADJUSTMENT', label: 'Adjustment' },
    { value: 'AUDIT', label: 'Manual Audit' },
    { value: 'DAMAGE', label: 'Damage/Loss' },
    { value: 'SALE', label: 'Sale' }
  ];

  useEffect(() => {
    if (activeTab === 'transactions') {
      fetchTransactions();
    } else {
      fetchProducts();
    }
  }, [activeTab]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await authService.getApiInstance().get('/inventory/transactions');
      // Sort transactions by creation date, newest first
      const sortedTransactions = response.data.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setTransactions(sortedTransactions);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentUser = authService.getCurrentUser();
      const payload = {
        product: { id: parseInt(formData.productId) },
        transactionType: formData.transactionType,
        quantity: parseInt(formData.quantity),
        notes: formData.notes || null,
        user: { id: currentUser.id }
      };

      if (editingTransaction) {
        await authService.getApiInstance().put(`/inventory/transactions/${editingTransaction.id}`, payload);
      } else {
        await authService.getApiInstance().post('/inventory/transactions', payload);
      }

      setShowModal(false);
      setEditingTransaction(null);
      resetForm();
      fetchTransactions();
    } catch (error) {
      console.error('Error saving transaction:', error);
      alert('Error saving transaction. Please check all fields.');
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      productId: transaction.product?.id?.toString() || '',
      transactionType: transaction.transactionType,
      quantity: transaction.quantity?.toString() || '',
      notes: transaction.notes || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await authService.getApiInstance().delete(`/inventory/transactions/${id}`);
        fetchTransactions();
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      productId: '',
      transactionType: 'RECEIVE',
      quantity: '',
      notes: ''
    });
  };

  const openAddModal = () => {
    setEditingTransaction(null);
    resetForm();
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getTransactionTypeColor = (type) => {
    const colors = {
      'RECEIVE': 'bg-green-100 text-green-800',
      'ADJUSTMENT': 'bg-blue-100 text-blue-800',
      'AUDIT': 'bg-purple-100 text-purple-800',
      'DAMAGE': 'bg-red-100 text-red-800',
      'SALE': 'bg-yellow-100 text-yellow-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getLowStockProducts = () => {
    return products.filter(product => product.currentStock <= product.reorderThreshold);
  };

  const getOutOfStockProducts = () => {
    return products.filter(product => product.currentStock === 0);
  };

  const getTotalInventoryValue = () => {
    return products.reduce((total, product) => total + (product.currentStock * product.cost), 0);
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
        <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
        <button
          onClick={openAddModal}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Transaction
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-900">Total Products</h3>
          <p className="text-2xl font-bold text-blue-600">{products.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-900">Low Stock Items</h3>
          <p className="text-2xl font-bold text-orange-600">{getLowStockProducts().length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-900">Out of Stock</h3>
          <p className="text-2xl font-bold text-red-600">{getOutOfStockProducts().length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-900">Inventory Value</h3>
          <p className="text-2xl font-bold text-green-600">${getTotalInventoryValue().toFixed(2)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Current Stock
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'alerts'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Stock Alerts
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'transactions'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Transaction History
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        {activeTab === 'overview' ? (
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reorder Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost per Unit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => {
                const isLowStock = product.currentStock <= product.reorderThreshold;
                const isOutOfStock = product.currentStock === 0;
                return (
                  <tr key={product.id} className={isOutOfStock ? 'bg-red-50' : isLowStock ? 'bg-yellow-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.barcode}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                      {product.currentStock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.reorderThreshold}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${product.cost?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                      ${(product.currentStock * (product.cost || 0)).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isOutOfStock ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Out of Stock
                        </span>
                      ) : isLowStock ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Low Stock
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          In Stock
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : activeTab === 'alerts' ? (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Alerts</h3>
            <div className="space-y-4">
              {getOutOfStockProducts().length > 0 && (
                <div>
                  <h4 className="text-md font-medium text-red-900 mb-2">Out of Stock ({getOutOfStockProducts().length})</h4>
                  <div className="grid gap-2">
                    {getOutOfStockProducts().map(product => (
                      <div key={product.id} className="bg-red-50 border border-red-200 rounded p-3">
                        <div className="font-medium text-red-900">{product.name}</div>
                        <div className="text-sm text-red-700">Stock: {product.currentStock} | Reorder at: {product.reorderThreshold}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {getLowStockProducts().filter(p => p.currentStock > 0).length > 0 && (
                <div>
                  <h4 className="text-md font-medium text-orange-900 mb-2">Low Stock ({getLowStockProducts().filter(p => p.currentStock > 0).length})</h4>
                  <div className="grid gap-2">
                    {getLowStockProducts().filter(p => p.currentStock > 0).map(product => (
                      <div key={product.id} className="bg-orange-50 border border-orange-200 rounded p-3">
                        <div className="font-medium text-orange-900">{product.name}</div>
                        <div className="text-sm text-orange-700">Stock: {product.currentStock} | Reorder at: {product.reorderThreshold}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {getOutOfStockProducts().length === 0 && getLowStockProducts().length === 0 && (
                <div className="text-center py-8">
                  <div className="text-green-600 text-lg font-medium">All products are well stocked!</div>
                  <div className="text-gray-500 text-sm mt-1">No stock alerts at this time.</div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Handled By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {transaction.product?.name || 'Unknown Product'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {transaction.product?.barcode || 'N/A'}
                    </div>
                    {transaction.notes && (
                      <div className="text-sm text-gray-500 italic">{transaction.notes}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTransactionTypeColor(transaction.transactionType)}`}>
                      {transactionTypes.find(type => type.value === transaction.transactionType)?.label || transaction.transactionType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.quantity}
                  </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                      N/A
                    </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.transactionDate ? formatDate(transaction.transactionDate) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.user?.username || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(transaction)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingTransaction ? 'Edit Transaction' : 'Add Inventory Transaction'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Product *
                </label>
                <select
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="">Select a product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - {product.barcode}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Transaction Type *
                </label>
                <select
                  value={formData.transactionType}
                  onChange={(e) => setFormData({ ...formData, transactionType: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  {transactionTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows="3"
                  placeholder="Additional notes or details"
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  {editingTransaction ? 'Update' : 'Add Transaction'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory; 