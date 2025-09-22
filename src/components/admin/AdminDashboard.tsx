import { useState } from 'react';
import { 
  Users, 
  Gift, 
  BarChart3, 
  Settings, 
  Bell,
  Search,
  Menu,
  X,
  Shield,
  Activity,
  TrendingUp,
  UserCheck,
  Sun,
  Moon,
  Home,
  LogOut
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store/store';
import { useTheme } from '../../contexts/ThemeContext';
import { logout } from '../../services/operations/authApi';
import TestUserManagement from './UserManagement/TestUserManagement';
import CouponManagement from './CouponManagement/CouponManagement';

type ActiveTab = 'dashboard' | 'users' | 'coupons' | 'analytics' | 'settings';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<any>;
  trend: 'up' | 'down';
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, icon: Icon, trend, color }) => {
  const { isDark } = useTheme();
  
  return (
    <div className={`p-4 lg:p-6 rounded-2xl border transition-all duration-200 hover:shadow-lg ${
      isDark 
        ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
        : 'bg-white border-gray-200 hover:border-gray-300'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {title}
          </p>
          <p className={`text-2xl lg:text-3xl font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {value}
          </p>
          <div className="flex items-center mt-2">
            <TrendingUp className={`w-4 h-4 mr-1 ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
            <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
              {change}
            </span>
            <span className={`text-xs lg:text-sm ml-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              vs last month
            </span>
          </div>
        </div>
        <div className={`p-3 lg:p-4 rounded-xl ${color} ml-4`}>
          <Icon className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
        </div>
      </div>
    </div>
  );
};

const DashboardOverview = () => {
  const { isDark } = useTheme();
  
  const stats = [
    {
      title: 'Total Users',
      value: '2,543',
      change: '+12.5%',
      icon: Users,
      trend: 'up' as const,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600'
    },
    {
      title: 'Active Hosts',
      value: '847',
      change: '+8.2%',
      icon: Home,
      trend: 'up' as const,
      color: 'bg-gradient-to-r from-green-500 to-green-600'
    },
    {
      title: 'Volunteers',
      value: '1,696',
      change: '+15.3%',
      icon: UserCheck,
      trend: 'up' as const,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600'
    },
    {
      title: 'Active Coupons',
      value: '24',
      change: '-2.1%',
      icon: Gift,
      trend: 'down' as const,
      color: 'bg-gradient-to-r from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className={`p-4 lg:p-8 ${isDark ? 'bg-gray-900' : 'bg-gray-50'} min-h-full`}>
      <div className="mb-6 lg:mb-8">
        <h1 className={`text-2xl lg:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
          Dashboard Overview
        </h1>
        <p className={`text-sm lg:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Welcome back! Here's what's happening with your platform today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <div className={`p-4 lg:p-6 rounded-2xl border ${
          isDark 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Recent Activity
          </h3>
          <div className="space-y-4">
            {[
              { action: 'New user registered', time: '2 minutes ago', type: 'user' },
              { action: 'Coupon created', time: '15 minutes ago', type: 'coupon' },
              { action: 'Host verified', time: '1 hour ago', type: 'verification' },
              { action: 'New opportunity posted', time: '2 hours ago', type: 'opportunity' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === 'user' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'coupon' ? 'bg-orange-100 text-orange-600' :
                  activity.type === 'verification' ? 'bg-green-100 text-green-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  <Activity className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {activity.action}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`p-4 lg:p-6 rounded-2xl border ${
          isDark 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            System Health
          </h3>
          <div className="space-y-4">
            {[
              { metric: 'Server Status', status: 'Operational', color: 'green' },
              { metric: 'Database', status: 'Operational', color: 'green' },
              { metric: 'Email Service', status: 'Operational', color: 'green' },
              { metric: 'Payment Gateway', status: 'Warning', color: 'yellow' }
            ].map((health, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {health.metric}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  health.color === 'green' ? 'bg-green-100 text-green-800' :
                  health.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {health.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const userState = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      dispatch(logout() as any);
      navigate('/login');
    }
  };

  // Close mobile menu when tab changes
  const handleTabChange = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  const tabs = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: BarChart3, 
      component: DashboardOverview, 
      description: 'Overview and analytics' 
    },
    { 
      id: 'users', 
      label: 'User Management', 
      icon: Users, 
      component: TestUserManagement, 
      description: 'Manage and verify users' 
    },
    { 
      id: 'coupons', 
      label: 'Coupon Management', 
      icon: Gift, 
      component: CouponManagement, 
      description: 'Create and manage coupons' 
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: TrendingUp, 
      component: () => (
        <div className={`p-8 ${isDark ? 'bg-gray-900' : 'bg-gray-50'} min-h-full`}>
          <div className="text-center py-16">
            <TrendingUp className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
              Advanced Analytics
            </h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Comprehensive analytics and reporting features coming soon...
            </p>
          </div>
        </div>
      ), 
      description: 'View detailed analytics' 
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings, 
      component: () => (
        <div className={`p-8 ${isDark ? 'bg-gray-900' : 'bg-gray-50'} min-h-full`}>
          <div className="text-center py-16">
            <Settings className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
              System Settings
            </h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Platform configuration and settings panel coming soon...
            </p>
          </div>
        </div>
      ), 
      description: 'Configure system settings' 
    },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || DashboardOverview;
  const activeTabInfo = tabs.find(tab => tab.id === activeTab);

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="flex h-screen relative">
        {/* Mobile Overlay */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`${
          sidebarCollapsed ? 'w-20' : 'w-72'
        } ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } fixed lg:relative z-50 lg:z-auto transition-all duration-300 ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } shadow-xl border-r flex flex-col h-full`}>
          
          {/* Header */}
          <div className={`p-6 border-b ${
            isDark ? 'border-gray-700 bg-gradient-to-r from-blue-600 to-indigo-600' : 'border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600'
          }`}>
            <div className="flex items-center justify-between">
              {!sidebarCollapsed && (
                <div>
                  <h1 className="text-xl font-bold text-white flex items-center">
                    <Shield className="w-6 h-6 mr-2" />
                    <span className="hidden sm:inline">Admin Panel</span>
                  </h1>
                  <p className="text-blue-100 text-sm mt-1 hidden sm:block">GhumoBee Management</p>
                </div>
              )}
              <div className="flex items-center space-x-2">
                {/* Desktop collapse button */}
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="hidden lg:block p-2 rounded-lg hover:bg-blue-700 text-white transition-colors"
                >
                  {sidebarCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
                </button>
                {/* Mobile close button */}
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="lg:hidden p-2 rounded-lg hover:bg-blue-700 text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id as ActiveTab)}
                  className={`w-full flex items-center p-3 rounded-xl text-left transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg transform scale-105'
                      : isDark
                      ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  title={sidebarCollapsed ? tab.label : ''}
                >
                  <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                    isActive 
                      ? 'bg-white/20' 
                      : isDark
                      ? 'bg-gray-700 group-hover:bg-gray-600'
                      : 'bg-gray-100 group-hover:bg-gray-200'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      isActive 
                        ? 'text-white' 
                        : isDark 
                        ? 'text-gray-300' 
                        : 'text-gray-600'
                    }`} />
                  </div>
                  {!sidebarCollapsed && (
                    <div className="ml-3 flex-1">
                      <div className="font-medium">{tab.label}</div>
                      <div className={`text-xs ${
                        isActive 
                          ? 'text-blue-100' 
                          : isDark 
                          ? 'text-gray-400' 
                          : 'text-gray-500'
                      }`}>
                        {tab.description}
                      </div>
                    </div>
                  )}
                  {!sidebarCollapsed && isActive && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Theme Toggle */}
          <div className="p-4">
            <button
              onClick={toggleTheme}
              className={`w-full p-3 rounded-xl transition-all duration-200 flex items-center ${
                isDark
                  ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                isDark ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                {isDark ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </div>
              {!sidebarCollapsed && (
                <span className="ml-3 font-medium">
                  {isDark ? 'Light Mode' : 'Dark Mode'}
                </span>
              )}
            </button>
          </div>

          {/* Footer */}
          <div className={`p-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {userState?.name?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1">
                  <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {userState?.name || 'Admin User'}
                  </div>
                  <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Administrator
                  </div>
                </div>
              )}
              <button 
                onClick={handleLogout}
                className={`p-2 rounded-lg transition-colors ${
                  isDark 
                    ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700' 
                    : 'text-gray-400 hover:text-red-600 hover:bg-gray-100'
                }`}
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
          {/* Top Header */}
          <header className={`shadow-sm border-b px-4 lg:px-6 py-4 ${
            isDark 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Mobile menu button */}
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className={`lg:hidden p-2 rounded-lg mr-3 transition-colors ${
                    isDark
                      ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div>
                  <h2 className={`text-xl lg:text-2xl font-bold flex items-center ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {activeTabInfo && <activeTabInfo.icon className="w-5 h-5 lg:w-6 lg:h-6 mr-2 lg:mr-3 text-blue-600" />}
                    <span className="hidden sm:inline">{activeTabInfo?.label}</span>
                  </h2>
                  <p className={`text-xs lg:text-sm mt-1 hidden sm:block ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {activeTabInfo?.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 lg:space-x-4">
                {/* Search - hidden on small screens */}
                <div className="relative hidden md:block">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                    isDark ? 'text-gray-400' : 'text-gray-400'
                  }`} />
                  <input
                    type="text"
                    placeholder="Search..."
                    className={`pl-10 pr-4 py-2 rounded-lg border transition-colors ${
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  />
                </div>
                {/* Notifications - hidden on small screens */}
                <button className={`relative p-2 rounded-lg transition-colors hidden sm:block ${
                  isDark
                    ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}>
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>
                {/* Logout button - responsive */}
                <button
                  onClick={handleLogout}
                  className={`flex items-center px-2 lg:px-4 py-2 rounded-lg transition-colors ${
                    isDark
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700 border border-gray-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-300'
                  }`}
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden lg:inline ml-2">Logout</span>
                </button>
                {/* Welcome text - hidden on small screens */}
                <div className="text-right hidden lg:block">
                  <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Welcome back!
                  </div>
                  <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="h-full">
              <ActiveComponent />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
