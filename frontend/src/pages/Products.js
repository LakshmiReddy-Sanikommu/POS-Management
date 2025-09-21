import React, { useState, useEffect } from 'react';
import authService from '../services/authService';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [formData, setFormData] = useState({
    name: '',
    barcode: '',
    price: '',
    cost: '',
    currentStock: '',
    reorderThreshold: '',
    categoryId: '',
    description: '',
    active: true,
    foodStampEligible: false
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await authService.getApiInstance().get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
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
      const selectedCategory = categories.find(cat => cat.id.toString() === formData.categoryId);
      const payload = {
        name: formData.name,
        barcode: formData.barcode || null,
        price: parseFloat(formData.price),
        cost: parseFloat(formData.cost),
        currentStock: parseInt(formData.currentStock),
        reorderThreshold: parseInt(formData.reorderThreshold),
        category: selectedCategory,
        description: formData.description || null,
        active: formData.active,
        foodStampEligible: formData.foodStampEligible
      };

      if (editingProduct) {
        await authService.getApiInstance().put(`/products/${editingProduct.id}`, payload);
      } else {
        await authService.getApiInstance().post('/products', payload);
      }

      setShowModal(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Please check all fields.');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      barcode: product.barcode || '',
      price: product.price.toString(),
      cost: product.cost.toString(),
      currentStock: product.currentStock.toString(),
      reorderThreshold: product.reorderThreshold.toString(),
      categoryId: product.category ? product.category.id.toString() : '',
      description: product.description || '',
      active: product.active,
      foodStampEligible: product.foodStampEligible || false
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await authService.getApiInstance().delete(`/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleBarcodeSearch = async () => {
    if (!searchTerm.trim()) {
      fetchProducts();
      return;
    }

    try {
      const response = await authService.getApiInstance().get(`/products/barcode/${searchTerm}`);
      setProducts([response.data]);
    } catch (error) {
      if (error.response?.status === 404) {
        setProducts([]);
        alert('Product not found');
      } else {
        console.error('Error searching by barcode:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      barcode: '',
      price: '',
      cost: '',
      currentStock: '',
      reorderThreshold: '',
      categoryId: '',
      description: '',
      active: true,
      foodStampEligible: false
    });
  };

  const openAddModal = () => {
    setEditingProduct(null);
    resetForm();
    setShowModal(true);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedProducts = (productsToSort) => {
    if (!sortField) return productsToSort;

    return [...productsToSort].sort((a, b) => {
      let aValue, bValue;

      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'barcode':
          aValue = a.barcode || '';
          bValue = b.barcode || '';
          break;
        case 'category':
          aValue = a.category?.name?.toLowerCase() || '';
          bValue = b.category?.name?.toLowerCase() || '';
          break;
        case 'price':
          aValue = parseFloat(a.price);
          bValue = parseFloat(b.price);
          break;
        case 'stock':
          aValue = parseInt(a.currentStock);
          bValue = parseInt(b.currentStock);
          break;
        case 'foodStamp':
          aValue = a.foodStampEligible ? 1 : 0;
          bValue = b.foodStampEligible ? 1 : 0;
          break;
        case 'status':
          aValue = a.active ? 1 : 0;
          bValue = b.active ? 1 : 0;
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === 'asc' ? comparison : -comparison;
      } else {
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      }
    });
  };

  const SortableHeader = ({ field, children, className = "" }) => (
    <th 
      className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 ${className}`}
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center justify-between">
        <span>{children}</span>
        <div className="flex flex-col ml-1">
          <svg 
            className={`w-3 h-3 ${sortField === field && sortDirection === 'asc' ? 'text-blue-500' : 'text-gray-300'}`} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <svg 
            className={`w-3 h-3 -mt-1 ${sortField === field && sortDirection === 'desc' ? 'text-blue-500' : 'text-gray-300'}`} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </th>
  );

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.barcode && product.barcode.includes(searchTerm))
  );

  const sortedProducts = getSortedProducts(filteredProducts);

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
        <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
        <button
          onClick={openAddModal}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name or barcode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          onClick={handleBarcodeSearch}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Search Barcode
        </button>
        <button
          onClick={() => { setSearchTerm(''); fetchProducts(); }}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Clear
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <SortableHeader field="name" className="w-1/4">
                Product
              </SortableHeader>
              <SortableHeader field="barcode" className="px-3 py-3 w-32">
                Barcode
              </SortableHeader>
              <SortableHeader field="category" className="px-3 py-3 w-24">
                Category
              </SortableHeader>
              <SortableHeader field="price" className="px-3 py-3 w-20">
                Price
              </SortableHeader>
              <SortableHeader field="stock" className="px-3 py-3 w-20">
                Stock
              </SortableHeader>
              <SortableHeader field="foodStamp" className="px-3 py-3 w-24">
                Food Stamp
              </SortableHeader>
              <SortableHeader field="status" className="px-3 py-3 w-20">
                Status
              </SortableHeader>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedProducts.map((product) => (
              <tr key={product.id} className={product.currentStock <= product.reorderThreshold ? 'bg-red-50' : ''}>
                <td className="px-4 py-4">
                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                </td>
                <td className="px-3 py-4 text-sm text-gray-500 text-center">
                  {product.barcode || 'N/A'}
                </td>
                <td className="px-3 py-4 text-sm text-gray-500 text-center">
                  {product.category?.name || 'N/A'}
                </td>
                <td className="px-3 py-4 text-sm text-gray-500 text-center">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-3 py-4 text-sm text-gray-500 text-center">
                  <span className={product.currentStock <= product.reorderThreshold ? 'text-red-600 font-bold' : ''}>
                    {product.currentStock}
                  </span>
                  {product.currentStock <= product.reorderThreshold && (
                    <div className="text-xs text-red-600">(Low)</div>
                  )}
                </td>
                <td className="px-3 py-4 text-center">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    product.foodStampEligible ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {product.foodStampEligible ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-3 py-4 text-center">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    product.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm font-medium">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
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
              {editingProduct ? 'Edit Product' : 'Add Product'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
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
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Barcode
                  </label>
                  <input
                    type="text"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Cost *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Current Stock *
                  </label>
                  <input
                    type="number"
                    value={formData.currentStock}
                    onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Reorder Threshold *
                  </label>
                  <input
                    type="number"
                    value={formData.reorderThreshold}
                    onChange={(e) => setFormData({ ...formData, reorderThreshold: e.target.value })}
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
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.foodStampEligible}
                      onChange={(e) => setFormData({ ...formData, foodStampEligible: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-gray-700 text-sm font-bold">Food Stamp Eligible</span>
                  </label>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  {editingProduct ? 'Update' : 'Create'}
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

export default Products; 