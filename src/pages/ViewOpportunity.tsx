import React, { useState, useEffect, useCallback } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Star,
  Clock,
  Users,
  Heart,
  Share2,
  Calendar,
  CheckCircle,
  AlertCircle,
  User,
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
} from "lucide-react";
import { getOpportunityById } from "../services/operations/opportunityApi";

interface OpportunityData {
  _id: string;
  title: string;
  description?: string;
  district: string;
  state: string;
  host:
    | {
        _id: string;
        user: {
          _id: string;
          profilePicture?: {
            url: string;
            asset_id: string;
            public_id: string;
          };
        };
        designation: string[];
        organizationName: string;
        organizationType: string[];
        needOfVolunteer: string[];
        bio: string;
        opportunitiesPosted: string[];
      }
    | string;
  images: Array<{
    url: string;
    asset_id: string;
    public_id: string;
    _id: string;
  }>;
  skills: string[];
  minimumDuration: number;
  maximumDuration: number | null;
  volunteerIn?: string;
  propertyName?: string;
  propertyType?: string[];
  volunteerNeeded?: number;
  safeForFemale?: boolean;
  location?: string;
  roomType?: string[];
  meals?: string;
  amenities?: string[];
  transport?: string[];
  workingHours?: number;
  daysOff?: number;
  expectations?: string;
  aboutLocation?: string;
  rating?: number;
  reviews?: number;
  totalReviews?: number;
  // Add other fields as needed
  [key: string]: any;
}

