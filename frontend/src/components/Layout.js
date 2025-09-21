import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HomeIcon,
  TagIcon,
  CubeIcon,
  ClipboardDocumentListIcon,
  ShoppingCartIcon,
  TicketIcon,
  TruckIcon,
  BeakerIcon,
  DocumentTextIcon,
  UsersIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, hasRole } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, roles: ['ADMIN', 'MANAGER', 'CASHIER'] },
    { name: 'Categories', href: '/categories', icon: TagIcon, roles: ['ADMIN', 'MANAGER'] },
    { name: 'Products', href: '/products', icon: CubeIcon, roles: ['ADMIN', 'MANAGER'] },
    { name: 'Inventory', href: '/inventory', icon: ClipboardDocumentListIcon, roles: ['ADMIN', 'MANAGER'] },
    { name: 'POS', href: '/pos', icon: ShoppingCartIcon, roles: ['ADMIN', 'MANAGER', 'CASHIER'] },
    { name: 'Promotions', href: '/promotions', icon: TicketIcon, roles: ['ADMIN', 'MANAGER'] },
    { name: 'Lottery', href: '/lottery', icon: BeakerIcon, roles: ['ADMIN', 'MANAGER'] },
    { name: 'Fuel', href: '/fuel', icon: TruckIcon, roles: ['ADMIN', 'MANAGER'] },
    { name: 'Services', href: '/services', icon: DocumentTextIcon, roles: ['ADMIN', 'MANAGER', 'CASHIER'] },
    { name: 'Users', href: '/users', icon: UsersIcon, roles: ['ADMIN'] },
  ];

  const filteredNavigation = navigation.filter(item => 
    item.roles.some(role => hasRole(role))
  );

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-6 w-6 text-white" />
            </button>
          </div>
          <SidebarContent navigation={filteredNavigation} location={location} />
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <SidebarContent navigation={filteredNavigation} location={location} />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top nav */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              {/* You can add search here if needed */}
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">
                  Welcome, {user?.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const SidebarContent = ({ navigation, location }) => (
  <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
    <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
      <div className="flex items-center flex-shrink-0 px-4">
        <h1 className="text-xl font-bold text-gray-900">Gas Station</h1>
      </div>
      <nav className="mt-5 flex-1 px-2 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`${
                isActive
                  ? 'bg-primary-100 border-primary-500 text-primary-700'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              } group flex items-center px-2 py-2 text-sm font-medium border-l-4`}
            >
              <item.icon
                className={`${
                  isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                } mr-3 h-6 w-6`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  </div>
);

export default Layout; 