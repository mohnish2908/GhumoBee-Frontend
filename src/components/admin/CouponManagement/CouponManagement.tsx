import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Calendar, Users, Percent, DollarSign } from 'lucide-react';
import { getAllCoupons, deleteCoupon } from '../../../services/operations/adminApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import CreateCouponModal from './CreateCouponModal';
import EditCouponModal from './EditCouponModal';

interface Coupon {
  _id: string;
  code: string;
  description: string;
  discountValue: number;
  minOrderValue: number;
  usageLimit: number;
  usedCount: number;
  usersUsed: string[];
  expiresAt: string;
  isActive: boolean;
  createdAt: string;
  createdBy: {
    name: string;
    email: string;
  };
}

const CouponManagement: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const { token } = useSelector((state: RootState) => state.user);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await getAllCoupons({}, token || '');
      setCoupons(response.data);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDeleteCoupon = async (couponId: string) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await deleteCoupon(couponId, token || '');
        fetchCoupons(); // Refresh the list
      } catch (error) {
        console.error('Error deleting coupon:', error);
      }
    }
  };

  const handleEditCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setIsEditModalOpen(true);
  };

  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coupon.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && coupon.isActive) ||
                         (statusFilter === 'inactive' && !coupon.isActive) ||
                         (statusFilter === 'expired' && new Date(coupon.expiresAt) < new Date());
    return matchesSearch && matchesStatus;
  });

  const getCouponStatus = (coupon: Coupon) => {
    if (!coupon.isActive) return 'inactive';
    if (new Date(coupon.expiresAt) < new Date()) return 'expired';
    if (coupon.usedCount >= coupon.usageLimit) return 'used-up';
    return 'active';
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' },
      inactive: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Inactive' },
      expired: { bg: 'bg-red-100', text: 'text-red-800', label: 'Expired' },
      'used-up': { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Used Up' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Coupon Management</h1>
          <p className="text-gray-600">Create and manage discount coupons</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Coupon
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search coupons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Coupons Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCoupons.map((coupon) => {
            const status = getCouponStatus(coupon);
            const usagePercentage = (coupon.usedCount / coupon.usageLimit) * 100;

            return (
              <div key={coupon._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {coupon.code}
                    </h3>
                    {getStatusBadge(status)}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditCoupon(coupon)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCoupon(coupon._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">{coupon.description}</p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <Percent className="w-4 h-4 mr-2 text-gray-400" />
                      Discount
                    </div>
                    <span className="font-semibold text-green-600">
                      ₹{coupon.discountValue}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                      Min Order
                    </div>
                    <span className="text-gray-900">₹{coupon.minOrderValue}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2 text-gray-400" />
                      Usage
                    </div>
                    <span className="text-gray-900">
                      {coupon.usedCount}/{coupon.usageLimit}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      Expires
                    </div>
                    <span className="text-gray-900 text-sm">
                      {new Date(coupon.expiresAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Usage Progress Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-500">Usage Progress</span>
                      <span className="text-xs text-gray-500">{Math.round(usagePercentage)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          usagePercentage >= 100 ? 'bg-red-500' :
                          usagePercentage >= 80 ? 'bg-orange-500' :
                          'bg-blue-500'
                        }`}
                        style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Created by {coupon.createdBy?.name || 'Unknown'} on{' '}
                    {new Date(coupon.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filteredCoupons.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No coupons found matching your criteria.</p>
        </div>
      )}

      {/* Create Coupon Modal */}
      <CreateCouponModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          fetchCoupons();
        }}
      />

      {/* Edit Coupon Modal */}
      {selectedCoupon && (
        <EditCouponModal
          isOpen={isEditModalOpen}
          coupon={selectedCoupon}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedCoupon(null);
          }}
          onSuccess={() => {
            setIsEditModalOpen(false);
            setSelectedCoupon(null);
            fetchCoupons();
          }}
        />
      )}
    </div>
  );
};

export default CouponManagement;