const ViewOpportunity: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  // const [isLiked, setIsLiked] = useState(false);
  const [opportunity, setOpportunity] = useState<OpportunityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Image slider states
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  // Get opportunity data from navigation state if available
  const passedOpportunityData = location.state?.opportunityData;
  // console.log('Passed opportunity data from navigation state:', passedOpportunityData);
  console.log("Opportunity from api:", opportunity);
  useEffect(() => {
    const loadOpportunityData = async () => {
      // If we have data passed from navigation, use it
      if (passedOpportunityData) {
        setOpportunity(passedOpportunityData);
        return;
      }

      // Otherwise, fetch from API
      if (id) {
        setLoading(true);
        setError(null);
        try {
          const response = await getOpportunityById(id);
          if (response?.success && response?.opportunity) {
            setOpportunity(response.opportunity);
          } else {
            setError("Opportunity not found");
          }
        } catch (error) {
          console.error("Error fetching opportunity:", error);
          setError("Failed to load opportunity details");
        } finally {
          setLoading(false);
        }
      }
    };

    loadOpportunityData();
  }, [id, passedOpportunityData]);

  // Image slider functions (hooks must be declared before any early returns)
  const nextImage = useCallback(() => {
    if (opportunity?.images) {
      setCurrentImageIndex((prev) =>
        prev === opportunity.images.length - 1 ? 0 : prev + 1
      );
    }
  }, [opportunity?.images]);

  const prevImage = useCallback(() => {
    if (opportunity?.images) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? opportunity.images.length - 1 : prev - 1
      );
    }
  }, [opportunity?.images]);

  const openModal = useCallback((imageIndex: number) => {
    setModalImageIndex(imageIndex);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const nextModalImage = useCallback(() => {
    if (opportunity?.images) {
      setModalImageIndex((prev) =>
        prev === opportunity.images.length - 1 ? 0 : prev + 1
      );
    }
  }, [opportunity?.images]);

  const prevModalImage = useCallback(() => {
    if (opportunity?.images) {
      setModalImageIndex((prev) =>
        prev === 0 ? opportunity.images.length - 1 : prev - 1
      );
    }
  }, [opportunity?.images]);

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isModalOpen) {
        if (e.key === "ArrowLeft") {
          prevModalImage();
        } else if (e.key === "ArrowRight") {
          nextModalImage();
        } else if (e.key === "Escape") {
          closeModal();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isModalOpen, prevModalImage, nextModalImage, closeModal]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-honey"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Loading opportunity details...
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <Link
            to="/opportunities"
            className="inline-flex items-center px-4 py-2 bg-honey hover:bg-yellow-500 text-charcoal font-semibold rounded-lg transition-colors"
          >
            Back to Opportunities
          </Link>
        </div>
      </div>
    );
  }

  // Show message if no opportunity data
  if (!opportunity) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-gray-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Opportunity not found
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            The opportunity you're looking for doesn't exist or has been
            removed.
          </p>
          <Link
            to="/opportunities"
            className="inline-flex items-center px-4 py-2 bg-honey hover:bg-yellow-500 text-charcoal font-semibold rounded-lg transition-colors"
          >
            Back to Opportunities
          </Link>
        </div>
      </div>
    );
  }

  // Format duration helper function
  const formatDuration = () => {
    if (opportunity?.maximumDuration) {
      return `${opportunity.minimumDuration}-${opportunity.maximumDuration} weeks`;
    }
    return `${opportunity?.minimumDuration || 0}+ weeks`;
  };

  // Helper function to get host name
  const getHostName = () => {
    if (typeof opportunity?.host === "object") {
      return opportunity.host.organizationName || "Host Organization";
    }
    return opportunity?.host || "Unknown Host";
  };

  // Helper function to get host profile picture
  const getHostProfilePicture = () => {
    if (
      typeof opportunity?.host === "object" &&
      opportunity.host.user?.profilePicture?.url
    ) {
      return opportunity.host.user.profilePicture.url;
    }
    return null;
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  // Note: If you re-enable animated review list, you can restore a stagger container here.

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Image Slider */}
      <motion.div
        className="relative h-96 overflow-hidden bg-gray-100 dark:bg-gray-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Main Image */}
        <div className="relative w-full h-full">
          {/* Themed blurred backdrop to match site and preserve composition */}
          <div
            className="absolute inset-0 bg-center bg-cover blur-2xl opacity-50 -z-10"
            style={{
              backgroundImage: `url(${
                opportunity.images?.[currentImageIndex]?.url || ""
              })`,
            }}
          />
          <img
            src={
              opportunity.images?.[currentImageIndex]?.url ||
              "/api/placeholder/400/300"
            }
            alt={`${opportunity.title} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-contain object-center cursor-pointer"
            onClick={() => openModal(currentImageIndex)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 dark:from-black/40 via-transparent to-transparent pointer-events-none" />

          {/* Image Counter */}
          <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
            {currentImageIndex + 1} / {opportunity.images?.length || 0}
          </div>

          {/* Zoom Icon */}
          <button
            onClick={() => openModal(currentImageIndex)}
            className="absolute top-4 right-20 p-2 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-colors"
          >
            <ZoomIn className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Arrows */}
        {opportunity.images && opportunity.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Image Thumbnails */}
        {opportunity.images && opportunity.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {opportunity.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentImageIndex
                    ? "bg-white scale-125"
                    : "bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        )}

        {/* Floating Action Buttons */}
        {/* <div className="absolute top-6 right-6 flex space-x-3">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-3 rounded-full backdrop-blur-md transition-all ${
              isLiked
                ? "bg-red-500 text-white"
                : "bg-white/90 text-gray-700 hover:bg-white"
            }`}
          >
            <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
          </button>
          <button className="p-3 bg-white/90 hover:bg-white text-gray-700 rounded-full backdrop-blur-md transition-colors">
            <Share2 className="h-5 w-5" />
          </button>
        </div> */}

        {/* Title Overlay */}
        <div className="absolute bottom-6 left-6 right-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {opportunity.title}
          </h1>
          <div className="flex items-center text-white/90">
            <MapPin className="h-5 w-5 mr-2" />
            <span className="text-lg">
              {opportunity.district}, {opportunity.state}
            </span>
          </div>
        </div>
      </motion.div>
      {/* <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        variants={fadeInUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <h3 className="text-xl font-semibold text-charcoal dark:text-white mb-6">
          Photo Gallery ({opportunity.images.length} photos)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {opportunity.images.map((image, index) => (
            <motion.div
              key={image._id || index}
              className="relative group cursor-pointer overflow-hidden rounded-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              onClick={() => openModal(index)}
            >
              <img
                src={image.url}
                alt={`${opportunity.title} - Photo ${index + 1}`}
                className="w-full h-32 object-cover transition-transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <ZoomIn className="text-white h-6 w-6" />
              </div>
              
              <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold text-charcoal dark:text-white mb-4">
                About This Opportunity
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                {opportunity.description ||
                  "No description available for this opportunity."}
              </p>

              {opportunity.volunteerIn && (
                <div className="mb-6 p-4 bg-teal/10 rounded-lg">
                  <h4 className="font-medium text-teal mb-2">
                    You'll be volunteering in:
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 capitalize">
                    {opportunity.volunteerIn}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-charcoal dark:text-white mb-3">
                    Duration & Requirements
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{formatDuration()}</span>
                    </div>
                    {opportunity.workingHours && (
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{opportunity.workingHours} hours/day</span>
                      </div>
                    )}
                    {opportunity.daysOff !== undefined && (
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{opportunity.daysOff} days off per week</span>
                      </div>
                    )}
                    {opportunity.volunteerNeeded && (
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Users className="h-4 w-4 mr-2" />
                        <span>
                          {opportunity.volunteerNeeded} volunteers needed
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Skills Required:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {opportunity.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-teal/20 text-teal rounded-md text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-charcoal dark:text-white mb-3">
                    Location & Property
                  </h4>
                  <div className="space-y-2 text-gray-600 dark:text-gray-300">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-honey mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        {opportunity.district}, {opportunity.state}
                      </span>
                    </div>
                    {opportunity.propertyName && (
                      <div className="flex items-start">
                        <Users className="h-5 w-5 text-honey mr-2 mt-0.5 flex-shrink-0" />
                        <span>Property: {opportunity.propertyName}</span>
                      </div>
                    )}
                    {opportunity.propertyType &&
                      opportunity.propertyType.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            Property Type:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {opportunity.propertyType.map((type, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue/20 text-blue-700 dark:text-blue-300 rounded-md text-xs"
                              >
                                {type}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    {opportunity.safeForFemale && (
                      <div className="flex items-center mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                        <span className="text-sm text-green-700 dark:text-green-300">
                          Safe for female volunteers
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Accommodation & What's Included */}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold text-charcoal dark:text-white mb-6">
                Accommodation & What's Included
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Accommodation */}
                <div>
                  <h4 className="font-medium text-charcoal dark:text-white mb-3 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-teal" />
                    Accommodation
                  </h4>
                  <div className="space-y-2">
                    {opportunity.roomType &&
                      opportunity.roomType.map((room, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {room}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Meals */}
                <div>
                  <h4 className="font-medium text-charcoal dark:text-white mb-3 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-teal" />
                    Meals
                  </h4>
                  <div className="space-y-2">
                    {opportunity.meals && (
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {opportunity.meals}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <h4 className="font-medium text-charcoal dark:text-white mb-3 flex items-center">
                    <Star className="h-5 w-5 mr-2 text-teal" />
                    Amenities
                  </h4>
                  <div className="space-y-2">
                    {opportunity.amenities &&
                      opportunity.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {amenity}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Transport */}
              {/* {opportunity.transport && opportunity.transport.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium text-charcoal dark:text-white mb-3 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-teal" />
                    Transportation
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {opportunity.transport.map((transport, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-full text-sm"
                      >
                        {transport}
                      </span>
                    ))}
                  </div>
                </div>
              )} */}
            </motion.div>

            {/* Location & Expectations */}
            {(opportunity.aboutLocation || opportunity.expectations) && (
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-semibold text-charcoal dark:text-white mb-6">
                  Additional Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {opportunity.aboutLocation && (
                    <div>
                      <h4 className="font-medium text-charcoal dark:text-white mb-3">
                        About the Location
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        {opportunity.aboutLocation}
                      </p>
                    </div>
                  )}
                  {opportunity.expectations && (
                    <div>
                      <h4 className="font-medium text-charcoal dark:text-white mb-3">
                        What We Expect
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        {opportunity.expectations}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Additional Information */}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold text-charcoal dark:text-white mb-6">
                Opportunity Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <Users className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-green-700 dark:text-green-300">
                      Community Experience
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span className="text-sm text-blue-700 dark:text-blue-300">
                      Flexible Schedule
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                    <Heart className="h-5 w-5 text-purple-600" />
                    <span className="text-sm text-purple-700 dark:text-purple-300">
                      Meaningful Impact
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                    <Star className="h-5 w-5 text-orange-600" />
                    <span className="text-sm text-orange-700 dark:text-orange-300">
                      Skill Development
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            
            {/* Host Info */}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-honey/20 flex items-center justify-center">
                    {getHostProfilePicture() ? (
                      <img
                        src={getHostProfilePicture()!}
                        alt="Host"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 text-honey" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-semibold text-charcoal dark:text-white">
                        {getHostName()}
                      </h3>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span>{opportunity.rating || "New host"}</span>
                      </div>
                      <span>Host since 2025</span>
                    </div>
                    {typeof opportunity.host === "object" &&
                      opportunity.host.organizationType &&
                      opportunity.host.organizationType.length > 0 && (
                        <div className="mt-1">
                          <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                            {opportunity.host.organizationType.join(", ")}
                          </span>
                        </div>
                      )}
                  </div>
                </div>
                {/* <Link
                  to={`/host/${encodeURIComponent(getHostName())
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  className="px-4 py-2 border border-teal text-teal hover:bg-teal hover:text-white rounded-lg transition-colors"
                >
                  View Profile
                </Link> */}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg sticky top-24"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-charcoal dark:text-white mb-2">
                  Free Stay
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Accommodation & meals included
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-600 dark:text-gray-300">
                      Duration
                    </span>
                  </div>
                  <span className="font-medium text-charcoal dark:text-white">
                    {formatDuration()}
                  </span>
                </div>

                {opportunity.volunteerNeeded && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-gray-600 dark:text-gray-300">
                        Volunteers Needed
                      </span>
                    </div>
                    <span className="font-medium text-charcoal dark:text-white">
                      {opportunity.volunteerNeeded}
                    </span>
                  </div>
                )}

                {opportunity.workingHours && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-gray-600 dark:text-gray-300">
                        Work Hours/Day
                      </span>
                    </div>
                    <span className="font-medium text-charcoal dark:text-white text-sm">
                      {opportunity.workingHours} hours
                    </span>
                  </div>
                )}

                {opportunity.daysOff !== undefined && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-gray-600 dark:text-gray-300">
                        Days Off/Week
                      </span>
                    </div>
                    <span className="font-medium text-charcoal dark:text-white text-sm">
                      {opportunity.daysOff} days
                    </span>
                  </div>
                )}
              </div>

              <Link
                to={`/apply/${opportunity._id}`}
                className="w-full block text-center px-6 py-4 bg-honey hover:bg-yellow-500 text-charcoal font-semibold rounded-xl transition-all transform hover:scale-105 mb-4"
              >
                Apply Now
              </Link>

              {/* <button className="w-full px-6 py-3 border border-teal text-teal hover:bg-teal hover:text-white rounded-xl transition-colors">
                Contact Host
              </button> */}

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-medium text-charcoal dark:text-white mb-3">
                  What's Included
                </h4>
                <div className="space-y-2 text-sm">
                  {opportunity.roomType &&
                    opportunity.roomType.map((room, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-gray-600 dark:text-gray-300">
                          {room}
                        </span>
                      </div>
                    ))}
                  {opportunity.meals && (
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-gray-600 dark:text-gray-300">
                        {opportunity.meals}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-gray-600 dark:text-gray-300">
                      Cultural immersion experience
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-gray-600 dark:text-gray-300">
                      Local guidance and support
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Skills Needed */}
            {/* <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <h4 className="font-medium text-charcoal dark:text-white mb-3">
                Skills You'll Learn
              </h4>
              <div className="flex flex-wrap gap-2">
                {opportunity.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-teal/10 text-teal rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div> */}
          </div>
        </div>
      </div>

      {/* Full Screen Image Modal */}
      <AnimatePresence>
        {isModalOpen && opportunity?.images && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            onClick={closeModal}
          >
            {/* Modal Content */}
            <div className="relative w-full h-full flex items-center justify-center p-4">
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-colors z-10"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Image Counter */}
              <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm z-10">
                {modalImageIndex + 1} / {opportunity.images.length}
              </div>

              {/* Main Image */}
              <motion.img
                key={modalImageIndex}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={opportunity.images[modalImageIndex]?.url}
                alt={`${opportunity.title} - Image ${modalImageIndex + 1}`}
                className="max-w-full max-h-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />

              {/* Navigation Arrows */}
              {opportunity.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevModalImage();
                    }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextModalImage();
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight className="h-8 w-8" />
                  </button>
                </>
              )}

              {/* Thumbnail Navigation */}
              {opportunity.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 max-w-full overflow-x-auto px-4">
                  {opportunity.images.map((image, index) => (
                    <button
                      key={image._id || index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalImageIndex(index);
                      }}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        index === modalImageIndex
                          ? "border-white scale-110"
                          : "border-white/30 hover:border-white/60"
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Instructions */}
              <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-white/70 text-sm text-center">
                <p>Use arrow keys to navigate • Press ESC to close</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ViewOpportunity;
