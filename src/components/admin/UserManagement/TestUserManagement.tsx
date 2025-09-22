import { useState } from 'react';
import { Search, CheckCircle, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { verifyUser, searchUserByEmail } from '../../../services/operations/adminApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { useTheme } from '../../../contexts/ThemeContext';

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

interface UserSearchResult {
  user: User;
  hostOpportunities: Opportunity[];
  volunteerApplications?: any[];
}

const TestUserManagement = () => {
  const [searchEmail, setSearchEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<UserSearchResult | null>(null);
  const [error, setError] = useState<string>('');

  const { token } = useSelector((state: RootState) => state.user);
  const { isDark } = useTheme();

  const handleSearchUser = async () => {
    if (!searchEmail.trim()) {
      setError('Please enter an email address');
      return;
    }

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
      setError('User not found with this email address');
      setSearchResults(null);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyUser = async (userId: string) => {
    try {
      await verifyUser(userId, token || '');
      
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
    <div className={`p-4 lg:p-8 min-h-full ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="mb-6 lg:mb-8">
        <h1 className={`text-2xl lg:text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          User Management
        </h1>
        <p className={`text-sm lg:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Search for users by their email address to view detailed information and verify accounts
        </p>
      </div>

      {/* Search Section */}
      <div className={`rounded-2xl shadow-sm p-4 lg:p-6 mb-6 ${
        isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        <div className="flex flex-col lg:flex-row gap-4 lg:items-end">
          <div className="flex-1">
            <label htmlFor="email" className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              User Email
            </label>
            <div className="relative">
              <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                isDark ? 'text-gray-400' : 'text-gray-400'
              }`} />
              <input
                id="email"
                type="email"
                placeholder="Enter user email (e.g., user@example.com)"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchUser()}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 lg:gap-4">
            <button
              onClick={handleSearchUser}
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Search className="w-5 h-5 mr-2" />
              {loading ? 'Searching...' : 'Search User'}
            </button>
            {searchResults && (
              <button
                onClick={handleClearSearch}
                className={`w-full sm:w-auto px-4 py-3 rounded-xl transition-all ${
                  isDark 
                    ? 'bg-gray-600 text-white hover:bg-gray-700' 
                    : 'bg-gray-500 text-white hover:bg-gray-600'
                }`}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className={`mt-4 p-3 rounded-xl border ${
            isDark 
              ? 'bg-red-900/20 border-red-800 text-red-300' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <p className="text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Search Results */}
      {searchResults && (
        <div className={`rounded-2xl shadow-sm p-4 lg:p-6 ${
          isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <h2 className={`text-lg lg:text-xl font-semibold mb-4 lg:mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            User Details
          </h2>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* User Information */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="h-16 w-16 flex-shrink-0 mx-auto sm:mx-0">
                  {searchResults.user.profilePicture?.url ? (
                    <img
                      className="h-16 w-16 rounded-full object-cover"
                      src={searchResults.user.profilePicture.url}
                      alt={searchResults.user.name}
                    />
                  ) : (
                    <div className={`h-16 w-16 rounded-full flex items-center justify-center ${
                      isDark ? 'bg-gray-700' : 'bg-gray-300'
                    }`}>
                      <span className={`text-lg font-semibold ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {searchResults.user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-center sm:text-left">
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {searchResults.user.name}
                  </h3>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} break-all`}>
                    {searchResults.user.email}
                  </p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={`flex items-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="break-all">{searchResults.user.phone || 'Not provided'}</span>
                </div>
                <div className={`flex items-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="break-all">
                    {searchResults.user.city && searchResults.user.state 
                      ? `${searchResults.user.city}, ${searchResults.user.state}`
                      : 'Location not provided'
                    }
                  </span>
                </div>
                <div className={`flex items-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} sm:col-span-2`}>
                  <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                  Joined {new Date(searchResults.user.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* Verify Button */}
              {!searchResults.user.isVerified && (
                <div className="pt-4">
                  <button
                    onClick={() => handleVerifyUser(searchResults.user._id)}
                    className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 rounded-xl hover:from-green-700 hover:to-green-800 flex items-center transition-all shadow-lg hover:shadow-xl"
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
                <h4 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Posted Opportunities
                </h4>
                <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                  {searchResults.hostOpportunities.map((opportunity: Opportunity) => (
                    <div key={opportunity._id} className={`border rounded-xl p-4 ${
                      isDark ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
                    }`}>
                      <h5 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {opportunity.title}
                      </h5>
                      <p className={`text-sm mt-1 line-clamp-2 ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>{opportunity.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {opportunity.location}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          opportunity.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {opportunity.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        {opportunity.currentVolunteers}/{opportunity.maxVolunteers} volunteers • 
                        Created {new Date(opportunity.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty States */}
            {searchResults.user.role === 'host' && (!searchResults.hostOpportunities || searchResults.hostOpportunities.length === 0) && (
              <div className="text-center py-8">
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  This host hasn't posted any opportunities yet.
                </p>
              </div>
            )}

            {searchResults.user.role === 'volunteer' && (!searchResults.volunteerApplications || searchResults.volunteerApplications.length === 0) && (
              <div className="text-center py-8">
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  This volunteer hasn't applied to any opportunities yet.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty State - No Search */}
      {!searchResults && !loading && !error && (
        <div className={`rounded-2xl shadow-sm p-12 text-center ${
          isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isDark ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <Search className={`w-8 h-8 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
          </div>
          <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Search for Users
          </h3>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Enter a user's email address above to view their profile and verify their account.
          </p>
        </div>
      )}
    </div>
  );
};

export default TestUserManagement;
