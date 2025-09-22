import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserData  } from "../services/operations/authApi";
import {updateHostData} from "../services/operations/hostApi";
import {updateVolunteerData} from "../services/operations/volunteerApi";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { skills } from '../data/skills';
const RoleProfile: React.FC = () => {
  const userEmail = useSelector((state: any) => state.user.email);
  const role = useSelector((state: any) => state.user.role);
  const userToken = useSelector((state: any) => state.user.token);
  const [formData, setFormData] = useState<any>(null);
  const [skillSearch, setSkillSearch] = useState("");
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Function to get user email from various sources
  // const getUserEmail = () => {
  //   // First try Redux state
  //   if (userEmail) return userEmail;
    
  //   // Try to get from localStorage token
  //   try {
  //     const token = localStorage.getItem('token') || userToken;
  //     if (token) {
  //       // Decode JWT token to get user info (basic decode, not verification)
  //       const base64Url = token.split('.')[1];
  //       const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  //       const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
  //         return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  //       }).join(''));
  //       const decoded = JSON.parse(jsonPayload);
  //       return decoded.email;
  //     }
  //   } catch (error) {
  //     console.error('Error decoding token:', error);
  //   }
    
  //   return null;
  // };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Fetching data for email:", userEmail);
        const email=userEmail;
        
        if (!email) {
          console.log("No email found, redirecting to login");
          toast.error("Please log in to access your profile");
          // You might want to redirect to login here
          setLoading(false);
          return;
        }

        console.log("Fetching data for email:111", email);
        const data = await getUserData(email);
        console.log("Raw API Response:", data);
        
        if (data && data.success) {
          const userData = data.data;
          console.log("Processed User Data:", userData);
          console.log("User Role:", userData.role);
          console.log("Has Volunteer Data:", !!userData.volunteer);
          console.log("Has Host Data:", !!userData.host);
          
          // Ensure role-specific data exists or initialize empty objects
          if (!userData.volunteer && (userData.role?.toLowerCase() === 'volunteer')) {
            userData.volunteer = {
              bio: "",
              skills: [],
              socialLinks: { instagram: "", linkedin: "", website: "" },
              achievements: "",
              education: ""
            };
            console.log("Initialized empty volunteer data");
          }
          
          if (!userData.host && (userData.role?.toLowerCase() === 'host')) {
            userData.host = {
              designation: [],
              organizationName: "",
              organizationType: [],
              needOfVolunteer: [],
              businessDocument: "",
              bio: "",
              socialLinks: { instagram: "", linkedin: "", website: "" }
            };
            console.log("Initialized empty host data");
          }
          
          setFormData(userData);
        } else {
          console.error("API Response Error:", data);
          toast.error("Failed to load profile data.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Error loading profile data.");
      } finally {
        setLoading(false);
      }
    };

    // Add a small delay to allow Redux persist to rehydrate
    const timer = setTimeout(fetchData, 100);
    return () => clearTimeout(timer);
  }, [userEmail, userToken]); // Added userToken as dependency

  const handleVolunteerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      volunteer: {
        ...(formData.volunteer || {}),
        [name]: value
      }
    });
  };

  const handleSocialLinksChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      volunteer: {
        ...(formData.volunteer || {}),
        socialLinks: {
          ...(formData.volunteer?.socialLinks || {}),
          [name]: value
        }
      }
    });
  };

  const handleHostChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      host: {
        ...(formData.host || {}),
        [name]: value
      }
    });
  };

  const handleHostSocialLinksChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      host: {
        ...(formData.host || {}),
        socialLinks: {
          ...(formData.host?.socialLinks || {}),
          [name]: value
        }
      }
    });
  };

  const handleNeedOfVolunteerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value && !formData.host?.needOfVolunteer?.includes(value)) {
      const updatedNeeds = [...(formData.host?.needOfVolunteer || []), value];
      setFormData({
        ...formData,
        host: {
          ...(formData.host || {}),
          needOfVolunteer: updatedNeeds
        }
      });
    }
  };

  const removeNeedOfVolunteer = (indexToRemove: number) => {
    const updatedNeeds = formData.host?.needOfVolunteer?.filter((_: string, index: number) => index !== indexToRemove) || [];
    setFormData({
      ...formData,
      host: {
        ...(formData.host || {}),
        needOfVolunteer: updatedNeeds
      }
    });
  };

  const handleDesignationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      host: {
        ...(formData.host || {}),
        designation: value ? [value] : []
      }
    });
  };

  const handleOrganizationTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      host: {
        ...(formData.host || {}),
        organizationType: value ? [value] : []
      }
    });
  };

  // Skills management functions
  const addSkill = (skillName: string) => {
    const newSkill = {
      skillName: skillName,
      proficiencyLevel: "",
      description: "",
      portfolioLink: "",
      yearOfExperience: ""
    };
    
    const updatedSkills = [...(formData.volunteer?.skills || []), newSkill];
    setFormData({
      ...formData,
      volunteer: {
        ...formData.volunteer,
        skills: updatedSkills
      }
    });
    setSkillSearch("");
    setShowSkillDropdown(false);
  };

  const removeSkill = (index: number) => {
    const updatedSkills = formData.volunteer?.skills?.filter((_: any, i: number) => i !== index) || [];
    setFormData({
      ...formData,
      volunteer: {
        ...(formData.volunteer || {}),
        skills: updatedSkills
      }
    });
  };

  const updateSkill = (index: number, field: string, value: string) => {
    const updatedSkills = [...(formData.volunteer?.skills || [])];
    updatedSkills[index] = {
      ...updatedSkills[index],
      [field]: value
    };
    setFormData({
      ...formData,
      volunteer: {
        ...(formData.volunteer || {}),
        skills: updatedSkills
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      console.log("Submitting form data:", formData);
      if(role=='host'){
         await updateHostData(formData.host);
      }
      else if(role=='volunteer'){
         await updateVolunteerData(formData.volunteer);
      }
      // API functions already handle toast messages, so we don't need additional ones here
    } catch (error) {
      console.error("Error updating profile:", error);
      // Only show error toast if API functions didn't handle it
      const axiosError = error as any;
      if (!axiosError?.response) {
        toast.error("Failed to update profile. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!formData || loading) return (
    <div className="min-h-screen pt-16 flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-honey mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">
          {loading ? "Loading profile data..." : "Initializing..."}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
          Role: {role || "Unknown"} | Email: {userEmail  || "Unknown"}
        </p>
      </div>
    </div>
  );

  // Loading state for submission
  if (isSubmitting) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-honey mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Updating profile...</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Please wait while we save your {role === 'volunteer' ? 'volunteer' : 'host'} profile
          </p>
        </div>
      </div>
    );
  }

  const filteredSkills = skills.filter(skill => 
    skill.name.toLowerCase().includes(skillSearch.toLowerCase()) &&
    !(formData?.volunteer?.skills?.some((userSkill: any) => 
      userSkill.skillName.toLowerCase() === skill.name.toLowerCase()
    ))
  );

  return (
    <div className="min-h-screen pt-16 bg-white dark:bg-gray-900 transition-colors duration-300">
      <motion.div 
        className="max-w-4xl mx-auto p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-honey to-yellow-500 px-6 py-8">
            <h1 className="text-3xl font-bold text-charcoal">
              {formData.role === 'volunteer' ? 'Volunteer' : 'Host'} Profile
            </h1>
            <p className="text-charcoal/80 mt-2">Complete your {formData.role} profile information</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
        
        {/* Volunteer Specific Information */}
        {formData.role?.toLowerCase() === 'volunteer' && (
          <>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
              <h2 className="text-xl font-semibold mb-6 text-blue-700 dark:text-blue-300">Volunteer Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.volunteer?.bio || ""}
                    onChange={handleVolunteerChange}
                    rows={4}
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-honey focus:border-transparent transition-all duration-200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Skills</label>
                  
                  {/* Skill Search Input */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search and add skills..."
                      value={skillSearch}
                      onChange={(e) => {
                        setSkillSearch(e.target.value);
                        setShowSkillDropdown(e.target.value.length > 0);
                      }}
                      onFocus={() => setShowSkillDropdown(skillSearch.length > 0)}
                      className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-honey focus:border-transparent transition-all duration-200"
                    />
                    
                    {/* Skills Dropdown */}
                    {showSkillDropdown && filteredSkills.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                        {filteredSkills.slice(0, 10).map((skill) => (
                          <div
                            key={skill.id}
                            className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-white transition-colors duration-150"
                            onClick={() => addSkill(skill.name)}
                          >
                            {skill.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Added Skills List */}
                  {formData.volunteer?.skills && formData.volunteer.skills.length > 0 && (
                    <div className="mt-4 space-y-3">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Added Skills:</h4>
                      {formData.volunteer?.skills?.map((skill: any, index: number) => (
                        <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                          <div className="flex justify-between items-start mb-3">
                            <h5 className="font-medium text-gray-800 dark:text-white">{skill.skillName}</h5>
                            <button
                              type="button"
                              onClick={() => removeSkill(index)}
                              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm transition-colors duration-200"
                            >
                              Remove
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Proficiency Level</label>
                              <select
                                value={skill.proficiencyLevel || ""}
                                onChange={(e) => updateSkill(index, 'proficiencyLevel', e.target.value)}
                                className="w-full text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-honey focus:border-transparent transition-all duration-200"
                              >
                                <option value="">Select Level</option>
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Years of Experience</label>
                              <input
                                type="text"
                                value={skill.yearOfExperience || ""}
                                onChange={(e) => updateSkill(index, 'yearOfExperience', e.target.value)}
                                placeholder="e.g., 2 years"
                                className="w-full text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-honey focus:border-transparent transition-all duration-200"
                              />
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Description</label>
                            <textarea
                              value={skill.description || ""}
                              onChange={(e) => updateSkill(index, 'description', e.target.value)}
                              placeholder="Describe your experience with this skill..."
                              rows={2}
                              className="w-full text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-honey focus:border-transparent transition-all duration-200"
                            />
                          </div>
                          
                          <div className="mt-3">
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Portfolio Link</label>
                            <input
                              type="url"
                              value={skill.portfolioLink || ""}
                              onChange={(e) => updateSkill(index, 'portfolioLink', e.target.value)}
                              placeholder="https://example.com/portfolio"
                              className="w-full text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-honey focus:border-transparent transition-all duration-200"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Achievements</label>
                  <textarea
                    name="achievements"
                    value={formData.volunteer?.achievements || ""}
                    onChange={handleVolunteerChange}
                    rows={3}
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-honey focus:border-transparent transition-all duration-200"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Blood Group</label>
                    <select
                      name="bloodGroup"
                      value={formData.volunteer?.bloodGroup || ""}
                      onChange={handleVolunteerChange}
                      className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-honey focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Portfolio</label>
                    <input
                      type="url"
                      name="portfolio"
                      value={formData.volunteer?.portfolio || ""}
                      onChange={handleVolunteerChange}
                      placeholder="https://yourportfolio.com"
                      className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-honey focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Medical Complications</label>
                  <textarea
                    name="medicalComplication"
                    value={formData.volunteer?.medicalComplication || ""}
                    onChange={handleVolunteerChange}
                    rows={2}
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-honey focus:border-transparent transition-all duration-200"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Smoking Habits</label>
                    <select
                      name="smoke"
                      value={formData.volunteer?.smoke || ""}
                      onChange={handleVolunteerChange}
                      className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-honey focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select</option>
                      <option value="yes">Yes</option>
                      <option value="never">Never</option>
                      <option value="occasionally">Occasionally</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Alcohol Consumption</label>
                    <select
                      name="alcohol"
                      value={formData.volunteer?.alcohol || ""}
                      onChange={handleVolunteerChange}
                      className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-honey focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select</option>
                      <option value="yes">Yes</option>
                      <option value="never">Never</option>
                      <option value="occasionally">Occasionally</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Volunteer Social Links */}
            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
              <h2 className="text-xl font-semibold mb-6 text-green-700 dark:text-green-300">Social Links</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Instagram</label>
                  <input
                    type="url"
                    name="instagram"
                    value={formData.volunteer?.socialLinks?.instagram || ""}
                    onChange={handleSocialLinksChange}
                    placeholder="https://instagram.com/username"
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-honey focus:border-transparent transition-all duration-200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">LinkedIn</label>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.volunteer?.socialLinks?.linkedin || ""}
                    onChange={handleSocialLinksChange}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-honey focus:border-transparent transition-all duration-200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Website</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.volunteer?.socialLinks?.website || ""}
                    onChange={handleSocialLinksChange}
                    placeholder="https://yourwebsite.com"
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-honey focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Host Specific Information */}
        {formData.role?.toLowerCase() === 'host' && (
          <>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
              <h2 className="text-xl font-semibold mb-6 text-purple-700 dark:text-purple-300">Host Organization Information</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Organization Name</label>
                    <input
                      type="text"
                      name="organizationName"
                      value={formData.host?.organizationName || ""}
                      onChange={handleHostChange}
                      className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-honey focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Designation</label>
                    <select
                      name="designation"
                      value={formData.host?.designation?.[0] || ""}
                      onChange={handleDesignationChange}
                      className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-honey focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select Designation</option>
                      <option value="owner">Owner</option>
                      <option value="partner">Partner</option>
                      <option value="manager">Manager</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Organization Type</label>
                  <select
                    name="organizationType"
                    value={formData.host?.organizationType?.[0] || ""}
                    onChange={handleOrganizationTypeChange}
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-honey focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select Organization Type</option>
                    <option value="Non-profit">Non-profit</option>
                    <option value="corporate">Corporate</option>
                    <option value="government org">Government Organization</option>
                    <option value="startup">Startup</option>
                    <option value="business">Business</option>
                    <option value="ngo">NGO</option>
                    <option value="initiative">Initiative</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.host?.bio || ""}
                    onChange={handleHostChange}
                    rows={4}
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-honey focus:border-transparent transition-all duration-200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Need of Volunteers</label>
                  
                  {/* Dropdown to add needs */}
                  <select
                    value=""
                    onChange={handleNeedOfVolunteerChange}
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-honey focus:border-transparent transition-all duration-200 mb-3"
                  >
                    <option value="">Select a need...</option>
                    <option value="To grow my business">To grow my business</option>
                    <option value="To replace my staff">To replace my staff</option>
                    <option value="To curate a good experience">To curate a good experience</option>
                    <option value="To learn different skill">To learn different skill</option>
                    <option value="For cultural exchange & meaningful connections">For cultural exchange & meaningful connections</option>
                    <option value="To build a community">To build a community</option>
                    <option value="To get more volunteers">To get more volunteers</option>
                    <option value="Other">Other</option>
                  </select>
                  
                  {/* Display selected needs */}
                  {formData.host?.needOfVolunteer && formData.host.needOfVolunteer.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Selected Needs:</h4>
                      <div className="flex flex-wrap gap-2">
                        {formData.host?.needOfVolunteer?.map((need: string, index: number) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-honey/20 text-charcoal dark:bg-honey/30 dark:text-white"
                          >
                            {need}
                            <button
                              type="button"
                              onClick={() => removeNeedOfVolunteer(index)}
                              className="ml-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Business Document</label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    {/* Check if businessDocument exists - it can be a string URL or an object */}
                    {(formData.host?.businessDocument && 
                      (typeof formData.host.businessDocument === 'string' || 
                       formData.host?.businessDocument?.preview || 
                       formData.host?.businessDocument?.url)) ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-center">
                          <img
                            src={
                              typeof formData.host.businessDocument === 'string' 
                                ? formData.host.businessDocument 
                                : (formData.host?.businessDocument?.preview || formData.host?.businessDocument?.url)
                            }
                            alt="Business Document"
                            className="max-h-40 rounded border border-gray-300 dark:border-gray-600"
                            onError={(e) => {
                              console.error('Error loading business document image');
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            Current Business Document
                          </p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setFormData({
                                    ...formData,
                                    host: {
                                      ...formData.host,
                                      businessDocument: {
                                        file: file,
                                        preview: reader.result as string,
                                        url: reader.result as string
                                      }
                                    }
                                  });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                            id="businessDocument"
                          />
                          <label
                            htmlFor="businessDocument"
                            className="cursor-pointer bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                          >
                            Change Document
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="mt-4">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setFormData({
                                    ...formData,
                                    host: {
                                      ...formData.host,
                                      businessDocument: {
                                        file: file,
                                        preview: reader.result as string,
                                        url: reader.result as string
                                      }
                                    }
                                  });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                            id="businessDocument"
                          />
                          <label
                            htmlFor="businessDocument"
                            className="cursor-pointer bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-honey transition-colors duration-200"
                          >
                            Upload Business Document
                          </label>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">JPG, PNG up to 5MB</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Host Social Links */}
            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
              <h2 className="text-xl font-semibold mb-6 text-green-700 dark:text-green-300">Social Links</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Instagram</label>
                  <input
                    type="url"
                    name="instagram"
                    value={formData.host?.socialLinks?.instagram || ""}
                    onChange={handleHostSocialLinksChange}
                    placeholder="https://instagram.com/username"
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-honey focus:border-transparent transition-all duration-200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">LinkedIn</label>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.host?.socialLinks?.linkedin || ""}
                    onChange={handleHostSocialLinksChange}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-honey focus:border-transparent transition-all duration-200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Website</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.host?.socialLinks?.website || ""}
                    onChange={handleHostSocialLinksChange}
                    placeholder="https://yourwebsite.com"
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-honey focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Host Statistics */}
            <div className="bg-gray-100 dark:bg-gray-600 p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-6 text-gray-700 dark:text-gray-200">Host Statistics (Read Only)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                  <span className="block text-sm font-medium text-gray-600 dark:text-gray-400">Opportunities Posted</span> 
                  <span className="text-lg font-semibold text-gray-800 dark:text-white">
                    {formData.host?.opportunitiesPosted?.length || 0}
                  </span>
                </div>
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                  <span className="block text-sm font-medium text-gray-600 dark:text-gray-400">Reviews</span> 
                  <span className="text-lg font-semibold text-gray-800 dark:text-white">
                    {formData.host?.reviews?.length || 0}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="flex gap-6 pt-4">
          <button
            type="button"
            onClick={() => window.location.href = '/personal-info'}
            className="flex-1 px-6 py-4 bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Edit Personal Information
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 px-6 py-4 bg-gradient-to-r from-honey to-yellow-500 hover:from-yellow-500 hover:to-honey text-charcoal font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
              isSubmitting ? 'cursor-not-allowed' : ''
            }`}
          >
            Save {formData.role === 'volunteer' ? 'Volunteer' : 'Host'} Profile
          </button>
        </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default RoleProfile;
