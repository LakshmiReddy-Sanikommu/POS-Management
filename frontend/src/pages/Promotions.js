import React, { useState, useEffect } from 'react';
import authService from '../services/authService';

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    promotionType: 'PERCENTAGE',
    discountValue: '',
    startDate: '',
    endDate: '',
    minPurchaseAmount: '',
    active: true,
    eligibleProducts: [],
    eligibleCategories: []
  });

  const promotionTypes = [
    { value: 'PERCENTAGE', label: 'Percentage Discount' },
    { value: 'FIXED_AMOUNT', label: 'Fixed Amount Discount' },
    { value: 'BUY_ONE_GET_ONE', label: 'Buy One Get One' }
  ];

  useEffect(() => {
    fetchPromotions();
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchPromotions = async () => {
    try {
      const response = await authService.getApiInstance().get('/promotions');
      setPromotions(response.data);
    } catch (error) {
      console.error('Error fetching promotions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await authService.getApiInstance().get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await authService.getApiInstance().get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        description: formData.description || null,
        promotionType: formData.promotionType,
        discountValue: parseFloat(formData.discountValue),
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        minPurchaseAmount: formData.minPurchaseAmount ? parseFloat(formData.minPurchaseAmount) : null,
        active: formData.active,
        eligibleProducts: formData.eligibleProducts.map(id => ({ id: parseInt(id) })),
        eligibleCategories: formData.eligibleCategories.map(id => ({ id: parseInt(id) }))
      };

      if (editingPromotion) {
        await authService.getApiInstance().put(`/promotions/${editingPromotion.id}`, payload);
      } else {
        await authService.getApiInstance().post('/promotions', payload);
      }

      setShowModal(false);
      setEditingPromotion(null);
      resetForm();
      fetchPromotions();
    } catch (error) {
      console.error('Error saving promotion:', error);
      alert('Error saving promotion. Please check all fields.');
    }
  };

  const handleEdit = (promotion) => {
    setEditingPromotion(promotion);
    setFormData({
      name: promotion.name,
      description: promotion.description || '',
      promotionType: promotion.promotionType,
      discountValue: promotion.discountValue.toString(),
      startDate: new Date(promotion.startDate).toISOString().slice(0, 16),
      endDate: new Date(promotion.endDate).toISOString().slice(0, 16),
      minPurchaseAmount: promotion.minPurchaseAmount ? promotion.minPurchaseAmount.toString() : '',
      active: promotion.active,
      eligibleProducts: promotion.eligibleProducts ? promotion.eligibleProducts.map(p => p.id.toString()) : [],
      eligibleCategories: promotion.eligibleCategories ? promotion.eligibleCategories.map(c => c.id.toString()) : []
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this promotion?')) {
      try {
        await authService.getApiInstance().delete(`/promotions/${id}`);
        fetchPromotions();
      } catch (error) {
        console.error('Error deleting promotion:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      promotionType: 'PERCENTAGE',
      discountValue: '',
      startDate: '',
      endDate: '',
      minPurchaseAmount: '',
      active: true,
      eligibleProducts: [],
      eligibleCategories: []
    });
  };

  const openAddModal = () => {
    setEditingPromotion(null);
    resetForm();
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  const isPromotionActive = (promotion) => {
    const now = new Date();
    const start = new Date(promotion.startDate);
    const end = new Date(promotion.endDate);
    return promotion.active && now >= start && now <= end;
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
        <h1 className="text-2xl font-bold text-gray-900">Promotion Management</h1>
        <button
          onClick={openAddModal}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Promotion
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Discount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
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
            {promotions.map((promotion) => (
              <tr key={promotion.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{promotion.name}</div>
                  <div className="text-sm text-gray-500">{promotion.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {promotionTypes.find(type => type.value === promotion.promotionType)?.label || promotion.promotionType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {promotion.promotionType === 'PERCENTAGE' ? `${promotion.discountValue}%` : `$${promotion.discountValue.toFixed(2)}`}
                  {promotion.minPurchaseAmount && (
                    <div className="text-xs text-gray-400">Min: ${promotion.minPurchaseAmount.toFixed(2)}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>{formatDate(promotion.startDate)}</div>
                  <div className="text-xs text-gray-400">to {formatDate(promotion.endDate)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    isPromotionActive(promotion) ? 'bg-green-100 text-green-800' : 
                    promotion.active ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {isPromotionActive(promotion) ? 'Active' : promotion.active ? 'Scheduled' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(promotion)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(promotion.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingPromotion ? 'Edit Promotion' : 'Add Promotion'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4 col-span-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4 col-span-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    rows="3"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Promotion Type *
                  </label>
                  <select
                    value={formData.promotionType}
                    onChange={(e) => setFormData({ ...formData, promotionType: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  >
                    {promotionTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder={formData.promotionType === 'PERCENTAGE' ? 'Enter percentage (e.g., 10)' : 'Enter amount (e.g., 5.00)'}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Start Date *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    End Date *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Minimum Purchase Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.minPurchaseAmount}
                    onChange={(e) => setFormData({ ...formData, minPurchaseAmount: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Optional minimum purchase"
                  />
                </div>
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-gray-700 text-sm font-bold">Active</span>
                  </label>
                </div>
                
                {/* Eligible Products */}
                <div className="mb-4 col-span-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Eligible Products (Optional)
                  </label>
                  <div className="max-h-32 overflow-y-auto border rounded p-2">
                    {products.map((product) => (
                      <label key={product.id} className="flex items-center mb-1">
                        <input
                          type="checkbox"
                          checked={formData.eligibleProducts.includes(product.id.toString())}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                eligibleProducts: [...formData.eligibleProducts, product.id.toString()]
                              });
                            } else {
                              setFormData({
                                ...formData,
                                eligibleProducts: formData.eligibleProducts.filter(id => id !== product.id.toString())
                              });
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">{product.name}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Select specific products this promotion applies to. If none selected, promotion applies to all products.
                  </p>
                </div>

                {/* Eligible Categories */}
                <div className="mb-4 col-span-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Eligible Categories (Optional)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <label key={category.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.eligibleCategories.includes(category.id.toString())}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                eligibleCategories: [...formData.eligibleCategories, category.id.toString()]
                              });
                            } else {
                              setFormData({
                                ...formData,
                                eligibleCategories: formData.eligibleCategories.filter(id => id !== category.id.toString())
                              });
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded">{category.name}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Select categories this promotion applies to. If none selected, promotion applies to all categories.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  {editingPromotion ? 'Update' : 'Create'}
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

export default Promotions; 