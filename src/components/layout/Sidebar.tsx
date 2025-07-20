import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  Store, 
  Package, 
  Users, 
  Wallet, 
  Crown, 
  Shield,
  X,
  Menu
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/profile', label: 'Profile', icon: User },
    { path: '/my-shop', label: 'My Shop', icon: Store },
    { path: '/products', label: 'Products', icon: Package },
    { path: '/leads', label: 'My Leads', icon: Users },
    { path: '/wallets', label: 'My Wallets', icon: Wallet },
    { path: '/my-plans', label: 'My Plans', icon: Crown },
    { path: '/kyc', label: 'KYC', icon: Shield },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-40 lg:hidden p-3 bg-gradient-to-r from-blue-600 to-orange-500 rounded-xl shadow-lg text-white hover:from-blue-700 hover:to-orange-600 transition-all duration-300 transform hover:scale-105"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 w-64 h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Header with gradient */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-gradient-to-r from-blue-600 to-orange-500">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <Store className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">
                <span className="text-blue-200">Local</span>
                <span className="text-orange-200">Zarurat</span>
              </div>
              <p className="text-xs text-blue-100">Seller Dashboard</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                      ${isActive 
                        ? 'bg-gradient-to-r from-blue-500 to-orange-500 text-white shadow-lg' 
                        : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                      }
                    `}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <div className="text-center text-xs text-gray-400">
            <p>Developed by</p>
            <p className="font-semibold text-blue-300">Cripcocode Technologies Pvt Ltd</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;