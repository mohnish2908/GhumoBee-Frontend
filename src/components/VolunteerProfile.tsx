import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Star, Edit, LogOut, Award } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/operations/authApi";
import { format } from "date-fns";

const VolunteerProfile: React.FC = () => {
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log("user in volunteer profile", user);

  const [activeTab, setActiveTab] = useState("profile");

  const handleLogout = async () => {
    await (dispatch as any)(logout());
    navigate("/login");
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mb-8"
        variants={fadeInUp}
        initial="initial"
        animate="animate"
      >
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="w-32 h-32 rounded-full overflow-hidden">
            <img
              src={
                user?.profilePicture ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-charcoal dark:text-white mb-2">
              {user?.name || "Unnamed"}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              {user?.email}
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-2 capitalize">
              Role: {user?.role}
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              {user?.city?.trim() || user?.state?.trim()
                ? [user.city, user.state].filter(Boolean).join(", ")
                : "Location not set"}
            </p>
            <p
              className={`text-sm font-medium ${
                user?.isVerified ? "text-green-600" : "text-red-600"
              }`}
            >
              {user?.isVerified ? "Verified" : "Not Verified"}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              className="flex items-center px-6 py-3 bg-honey hover:bg-yellow-500 text-charcoal font-semibold rounded-lg transition-colors"
              onClick={() => navigate("/personal-info")}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
            <button
              className="flex items-center px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div
        className="flex space-x-1 mb-8 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl"
        variants={fadeInUp}
        initial="initial"
        animate="animate"
      >
        {/* UPDATED: Removed 'experiences' and 'reviews' */}
        {["profile", "applications"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all capitalize ${
              activeTab === tab
                ? "bg-white dark:bg-gray-800 text-charcoal dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:text-charcoal dark:hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </motion.div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === "profile" && (
          // UPDATED: Grid layout now puts cards side-by-side on large screens
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Card 1: Skills & Expertise */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-charcoal dark:text-white mb-6">
                Skills & Expertise
              </h3>
              {user?.skills && user.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2 mb-6">
                  {user.skills.map((skill: any) => (
                    <span
                      key={skill._id}
                      className="px-3 py-1 bg-honey/20 text-honey-dark rounded-full text-sm font-medium"
                    >
                      {skill.skillName}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  No skills have been added yet.
                </p>
              )}
            </div>

            {/* Card 2: Membership Details */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-charcoal dark:text-white mb-6 flex items-center">
                <Award className="h-5 w-5 mr-2 text-honey" />
                Membership Details
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-charcoal dark:text-white mb-1">
                    Subscription Plan
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {user?.subscriptionPlan || "No active plan"}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-charcoal dark:text-white mb-1">
                    Expires On
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {user?.membershipExpiresAt
                      ? format(new Date(user.membershipExpiresAt), "MMMM d, yyyy")
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* REMOVED: 'experiences' tab content */}

        {activeTab === "applications" && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-charcoal dark:text-white mb-6">
              Current Applications
            </h3>
            <div className="space-y-4">
              {[
                {
                  title: "Wildlife Conservation Assistant",
                  location: "Cape Town, South Africa",
                  host: "Green Earth Foundation",
                  status: "Under Review",
                  appliedDate: "Dec 15, 2024",
                },
                {
                  title: "Art Workshop Facilitator",
                  location: "Marrakech, Morocco",
                  host: "Cultural Arts Center",
                  status: "Accepted",
                  appliedDate: "Dec 10, 2024",
                },
              ].map((application, index) => (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-gray-700 rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-charcoal dark:text-white">
                      {application.title}
                    </h4>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        application.status === "Accepted"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {application.status}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">
                      {application.location} • {application.host}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Applied on {application.appliedDate}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REMOVED: 'reviews' tab content */}
      </motion.div>
    </div>
  );
};

export default VolunteerProfile;