import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, Percent, Users, FileText, ToggleLeft, ToggleRight } from 'lucide-react';
import { updateCoupon } from '../../../services/operations/adminApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';

interface Coupon {
  _id: string;
  code: string;
  description: string;
  discountValue: number;
  minOrderValue: number;
  usageLimit: number;
  usedCount: number;
  expiresAt: string;
  isActive: boolean;
}

interface EditCouponModalProps {
  isOpen: boolean;
  coupon: Coupon;
  onClose: () => void;
  onSuccess: () => void;
}

const EditCouponModal: React.FC<EditCouponModalProps> = ({
  isOpen,
  coupon,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountValue: '',
    minOrderValue: '',
    usageLimit: '',
    expiresAt: '',
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { token } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (coupon) {
      setFormData({
        code: coupon.code,
        description: coupon.description,
        discountValue: coupon.discountValue.toString(),
        minOrderValue: coupon.minOrderValue.toString(),
        usageLimit: coupon.usageLimit.toString(),
        expiresAt: new Date(coupon.expiresAt).toISOString().slice(0, 16),
        isActive: coupon.isActive
      });
    }
  }, [coupon]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleToggleActive = () => {
    setFormData(prev => ({ ...prev, isActive: !prev.isActive }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) {
      newErrors.code = 'Coupon code is required';
    } else if (formData.code.length < 3) {
      newErrors.code = 'Coupon code must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.discountValue || Number(formData.discountValue) <= 0) {
      newErrors.discountValue = 'Valid discount value is required';
    }

    if (!formData.minOrderValue || Number(formData.minOrderValue) < 0) {
      newErrors.minOrderValue = 'Valid minimum order value is required';
    }

    if (!formData.usageLimit || Number(formData.usageLimit) <= 0) {
      newErrors.usageLimit = 'Valid usage limit is required';
    } else if (Number(formData.usageLimit) < coupon.usedCount) {
      newErrors.usageLimit = `Usage limit cannot be less than current usage (${coupon.usedCount})`;
    }

    if (!formData.expiresAt) {
      newErrors.expiresAt = 'Expiry date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      const updateData = {
        code: formData.code.toUpperCase(),
        description: formData.description,
        discountValue: Number(formData.discountValue),
        minOrderValue: Number(formData.minOrderValue),
        usageLimit: Number(formData.usageLimit),
        expiresAt: formData.expiresAt,
        isActive: formData.isActive
      };

      await updateCoupon(coupon._id, updateData, token || '');
      onSuccess();
    } catch (error: any) {
      console.error('Error updating coupon:', error);
      if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Edit Coupon</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {errors.general}
            </div>
          )}

          {/* Active Status Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <span className="text-sm font-medium text-gray-700">Coupon Status</span>
              <p className="text-xs text-gray-500">
                {formData.isActive ? 'Coupon is currently active' : 'Coupon is currently inactive'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleToggleActive}
              className="flex items-center"
            >
              {formData.isActive ? (
                <ToggleRight className="w-8 h-8 text-green-500" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-gray-400" />
              )}
            </button>
          </div>

          {/* Coupon Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FileText className="w-4 h-4 inline mr-1" />
              Coupon Code
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.code ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Discount Value */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Percent className="w-4 h-4 inline mr-1" />
              Discount Value (₹)
            </label>
            <input
              type="number"
              name="discountValue"
              value={formData.discountValue}
              onChange={handleInputChange}
              min="1"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.discountValue ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.discountValue && <p className="text-red-500 text-sm mt-1">{errors.discountValue}</p>}
          </div>

          {/* Minimum Order Value */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <DollarSign className="w-4 h-4 inline mr-1" />
              Minimum Order Value (₹)
            </label>
            <input
              type="number"
              name="minOrderValue"
              value={formData.minOrderValue}
              onChange={handleInputChange}
              min="0"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.minOrderValue ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.minOrderValue && <p className="text-red-500 text-sm mt-1">{errors.minOrderValue}</p>}
          </div>

          {/* Usage Limit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Users className="w-4 h-4 inline mr-1" />
              Usage Limit
            </label>
            <input
              type="number"
              name="usageLimit"
              value={formData.usageLimit}
              onChange={handleInputChange}
              min={coupon.usedCount}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.usageLimit ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            <p className="text-xs text-gray-500 mt-1">
              Current usage: {coupon.usedCount}
            </p>
            {errors.usageLimit && <p className="text-red-500 text-sm mt-1">{errors.usageLimit}</p>}
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="w-4 h-4 inline mr-1" />
              Expiry Date
            </label>
            <input
              type="datetime-local"
              name="expiresAt"
              value={formData.expiresAt}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.expiresAt ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.expiresAt && <p className="text-red-500 text-sm mt-1">{errors.expiresAt}</p>}
          </div>
        </form>

        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating...' : 'Update Coupon'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCouponModal;
