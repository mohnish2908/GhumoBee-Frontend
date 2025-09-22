import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  getUserData,
  updateUserData,
} from "../services/operations/authApi";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { languages } from "../data/languages";
import { indianStates } from "../data/states";
import { countries } from "../data/countries";
import { Navigate, useNavigate } from "react-router-dom";



// Types
interface FormData {
  email: string;
  role: string;
  name: string;
  phone: string;
  dob: string;
  gender: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  languages: string[];
  address: string;
  emergencyContactPersonName: string;
  emergencyContactNumber: string;
  profilePicture?: { url?: string };
  aadhaarDoc?: string | { url?: string }; // Can be either string URL or object with url
  isVerified: boolean;
  createdAt: string;
}

interface FileState {
  file: File | null;
  preview: string | null;
}

const PersonalInfo: React.FC = () => {
  const userEmail = useSelector((state: any) => state.user.email);
  const userRole = useSelector((state: any) => state.user.role);
  const userToken = useSelector((state: any) => state.user.token);
  const navigate = useNavigate();
  // State management
  const [formData, setFormData] = useState<FormData | null>(null);
  const [profilePicture, setProfilePicture] = useState<FileState>({ file: null, preview: null });
  const [aadhaarDoc, setAadhaarDoc] = useState<FileState>({ file: null, preview: null });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Language selection states
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [languageSearchTerm, setLanguageSearchTerm] = useState("");

  // State selection states
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [stateSearchTerm, setStateSearchTerm] = useState("");

  // Country selection states
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState("");

  // Initial form structure
  const getInitialFormData = useCallback(() => ({
    email: userEmail || "",
    role: userRole || "",
    name: "",
    phone: "",
    dob: "",
    gender: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    languages: [],
    address: "",
    emergencyContactPersonName: "",
    emergencyContactNumber: "",
    profilePicture: undefined,
    aadhaarDoc: undefined,
    isVerified: false,
    createdAt: new Date().toISOString(),
  }), [userEmail, userRole]);

  // Function to get user email from various sources
  const getUserEmail = () => {
    // First try Redux state
    if (userEmail) return userEmail;
    
    // Try to get from localStorage token
    try {
      const token = localStorage.getItem('token') || userToken;
      if (token) {
        // Decode JWT token to get user info (basic decode, not verification)
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const decoded = JSON.parse(jsonPayload);
        return decoded.email;
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
    
    return null;
  };

  // Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      const email = getUserEmail();
      
      if (!email) {
        toast.error("User email not found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getUserData(email);

        if (data?.data || data) {
          const userData = data.data || data;
          setFormData(userData);
          // Initialize selected languages from loaded data
          setSelectedLanguages(userData.languages || []);
          
          // Set preview URLs for existing documents
          if (userData.profilePicture?.url) {
            setProfilePicture(prev => ({ ...prev, preview: userData.profilePicture.url }));
          }
          // Handle aadhaarDoc as either string URL or object with url property
          if (userData.aadhaarDoc) {
            const aadhaarUrl = typeof userData.aadhaarDoc === 'string' 
              ? userData.aadhaarDoc 
              : userData.aadhaarDoc.url;
            if (aadhaarUrl) {
              setAadhaarDoc(prev => ({ ...prev, preview: aadhaarUrl }));
            }
          }
        } else {
          toast.error("Failed to load profile data. Please try refreshing the page.");
          setFormData(getInitialFormData());
          setSelectedLanguages([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error loading profile data. Please try again.");
        setFormData(getInitialFormData());
        setSelectedLanguages([]);
      } finally {
        setLoading(false);
      }
    };

    // Add a small delay to allow Redux persist to rehydrate
    const timer = setTimeout(fetchData, 100);
    return () => clearTimeout(timer);
  }, [userEmail, userToken, getInitialFormData]);

  // Handle basic form field changes
  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
  }, []);

  // Handle phone number input (only 10 digits)
  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 10) {
      setFormData(prev => prev ? { ...prev, phone: value } : null);
    }
  }, []);

  // Handle emergency contact number input (only 10 digits)
  const handleEmergencyContactChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 10) {
      setFormData(prev => prev ? { ...prev, emergencyContactNumber: value } : null);
    }
  }, []);

  // Handle pincode input (only numbers)
  const handlePincodeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    setFormData(prev => prev ? { ...prev, pincode: value } : null);
  }, []);

  // Helper function to get aadhaarDoc URL
  const getAadhaarDocUrl = useCallback(() => {
    if (!formData?.aadhaarDoc) return null;
    return typeof formData.aadhaarDoc === 'string' 
      ? formData.aadhaarDoc 
      : formData.aadhaarDoc.url;
  }, [formData?.aadhaarDoc]);

  // Handle adding a language
  const handleAddLanguage = useCallback((languageName: string) => {
    if (!selectedLanguages.includes(languageName)) {
      const newLanguages = [...selectedLanguages, languageName];
      setSelectedLanguages(newLanguages);
      setFormData(prev => prev ? { ...prev, languages: newLanguages } : null);
    }
    setShowLanguageDropdown(false);
    setLanguageSearchTerm("");
  }, [selectedLanguages]);

  // Handle removing a language
  const handleRemoveLanguage = useCallback((languageName: string) => {
    const newLanguages = selectedLanguages.filter(lang => lang !== languageName);
    setSelectedLanguages(newLanguages);
    setFormData(prev => prev ? { ...prev, languages: newLanguages } : null);
  }, [selectedLanguages]);

  // Handle state selection
  const handleStateSelect = useCallback((stateName: string) => {
    setFormData(prev => prev ? { ...prev, state: stateName } : null);
    setShowStateDropdown(false);
    setStateSearchTerm("");
  }, []);

  // Handle country selection
  const handleCountrySelect = useCallback((countryName: string) => {
    setFormData(prev => prev ? { ...prev, country: countryName } : null);
    setShowCountryDropdown(false);
    setCountrySearchTerm("");
  }, []);

  // Handle removing uploaded files
  const handleRemoveFile = useCallback((fileType: 'profilePicture' | 'aadhaarDoc') => {
    if (fileType === 'profilePicture') {
      setProfilePicture({ file: null, preview: null });
    } else {
      setAadhaarDoc({ file: null, preview: null });
    }
  }, []);

  // Filter languages based on search term
  const filteredLanguages = languages.filter(lang => 
    lang.name.toLowerCase().includes(languageSearchTerm.toLowerCase()) &&
    !selectedLanguages.includes(lang.name)
  );

  // Filter states based on search term
  const filteredStates = indianStates.filter(state => 
    state.name.toLowerCase().includes(stateSearchTerm.toLowerCase())
  );

  // Filter countries based on search term
  const filteredCountries = countries.filter(country => 
    country.name.toLowerCase().includes(countrySearchTerm.toLowerCase())
  );

  // Generic file upload handler
  const handleFileUpload = useCallback((
    e: React.ChangeEvent<HTMLInputElement>,
    fileType: 'profilePicture' | 'aadhaarDoc'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error("File size should be less than 5MB");
      return;
    }

    // Validate file type based on upload type
    if (fileType === 'profilePicture') {
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file for profile picture");
        return;
      }
    } else if (fileType === 'aadhaarDoc') {
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file for Aadhaar document");
        return;
      }
    }

    // For images, create a preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const previewUrl = reader.result as string;
      
      if (fileType === 'profilePicture') {
        setProfilePicture({ file, preview: previewUrl });
      } else {
        setAadhaarDoc({ file, preview: previewUrl });
      }
    };
    reader.readAsDataURL(file);
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData) {
      toast.error("Form data not available");
      return;
    }

    // Basic validation
    if (!formData.name?.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!formData.phone?.trim()) {
      toast.error("Phone number is required");
      return;
    }

    if (formData.phone && formData.phone.length !== 10) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    if (formData.emergencyContactNumber && formData.emergencyContactNumber.length !== 10) {
      toast.error("Emergency contact number must be exactly 10 digits");
      return;
    }

    try {
      setSubmitting(true);
      
      // Prepare submission data
      const submitData = {
        ...formData,
        profilePictureFile: profilePicture.file,
        aadhaarDocFile: aadhaarDoc.file,
      };

      console.log("Submitting form data:", {
        formData: submitData,
        hasProfilePicture: !!profilePicture.file,
        hasAadhaarDoc: !!aadhaarDoc.file,
      });

      const result = await updateUserData(submitData);

      if (result) {
        toast.success("Personal information updated successfully!");
        // Optional: Navigate after successful save
        // navigate("/role-profile");
        window.location.href = "/role-profile";
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update personal information.");
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-honey mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile data...</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Role: {userRole || "Unknown"} | Email: {userEmail || "Unknown"}
          </p>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">Failed to load profile data</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-honey text-charcoal rounded-lg hover:bg-yellow-500 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-white dark:bg-gray-900 transition-colors duration-300">
      <motion.div
        className="max-w-4xl mx-auto p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-honey to-yellow-500 px-6 py-8">
            <h1 className="text-3xl font-bold text-charcoal">Personal Information</h1>
            <p className="text-charcoal/80 mt-2">
              Manage your personal details and contact information
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Profile Picture Section */}
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                Profile Picture
              </h2>
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 rounded-full border-4 border-honey/20 overflow-hidden bg-gray-100 dark:bg-gray-600 shadow-lg">
                  {profilePicture.preview || formData.profilePicture?.url ? (
                    <img
                      src={profilePicture.preview || formData.profilePicture?.url || ""}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                      <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'profilePicture')}
                    className="hidden"
                    id="profilePicture"
                  />
                  <label
                    htmlFor="profilePicture"
                    className="cursor-pointer bg-honey hover:bg-yellow-500 text-charcoal font-medium rounded-lg px-4 py-2 transition-colors duration-200 shadow-md hover:shadow-lg"
                  >
                    {profilePicture.preview || formData.profilePicture?.url ? 'Change Image' : 'Choose Image'}
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    JPG, PNG up to 5MB
                  </p>
                </div>
              </div>
            </div>

            {/* Basic Information Section */}
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-honey focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email (Read Only)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ""}
                    disabled
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handlePhoneChange}
                    placeholder="Enter 10-digit phone number"
                    maxLength={10}
                    required
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-honey focus:border-transparent transition-all duration-200"
                  />
                  {formData.phone && formData.phone.length < 10 && (
                    <p className="text-red-500 text-xs mt-1">
                      Phone number must be 10 digits ({formData.phone.length}/10)
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob ? formData.dob.split("T")[0] : ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-honey focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-honey focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Languages
                  </label>
                  
                  {/* Selected Languages Display */}
                  <div className="mb-3">
                    {selectedLanguages.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedLanguages.map((language, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-honey text-white"
                          >
                            {language}
                            <button
                              type="button"
                              onClick={() => handleRemoveLanguage(language)}
                              className="ml-1 text-white hover:text-gray-200 focus:outline-none"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-sm">No languages selected</p>
                    )}
                  </div>

                  {/* Language Search and Selection */}
                  <div className="relative">
                    <input
                      type="text"
                      value={languageSearchTerm}
                      onChange={(e) => setLanguageSearchTerm(e.target.value)}
                      onFocus={() => setShowLanguageDropdown(true)}
                      placeholder="Search and add languages..."
                      className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-honey focus:border-transparent transition-all duration-200"
                    />
                    
                    {/* Language Dropdown */}
                    {showLanguageDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {filteredLanguages.length > 0 ? (
                          filteredLanguages.map((language) => (
                            <button
                              key={language.id}
                              type="button"
                              onClick={() => handleAddLanguage(language.name)}
                              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700"
                            >
                              {language.name}
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-gray-500 dark:text-gray-400">
                            {languageSearchTerm ? 'No matching languages found' : 'No more languages available'}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Click outside to close dropdown */}
                  {showLanguageDropdown && (
                    <div
                      className="fixed inset-0 z-5"
                      onClick={() => setShowLanguageDropdown(false)}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Address Information Section */}
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
                Address Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address || ""}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-honey focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-honey focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    State
                  </label>
                  
                  {/* State Search and Selection */}
                  <div className="relative">
                    <input
                      type="text"
                      value={stateSearchTerm || formData.state || ""}
                      onChange={(e) => {
                        setStateSearchTerm(e.target.value);
                        if (!e.target.value) {
                          setFormData(prev => prev ? { ...prev, state: "" } : null);
                        }
                      }}
                      onFocus={() => {
                        setShowStateDropdown(true);
                        setStateSearchTerm(formData.state || "");
                      }}
                      placeholder="Search and select state..."
                      className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-honey focus:border-transparent transition-all duration-200"
                    />
                    
                    {/* State Dropdown */}
                    {showStateDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {filteredStates.length > 0 ? (
                          <>
                            {/* States */}
                            {filteredStates.filter(state => state.type === 'state').length > 0 && (
                              <>
                                <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
                                  States
                                </div>
                                {filteredStates.filter(state => state.type === 'state').map((state) => (
                                  <button
                                    key={state.id}
                                    type="button"
                                    onClick={() => handleStateSelect(state.name)}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700"
                                  >
                                    {state.name}
                                  </button>
                                ))}
                              </>
                            )}
                            
                            {/* Union Territories */}
                            {filteredStates.filter(state => state.type === 'ut').length > 0 && (
                              <>
                                <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
                                  Union Territories
                                </div>
                                {filteredStates.filter(state => state.type === 'ut').map((state) => (
                                  <button
                                    key={state.id}
                                    type="button"
                                    onClick={() => handleStateSelect(state.name)}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700"
                                  >
                                    {state.name}
                                  </button>
                                ))}
                              </>
                            )}
                          </>
                        ) : (
                          <div className="px-4 py-2 text-gray-500 dark:text-gray-400">
                            {stateSearchTerm ? 'No matching states found' : 'No states available'}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Click outside to close dropdown */}
                  {showStateDropdown && (
                    <div
                      className="fixed inset-0 z-5"
                      onClick={() => setShowStateDropdown(false)}
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Country
                  </label>
                  
                  {/* Country Search and Selection */}
                  <div className="relative">
                    <input
                      type="text"
                      value={countrySearchTerm || formData.country || ""}
                      onChange={(e) => {
                        setCountrySearchTerm(e.target.value);
                        if (!e.target.value) {
                          setFormData(prev => prev ? { ...prev, country: "" } : null);
                        }
                      }}
                      onFocus={() => {
                        setShowCountryDropdown(true);
                        setCountrySearchTerm(formData.country || "");
                      }}
                      placeholder="Search and select country..."
                      className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-honey focus:border-transparent transition-all duration-200"
                    />
                    
                    {/* Country Dropdown */}
                    {showCountryDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {filteredCountries.length > 0 ? (
                          filteredCountries.map((country) => (
                            <button
                              key={country.id}
                              type="button"
                              onClick={() => handleCountrySelect(country.name)}
                              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700"
                            >
                              {country.name}
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-gray-500 dark:text-gray-400">
                            {countrySearchTerm ? 'No matching countries found' : 'No countries available'}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Click outside to close dropdown */}
                  {showCountryDropdown && (
                    <div
                      className="fixed inset-0 z-5"
                      onClick={() => setShowCountryDropdown(false)}
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pincode
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode || ""}
                    onChange={handlePincodeChange}
                    placeholder="Enter pincode (numbers only)"
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-honey focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact Section */}
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
                Emergency Contact
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Emergency Contact Person Name
                  </label>
                  <input
                    type="text"
                    name="emergencyContactPersonName"
                    value={formData.emergencyContactPersonName || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-honey focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Emergency Contact Number
                  </label>
                  <input
                    type="tel"
                    name="emergencyContactNumber"
                    value={formData.emergencyContactNumber || ""}
                    onChange={handleEmergencyContactChange}
                    placeholder="Enter 10-digit emergency contact number"
                    maxLength={10}
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-honey focus:border-transparent transition-all duration-200"
                  />
                  {formData.emergencyContactNumber && formData.emergencyContactNumber.length < 10 && formData.emergencyContactNumber.length > 0 && (
                    <p className="text-red-500 text-xs mt-1">
                      Emergency contact number must be 10 digits ({formData.emergencyContactNumber.length}/10)
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Aadhaar Document Section */}
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
                Identity Document
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Aadhaar Document
                </label>
                
                {/* Show existing uploaded document */}
                {(aadhaarDoc.preview || getAadhaarDocUrl()) ? (
                  <div className="space-y-4">
                    {/* Document Status */}
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span className="text-sm font-medium text-green-800 dark:text-green-200">
                          {aadhaarDoc.preview && aadhaarDoc.file ? 'New document selected' : 'Document uploaded'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile('aadhaarDoc')}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>

                    {/* Document Preview */}
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 bg-white dark:bg-gray-800">
                      {/* Show image preview */}
                      <div className="flex items-center justify-center">
                        <img
                          src={aadhaarDoc.preview || getAadhaarDocUrl() || ""}
                          alt="Aadhaar Document"
                          className="max-h-48 rounded-lg border shadow-md"
                        />
                      </div>
                      
                      {/* Action buttons */}
                      <div className="flex gap-3 justify-center mt-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'aadhaarDoc')}
                          className="hidden"
                          id="aadhaarDoc"
                        />
                        <label
                          htmlFor="aadhaarDoc"
                          className="cursor-pointer bg-honey hover:bg-yellow-500 text-charcoal font-medium rounded-lg px-4 py-2 transition-colors duration-200 shadow-md hover:shadow-lg"
                        >
                          {aadhaarDoc.preview && aadhaarDoc.file ? 'Choose Different File' : 'Upload New Document'}
                        </label>
                        
                        {/* View full size button */}
                        <button
                          type="button"
                          onClick={() => window.open(aadhaarDoc.preview || getAadhaarDocUrl() || "", '_blank')}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-4 py-2 transition-colors duration-200 shadow-md hover:shadow-lg"
                        >
                          View Full Size
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Upload new document */
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 bg-white dark:bg-gray-800 transition-colors duration-200">
                    <div className="text-center">
                      <svg
                        className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="mt-6">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'aadhaarDoc')}
                          className="hidden"
                          id="aadhaarDocUpload"
                        />
                        <label
                          htmlFor="aadhaarDocUpload"
                          className="cursor-pointer bg-honey hover:bg-yellow-500 text-charcoal font-medium rounded-lg px-6 py-3 transition-colors duration-200 shadow-md hover:shadow-lg inline-block"
                        >
                          Upload Aadhaar Document
                        </label>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                          JPG, PNG up to 5MB
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          Upload a clear photo or scan of your Aadhaar card
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Account Information (Read Only) */}
            <div className="bg-gray-100 dark:bg-gray-600 p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-6 text-gray-700 dark:text-gray-200">
                Account Information (Read Only)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                  <span className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                    Role
                  </span>
                  <span className="text-lg font-semibold text-gray-800 dark:text-white capitalize">
                    {formData.role}
                  </span>
                </div>
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                  <span className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                    Verified Status
                  </span>
                  <span
                    className={`text-lg font-semibold ${
                      formData.isVerified
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {formData.isVerified ? "Verified" : "Not Verified"}
                  </span>
                </div>
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                  <span className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                    Member Since
                  </span>
                  <span className="text-lg font-semibold text-gray-800 dark:text-white">
                    {new Date(formData.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={submitting}
                className={`px-8 py-4 bg-gradient-to-r from-honey to-yellow-500 hover:from-yellow-500 hover:to-honey text-charcoal font-bold text-lg rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                  submitting ? 'cursor-not-allowed' : ''
                }`}
              >
                {submitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-charcoal"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  'Save & Continue'
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default PersonalInfo;
