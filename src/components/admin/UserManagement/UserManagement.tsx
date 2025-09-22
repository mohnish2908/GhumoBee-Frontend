import React, { useState } from 'react';
import { Search, CheckCircle, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { verifyUser, searchUserByEmail } from '../../../services/operations/adminApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';

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
  host?: any;
  volunteer?: any;
}

interface Opportunity {
  _id: string;
  title: string;
  description: string;
  location: string;
  accommodationType: string;
  maxVolunteers: number;
  currentVolunteers: number;
  isActive: boolean;
  createdAt: string;
}

interface Application {
  _id: string;
  status: string;
  appliedDate: string;
  message: string;
  opportunity: {
    _id: string;
    title: string;
    location: string;
    host: {
      user: {
        name: string;
        email: string;
      }
    }
  }
}

interface UserSearchResult {
  user: User;
  hostOpportunities: Opportunity[];
  volunteerApplications?: Application[];
}

const UserManagement: React.FC = () => {
  const [searchEmail, setSearchEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<UserSearchResult | null>(null);
  const [error, setError] = useState<string>('');

  const { token } = useSelector((state: RootState) => state.user);

  // Email search function
  const handleSearchUser = async () => {
    if (!searchEmail.trim()) {
      setError('Please enter an email address');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(searchEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      setError('');
      console.log('Searching for user with email:', searchEmail);
      
      const response = await searchUserByEmail(searchEmail, token || '');
      console.log('Search response:', response);
      
      if (response.success) {
        setSearchResults(response.data);
      } else {
        setError('User not found with this email address');
        setSearchResults(null);
      }
    } catch (error: any) {
      console.error('Error searching user:', error);
      setError(error?.response?.data?.message || 'User not found with this email address');
      setSearchResults(null);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyUser = async (userId: string) => {
    try {
      await verifyUser(userId, token || '');
      
      // Update search results
      if (searchResults) {
        setSearchResults({
          ...searchResults,
          user: { ...searchResults.user, isVerified: true }
        });
      }
    } catch (error) {
      console.error('Error verifying user:', error);
      setError('Failed to verify user');
    }
  };

  const handleClearSearch = () => {
    setSearchEmail('');
    setSearchResults(null);
    setError('');
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
        <p className="text-gray-600">
          Search for users by their email address to view detailed information and verify accounts
        </p>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              User Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="email"
                type="email"
                placeholder="Enter user email (e.g., user@example.com)"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchUser()}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <button
            onClick={handleSearchUser}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Search className="w-5 h-5 mr-2" />
            {loading ? 'Searching...' : 'Search User'}
          </button>
          {searchResults && (
            <button
              onClick={handleClearSearch}
              className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Clear
            </button>
          )}
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Search Results */}
      {searchResults && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">User Details</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Information */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 flex-shrink-0">
                  {searchResults.user.profilePicture?.url ? (
                    <img
                      className="h-16 w-16 rounded-full object-cover"
                      src={searchResults.user.profilePicture.url}
                      alt={searchResults.user.name}
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-600 text-lg font-semibold">
                        {searchResults.user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{searchResults.user.name}</h3>
                  <p className="text-gray-600">{searchResults.user.email}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      searchResults.user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800'
                        : searchResults.user.role === 'host'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {searchResults.user.role}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      searchResults.user.isVerified 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {searchResults.user.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  {searchResults.user.phone || 'Not provided'}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {searchResults.user.city && searchResults.user.state 
                    ? `${searchResults.user.city}, ${searchResults.user.state}`
                    : 'Location not provided'
                  }
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  Joined {new Date(searchResults.user.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* Role-specific Information */}
              {searchResults.user.role === 'host' && searchResults.user.host && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-900 mb-2">Host Details</h5>
                  {searchResults.user.host.description && (
                    <p className="text-sm text-blue-800 mb-2">{searchResults.user.host.description}</p>
                  )}
                  {searchResults.user.host.skills && searchResults.user.host.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {searchResults.user.host.skills.map((skill: string, index: number) => (
                        <span key={index} className="inline-block bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {searchResults.user.role === 'volunteer' && searchResults.user.volunteer && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <h5 className="font-medium text-green-900 mb-2">Volunteer Details</h5>
                  {searchResults.user.volunteer.skills && searchResults.user.volunteer.skills.length > 0 && (
                    <div className="mb-2">
                      <span className="text-sm font-medium text-green-800">Skills: </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {searchResults.user.volunteer.skills.map((skill: string, index: number) => (
                          <span key={index} className="inline-block bg-green-200 text-green-800 text-xs px-2 py-1 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {searchResults.user.volunteer.interests && searchResults.user.volunteer.interests.length > 0 && (
                    <div className="mb-2">
                      <span className="text-sm font-medium text-green-800">Interests: </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {searchResults.user.volunteer.interests.map((interest: string, index: number) => (
                          <span key={index} className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {searchResults.user.volunteer.preferredLocation && (
                    <p className="text-sm text-green-800">
                      <span className="font-medium">Preferred Location:</span> {searchResults.user.volunteer.preferredLocation}
                    </p>
                  )}
                </div>
              )}

              {/* Verify Button */}
              {!searchResults.user.isVerified && (
                <div className="pt-4">
                  <button
                    onClick={() => handleVerifyUser(searchResults.user._id)}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Verify User
                  </button>
                </div>
              )}
            </div>

            {/* Host Opportunities */}
            {searchResults.user.role === 'host' && searchResults.hostOpportunities && searchResults.hostOpportunities.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Posted Opportunities</h4>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {searchResults.hostOpportunities.map((opportunity: Opportunity) => (
                    <div key={opportunity._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">{opportunity.title}</h5>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{opportunity.description}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-gray-500">{opportunity.location}</span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              opportunity.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {opportunity.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-2">
                            {opportunity.currentVolunteers}/{opportunity.maxVolunteers} volunteers • 
                            Created {new Date(opportunity.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Volunteer Applications */}
            {searchResults.user.role === 'volunteer' && searchResults.volunteerApplications && searchResults.volunteerApplications.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Volunteer Applications</h4>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {searchResults.volunteerApplications.map((application: Application) => (
                    <div key={application._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">{application.opportunity.title}</h5>
                          <p className="text-sm text-gray-600 mt-1">{application.message}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-gray-500">{application.opportunity.location}</span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              application.status === 'accepted' 
                                ? 'bg-green-100 text-green-800'
                                : application.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {application.status}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-2">
                            Host: {application.opportunity.host.user.name} ({application.opportunity.host.user.email}) • 
                            Applied {new Date(application.appliedDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty States */}
            {searchResults.user.role === 'host' && (!searchResults.hostOpportunities || searchResults.hostOpportunities.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                <p>This host hasn't posted any opportunities yet.</p>
              </div>
            )}

            {searchResults.user.role === 'volunteer' && (!searchResults.volunteerApplications || searchResults.volunteerApplications.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                <p>This volunteer hasn't applied to any opportunities yet.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty State - No Search */}
      {!searchResults && !loading && !error && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Search for Users</h3>
          <p className="text-gray-500">
            Enter a user's email address above to view their profile, applications, and verify their account.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
