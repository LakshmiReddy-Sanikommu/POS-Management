import React, { useState, useEffect } from 'react';
import authService from '../services/authService';

const Fuel = () => {
  const [activeTab, setActiveTab] = useState('deliveries');
  const [deliveries, setDeliveries] = useState([]);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [modalType, setModalType] = useState('delivery'); // 'delivery' or 'price'
  const [formData, setFormData] = useState({
    // Delivery fields
    fuelType: 'REGULAR_87',
    gallons: '',
    supplierName: '',
    deliveryTicketNumber: '',
    costPerGallon: '',
    // Price fields
    pricePerGallon: ''
  });

  const fuelTypes = [
    { value: 'REGULAR_87', label: 'Regular (87)' },
    { value: 'MIDGRADE_89', label: 'Mid-Grade (89)' },
    { value: 'PREMIUM_91', label: 'Premium (91)' },
    { value: 'PREMIUM_93', label: 'Premium (93)' },
    { value: 'DIESEL', label: 'Diesel' },
    { value: 'E85', label: 'E85' }
  ];

  useEffect(() => {
    if (activeTab === 'deliveries') {
      fetchDeliveries();
    } else {
      fetchPrices();
    }
  }, [activeTab]);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const response = await authService.getApiInstance().get('/fuel/deliveries');
      setDeliveries(response.data);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrices = async () => {
    try {
      setLoading(true);
      const response = await authService.getApiInstance().get('/fuel/prices');
      setPrices(response.data);
    } catch (error) {
      console.error('Error fetching prices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentUser = authService.getCurrentUser();
      
      if (modalType === 'delivery') {
        const payload = {
          fuelType: formData.fuelType,
          gallons: parseFloat(formData.gallons),
          supplierName: formData.supplierName,
          deliveryTicketNumber: formData.deliveryTicketNumber,
          costPerGallon: parseFloat(formData.costPerGallon),
          receivedBy: { id: currentUser.id }
        };

        if (editingItem) {
          await authService.getApiInstance().put(`/fuel/deliveries/${editingItem.id}`, payload);
        } else {
          await authService.getApiInstance().post('/fuel/deliveries', payload);
        }
        fetchDeliveries();
      } else {
        const payload = {
          fuelType: formData.fuelType,
          pricePerGallon: parseFloat(formData.pricePerGallon),
          updatedBy: { id: currentUser.id }
        };

        if (editingItem) {
          await authService.getApiInstance().put(`/fuel/prices/${editingItem.id}`, payload);
        } else {
          await authService.getApiInstance().post('/fuel/prices', payload);
        }
        fetchPrices();
      }

      setShowModal(false);
      setEditingItem(null);
      resetForm();
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error saving. Please check all fields.');
    }
  };

  const handleEdit = (item, type) => {
    setEditingItem(item);
    setModalType(type);
    if (type === 'delivery') {
      setFormData({
        fuelType: item.fuelType,
        gallons: item.gallons?.toString() || '',
        supplierName: item.supplierName || '',
        deliveryTicketNumber: item.deliveryTicketNumber || '',
        costPerGallon: item.costPerGallon?.toString() || '',
        pricePerGallon: ''
      });
    } else {
      setFormData({
        fuelType: item.fuelType,
        pricePerGallon: item.pricePerGallon?.toString() || '',
        gallons: '',
        supplierName: '',
        deliveryTicketNumber: '',
        costPerGallon: ''
      });
    }
    setShowModal(true);
  };

  const handleDelete = async (id, type) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        if (type === 'delivery') {
          await authService.getApiInstance().delete(`/fuel/deliveries/${id}`);
          fetchDeliveries();
        } else {
          await authService.getApiInstance().delete(`/fuel/prices/${id}`);
          fetchPrices();
        }
      } catch (error) {
        console.error('Error deleting:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      fuelType: 'REGULAR_87',
      gallons: '',
      supplierName: '',
      deliveryTicketNumber: '',
      costPerGallon: '',
      pricePerGallon: ''
    });
  };

  const openAddModal = (type) => {
    setEditingItem(null);
    setModalType(type);
    resetForm();
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getCurrentPrices = () => {
    const current = {};
    fuelTypes.forEach(type => {
      const latestPrice = prices
        .filter(p => p.fuelType === type.value)
        .sort((a, b) => new Date(b.effectiveDate) - new Date(a.effectiveDate))[0];
      if (latestPrice) {
        current[type.value] = latestPrice.pricePerGallon;
      }
    });
    return current;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  const currentPrices = getCurrentPrices();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Fuel Management</h1>
        <div className="flex gap-2">
          <button
            onClick={() => openAddModal('delivery')}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Delivery
          </button>
          <button
            onClick={() => openAddModal('price')}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Update Price
          </button>
        </div>
      </div>

      {/* Current Prices Display */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {fuelTypes.map((type) => (
          <div key={type.value} className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold text-gray-900">{type.label}</h3>
            <p className="text-2xl font-bold text-green-600">
              ${currentPrices[type.value]?.toFixed(2) || 'N/A'}
            </p>
            <p className="text-sm text-gray-500">per gallon</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mb-4">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('deliveries')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'deliveries'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Fuel Deliveries
          </button>
          <button
            onClick={() => setActiveTab('prices')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'prices'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Price History
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        {activeTab === 'deliveries' ? (
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fuel Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost/Gallon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {deliveries.map((delivery) => (
                <tr key={delivery.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {fuelTypes.find(type => type.value === delivery.fuelType)?.label || delivery.fuelType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {delivery.gallons?.toFixed(1) || 0} gal
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {delivery.supplierName || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {delivery.deliveryTicketNumber || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${delivery.costPerGallon?.toFixed(3) || '0.000'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                    ${((delivery.gallons || 0) * (delivery.costPerGallon || 0)).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {delivery.deliveryDate ? formatDate(delivery.deliveryDate) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(delivery, 'delivery')}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(delivery.id, 'delivery')}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fuel Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price per Gallon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Effective Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {prices.map((price) => (
                <tr key={price.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {fuelTypes.find(type => type.value === price.fuelType)?.label || price.fuelType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                    ${price.pricePerGallon?.toFixed(3) || '0.000'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {price.effectiveDate ? formatDate(price.effectiveDate) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(price, 'price')}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(price.id, 'price')}
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
              {editingItem 
                ? `Edit ${modalType === 'delivery' ? 'Delivery' : 'Price'}` 
                : `Add ${modalType === 'delivery' ? 'Delivery' : 'Price'}`}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Fuel Type *
                </label>
                <select
                  value={formData.fuelType}
                  onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  {fuelTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {modalType === 'delivery' ? (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Quantity Delivered (gallons) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.gallons}
                      onChange={(e) => setFormData({ ...formData, gallons: e.target.value })}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Supplier *
                    </label>
                    <input
                      type="text"
                      value={formData.supplierName}
                      onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Invoice Number *
                    </label>
                    <input
                      type="text"
                      value={formData.deliveryTicketNumber}
                      onChange={(e) => setFormData({ ...formData, deliveryTicketNumber: e.target.value })}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Cost per Gallon *
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      value={formData.costPerGallon}
                      onChange={(e) => setFormData({ ...formData, costPerGallon: e.target.value })}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                </>
              ) : (
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Price per Gallon *
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={formData.pricePerGallon}
                    onChange={(e) => setFormData({ ...formData, pricePerGallon: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  {editingItem ? 'Update' : 'Save'}
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

export default Fuel; 