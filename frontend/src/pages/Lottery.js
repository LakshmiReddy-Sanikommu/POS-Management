import React, { useState, useEffect } from 'react';
import authService from '../services/authService';

const Lottery = () => {
  const [lotteryGames, setLotteryGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    barcode: '',
    packCount: '',
    ticketPrice: '',
    packCost: '',
    currentStock: '',
    description: '',
    active: true
  });

  useEffect(() => {
    fetchLotteryGames();
  }, []);

  const fetchLotteryGames = async () => {
    try {
      const response = await authService.getApiInstance().get('/lottery');
      setLotteryGames(response.data);
    } catch (error) {
      console.error('Error fetching lottery games:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        barcode: formData.barcode || null,
        packCount: parseInt(formData.packCount),
        ticketPrice: parseFloat(formData.ticketPrice),
        packCost: parseFloat(formData.packCost),
        currentStock: parseInt(formData.currentStock),
        description: formData.description || null,
        active: formData.active
      };

      if (editingGame) {
        await authService.getApiInstance().put(`/lottery/${editingGame.id}`, payload);
      } else {
        await authService.getApiInstance().post('/lottery', payload);
      }

      setShowModal(false);
      setEditingGame(null);
      resetForm();
      fetchLotteryGames();
    } catch (error) {
      console.error('Error saving lottery game:', error);
      alert('Error saving lottery game. Please check all fields.');
    }
  };

  const handleEdit = (game) => {
    setEditingGame(game);
    setFormData({
      name: game.name,
      barcode: game.barcode || '',
      packCount: game.packCount.toString(),
      ticketPrice: game.ticketPrice.toString(),
      packCost: game.packCost.toString(),
      currentStock: game.currentStock.toString(),
      description: game.description || '',
      active: game.active
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lottery game?')) {
      try {
        await authService.getApiInstance().delete(`/lottery/${id}`);
        fetchLotteryGames();
      } catch (error) {
        console.error('Error deleting lottery game:', error);
      }
    }
  };

  const handleSellTickets = async (gameId, quantity) => {
    const sellQuantity = prompt(`Enter number of tickets to sell (max ${quantity}):`);
    if (sellQuantity && parseInt(sellQuantity) > 0 && parseInt(sellQuantity) <= quantity) {
      try {
        await authService.getApiInstance().post(`/lottery/${gameId}/sell/${sellQuantity}`);
        fetchLotteryGames();
        alert(`Successfully sold ${sellQuantity} tickets!`);
      } catch (error) {
        console.error('Error selling tickets:', error);
        alert('Error selling tickets. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      barcode: '',
      packCount: '',
      ticketPrice: '',
      packCost: '',
      currentStock: '',
      description: '',
      active: true
    });
  };

  const openAddModal = () => {
    setEditingGame(null);
    resetForm();
    setShowModal(true);
  };

  const calculatePackValue = (game) => {
    return game.ticketPrice * game.packCount;
  };

  const calculateProfit = (game) => {
    return calculatePackValue(game) - game.packCost;
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
        <h1 className="text-2xl font-bold text-gray-900">Lottery Management</h1>
        <button
          onClick={openAddModal}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Lottery Game
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Game
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Barcode
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pack Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pricing
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
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
            {lotteryGames.map((game) => (
              <tr key={game.id} className={game.currentStock === 0 ? 'bg-red-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{game.name}</div>
                  <div className="text-sm text-gray-500">{game.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {game.barcode || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>{game.packCount} tickets/pack</div>
                  <div className="text-xs text-gray-400">Value: ${calculatePackValue(game).toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>Ticket: ${game.ticketPrice.toFixed(2)}</div>
                  <div>Pack Cost: ${game.packCost.toFixed(2)}</div>
                  <div className="text-xs text-green-600">Profit: ${calculateProfit(game).toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={game.currentStock === 0 ? 'text-red-600 font-bold' : ''}>
                    {game.currentStock} packs
                  </span>
                  {game.currentStock === 0 && (
                    <div className="text-xs text-red-600">Out of Stock</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    game.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {game.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {game.currentStock > 0 && (
                    <button
                      onClick={() => handleSellTickets(game.id, game.currentStock)}
                      className="text-green-600 hover:text-green-900 mr-4"
                    >
                      Sell
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(game)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(game.id)}
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
              {editingGame ? 'Edit Lottery Game' : 'Add Lottery Game'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Game Name *
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
                    Pack Count *
                  </label>
                  <input
                    type="number"
                    value={formData.packCount}
                    onChange={(e) => setFormData({ ...formData, packCount: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Ticket Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.ticketPrice}
                    onChange={(e) => setFormData({ ...formData, ticketPrice: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Pack Cost *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.packCost}
                    onChange={(e) => setFormData({ ...formData, packCost: e.target.value })}
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
                <div className="mb-4 col-span-2">
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
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  {editingGame ? 'Update' : 'Create'}
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

export default Lottery; 