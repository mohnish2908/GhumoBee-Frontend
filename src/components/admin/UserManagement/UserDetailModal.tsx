import React from 'react';
import { X, CheckCircle, Mail, Phone, MapPin, Calendar, User as UserIcon } from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
  city?: string;
  state?: string;
  profilePicture?: {
    url: string;
  };
}

interface UserDetailModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onVerify: (userId: string) => void;
  onUpdate: () => void;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({
  user,
  isOpen,
  onClose,
  onVerify,
  onUpdate
}) => {
  if (!isOpen) return null;

  const handleVerify = async () => {
    await onVerify(user._id);
    onUpdate();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">User Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Profile Picture and Basic Info */}
          <div className="flex items-center mb-6">
            <div className="h-20 w-20 flex-shrink-0">
              {user.profilePicture?.url ? (
                <img
                  className="h-20 w-20 rounded-full object-cover"
                  src={user.profilePicture.url}
                  alt={user.name}
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center">
                  <UserIcon className="w-8 h-8 text-gray-600" />
                </div>
              )}
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-500 capitalize">{user.role}</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                user.isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {user.isVerified ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </>
                ) : (
                  <>
                    <X className="w-3 h-3 mr-1" />
                    Unverified
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
              <div className="flex items-center text-sm text-gray-900">
                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                {user.email}
              </div>
            </div>

            {user.phone && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Phone</label>
                <div className="flex items-center text-sm text-gray-900">
                  <Phone className="w-4 h-4 mr-2 text-gray-400" />
                  {user.phone}
                </div>
              </div>
            )}

            {(user.city || user.state) && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Location</label>
                <div className="flex items-center text-sm text-gray-900">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                  {user.city && user.state ? `${user.city}, ${user.state}` : user.city || user.state}
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Joined</label>
              <div className="flex items-center text-sm text-gray-900">
                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Close
          </button>
          {!user.isVerified && (
            <button
              onClick={handleVerify}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Verify User
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;
