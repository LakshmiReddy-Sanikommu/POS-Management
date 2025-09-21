import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Products from './pages/Products';
import Inventory from './pages/Inventory';
import POS from './pages/POS';
import Promotions from './pages/Promotions';
import Lottery from './pages/Lottery';
import Fuel from './pages/Fuel';
import Services from './pages/Services';
import Users from './pages/Users';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/categories" element={<Categories />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/inventory" element={<Inventory />} />
                      <Route path="/pos" element={<POS />} />
                      <Route path="/promotions" element={<Promotions />} />
                      <Route path="/lottery" element={<Lottery />} />
                      <Route path="/fuel" element={<Fuel />} />
                      <Route path="/services" element={<Services />} />
                      <Route path="/users" element={<Users />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 