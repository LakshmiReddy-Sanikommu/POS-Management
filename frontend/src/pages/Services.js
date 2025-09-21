import React, { useState, useEffect } from 'react';
import authService from '../services/authService';

const Services = () => {
  const [serviceLogs, setServiceLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    serviceType: 'BILL_PAY',
    amount: '',
    customerReference: '',
    notes: ''
  });

  const serviceTypes = [
    { value: 'BILL_PAY', label: 'Bill Payment' },
    { value: 'CHECK_CASHING', label: 'Check Cashing' },
    { value: 'MONEY_ORDER', label: 'Money Order' },
    { value: 'PHONE_CARD', label: 'Phone Card' },
    { value: 'GIFT_CARD_SALE', label: 'Gift Card Sale' },
    { value: 'ATM_FEE', label: 'ATM Fee' },
    { value: 'OTHER', label: 'Other Service' }
  ];

  useEffect(() => {
    fetchServiceLogs();
  }, []);

  const fetchServiceLogs = async () => {
    try {
      const response = await authService.getApiInstance().get('/services');
      setServiceLogs(response.data);
    } catch (error) {
      console.error('Error fetching service logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentUser = authService.getCurrentUser();
      const payload = {
        serviceType: formData.serviceType,
        amount: parseFloat(formData.amount),
        customerReference: formData.customerReference || null,
        notes: formData.notes || null,
        handledBy: { id: currentUser.id }
      };

      if (editingService) {
        await authService.getApiInstance().put(`/services/${editingService.id}`, payload);
      } else {
        await authService.getApiInstance().post('/services', payload);
      }

      setShowModal(false);
      setEditingService(null);
      resetForm();
      fetchServiceLogs();
    } catch (error) {
      console.error('Error saving service log:', error);
      alert('Error saving service log. Please check all fields.');
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      serviceType: service.serviceType,
      amount: service.amount.toString(),
      customerReference: service.customerReference || '',
      notes: service.notes || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service log?')) {
      try {
        await authService.getApiInstance().delete(`/services/${id}`);
        fetchServiceLogs();
      } catch (error) {
        console.error('Error deleting service log:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      serviceType: 'BILL_PAY',
      amount: '',
      customerReference: '',
      notes: ''
    });
  };

  const openAddModal = () => {
    setEditingService(null);
    resetForm();
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  const getTotalRevenue = () => {
    return serviceLogs.reduce((total, service) => total + parseFloat(service.amount || 0), 0);
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
        <h1 className="text-2xl font-bold text-gray-900">Service Logging</h1>
        <div className="flex gap-4">
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg">
            <span className="text-sm font-medium">Total Revenue: ${getTotalRevenue().toFixed(2)}</span>
          </div>
          <button
            onClick={openAddModal}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Log Service
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer Reference
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date/Time
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
            {serviceLogs.map((service) => (
              <tr key={service.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {serviceTypes.find(type => type.value === service.serviceType)?.label || service.serviceType}
                  </div>
                  {service.notes && (
                    <div className="text-sm text-gray-500">{service.notes}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                  ${service.amount?.toFixed(2) || '0.00'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {service.customerReference || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {service.serviceDate ? formatDate(service.serviceDate) : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {service.handledBy?.username || 'Unknown'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(service)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
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
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingService ? 'Edit Service Log' : 'Log Service'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Service Type *
                </label>
                <select
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  {serviceTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Amount *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Customer Reference
                </label>
                <input
                  type="text"
                  value={formData.customerReference}
                  onChange={(e) => setFormData({ ...formData, customerReference: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Customer name, phone, or reference"
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
                  {editingService ? 'Update' : 'Log Service'}
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

export default Services; 