import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, Camera, Check, X, ImageIcon } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { amenities } from "../data/amenities";
import { propertyTypes } from "../data/propertyTypes";
import { roomTypes } from "../data/roomTypes";
import { mealOptions } from "../data/meals";
import { skills } from "../data/skills";
import { indianStates } from "../data/states";
import { transportOptions } from "../data/transport";
import {
  createOpportunity,
  getOpportunityById,
} from "../services/operations/opportunityApi";
import { Link } from "react-router-dom";
import { AppDispatch } from "../store/store";
import { updateOpportunityData } from "../slices/opportunitySlice";

// import { use } from 'framer-motion/client';

interface ImageData {
  asset_id?: string;
  public_id?: string;
  url: string;
  file?: File; // For newly uploaded images
  isExisting?: boolean; // To differentiate between existing and new images
}

const CreateOpportunity: React.FC = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const editId = searchParams.get("edit");
  const isEditMode = !!editId;

  console.log("Edit ID:", editId);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    volunteerIn: "",
    state: "",
    district: "",
    propertyName: "",
    propertyAddress: "",
    propertyType: [] as string[],
    businessLink: "",
    volunteerNeeded: 1,
    safeForFemale: true,
    location: "",
    roomType: [] as string[],
    meals: "", // Changed from array to single string
    amenities: [] as string[],
    transport: [] as string[],
    workingHours: 0,
    daysOff: 0,
    minimumDuration: 1,
    maximumDuration: null as number | null,
    skills: [] as string[],
    expectations: "",
    aboutLocation: "",
    isActive: true,
  });

  // Fetch existing opportunity data if in edit mode
  useEffect(() => {
    if (isEditMode && editId) {
      const fetchOpportunity = async () => {
        try {
          setIsLoadingData(true);
          const response = await getOpportunityById(editId);
          console.log("Fetched opportunity data:", response);

          if (response && response.opportunity) {
            const data = response.opportunity;

            // Populate form with existing data
            setFormData({
              title: data.title || "",
              description: data.description || "",
              volunteerIn: data.volunteerIn || "",
              state: data.state || "",
              district: data.district || "",
              propertyName: data.propertyName || "",
              propertyAddress: data.propertyAddress || "",
              propertyType: data.propertyType || [],
              businessLink: data.businessLink || "",
              volunteerNeeded: data.volunteerNeeded || 1,
              safeForFemale: data.safeForFemale || true,
              location: data.location || "",
              roomType: data.roomType || [],
              meals: data.meals || "",
              amenities: data.amenities || [],
              transport: data.transport || [],
              workingHours: data.workingHours || 0,
              daysOff: data.daysOff || 0,
              minimumDuration: data.minimumDuration || 1,
              maximumDuration: data.maximumDuration,
              skills: data.skills || [],
              expectations: data.expectations || "",
              aboutLocation: data.aboutLocation || "",
              isActive: data.isActive !== undefined ? data.isActive : true,
            });

            // Set existing images if any
            if (data.images && Array.isArray(data.images)) {
              setImages(
                data.images.map((img: any) => ({
                  url: img.url || img,
                  isExisting: true,
                  public_id: img.public_id,
                  asset_id: img.asset_id,
                }))
              );
            }
          }
        } catch (error) {
          console.error("Error fetching opportunity:", error);
          toast.error("Failed to load opportunity data");
        } finally {
          setIsLoadingData(false);
        }
      };

      fetchOpportunity();
    }
  }, [isEditMode, editId]);

  const [images, setImages] = useState<ImageData[]>([]);
  const [newlyUploadedImages, setNewlyUploadedImages] = useState<ImageData[]>(
    []
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(isEditMode && !!editId);
  const [showAllSkills, setShowAllSkills] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate image requirements (min 1, max 3)
    const totalImages = images.length + newlyUploadedImages.length;
    if (totalImages < 1) {
      alert("Please upload at least 1 image");
      return;
    }
    if (totalImages > 3) {
      alert("Maximum 3 images allowed");
      return;
    }

    setIsSubmitting(true);

    try {
      // Handle form submission
      const submissionData = {
        ...formData,
        existingImages: images.filter((img) => img.isExisting),
        newImages: newlyUploadedImages,
      };

      if (isEditMode && editId) {
        console.log("Updating opportunity:", submissionData);
        try {
          await dispatch(
            updateOpportunityData({ id: editId, data: submissionData })
          ).unwrap();
          toast.success("Opportunity updated successfully!");
          setIsSubmitted(true);
        } catch (error: any) {
          console.error("Update error:", error);
          toast.error(error.message || "Failed to update opportunity");
        }
      } else {
        console.log("Creating opportunity:", submissionData);
        try {
          const response = await createOpportunity(submissionData);
          if (response) {
            toast.success("Opportunity created successfully!");
            setIsSubmitted(true);
          }
        } catch (error: any) {
          console.error("Create error:", error);
          toast.error(error.message || "Failed to create opportunity");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? 0 : parseInt(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const toggleArrayValue = (
    arrayName: keyof typeof formData,
    value: string
  ) => {
    setFormData((prev) => {
      const currentArray = prev[arrayName] as string[];
      return {
        ...prev,
        [arrayName]: currentArray.includes(value)
          ? currentArray.filter((item) => item !== value)
          : [...currentArray, value],
      };
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = images.length + newlyUploadedImages.length;

    if (totalImages + files.length > 3) {
      alert("Maximum 3 images allowed");
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImage: ImageData = {
          url: event.target?.result as string,
          file: file,
          isExisting: false,
        };
        setNewlyUploadedImages((prev) => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number, isNewlyUploaded: boolean) => {
    if (isNewlyUploaded) {
      setNewlyUploadedImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      setImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const availableSkills = skills.map((skill) => skill.name);

  const allImages = [...images, ...newlyUploadedImages];

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <motion.div
          className="max-w-md mx-auto text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-charcoal dark:text-white mb-4">
              Opportunity Published!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Your volunteer opportunity has been successfully created and is
              now live on GhumoBee. Volunteers can start applying immediately.
            </p>
            <div className="space-y-3">
              {/* <button 
                onClick={() => setIsSubmitted(false)}
                className="w-full px-6 py-3 bg-honey hover:bg-yellow-500 text-charcoal font-semibold rounded-lg transition-colors"
              >
                Create Another Opportunity
              </button> */}
              <button className="w-full px-6 py-3 border border-teal text-teal hover:bg-teal hover:text-white rounded-lg transition-colors">
                <Link to="/profile">View My Listings</Link>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Loading state for fetching data in edit mode
  if (isLoadingData) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-honey mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading opportunity data...
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Please wait while we fetch the opportunity details
          </p>
        </div>
      </div>
    );
  }

  // Loading state for submission
  if (isSubmitting) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-honey mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            {isEditMode
              ? "Updating opportunity..."
              : "Publishing opportunity..."}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Please wait while we {isEditMode ? "update" : "create"} your
            opportunity
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <motion.section
        className="bg-gradient-to-r from-honey/20 to-teal/20 dark:from-honey/10 dark:to-teal/10 py-12"
        initial="initial"
        animate="animate"
        variants={fadeInUp}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-charcoal dark:text-white mb-4">
            {isEditMode
              ? "Edit Volunteer Opportunity"
              : "Create Volunteer Opportunity"}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            {isEditMode
              ? "Update your volunteer opportunity details"
              : "Share your space and culture with volunteers from around the world"}
          </p>
        </div>
      </motion.section>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          {/* Basic Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-charcoal dark:text-white mb-6">
              Basic Information
            </h2>

            {/* Opportunity Status Toggle - Add this at the top */}
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-charcoal dark:text-white mb-1">
                    Opportunity Status
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formData.isActive
                      ? "This opportunity is active and volunteers can see and apply to it"
                      : "This opportunity is inactive and volunteers cannot see or apply to it"}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`text-sm font-medium ${
                      formData.isActive
                        ? "text-gray-500"
                        : "text-charcoal dark:text-white"
                    }`}
                  >
                    Inactive
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        isActive: !prev.isActive,
                      }))
                    }
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-honey focus:ring-offset-2 ${
                      formData.isActive
                        ? "bg-green-500"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                        formData.isActive ? "translate-x-7" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span
                    className={`text-sm font-medium ${
                      formData.isActive ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    Active
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* <div>
                <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">
                  Opportunity Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-honey focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., "
                />
              </div> */}

              <div>
                <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">
                  Volunteers Needed *
                </label>
                <input
                  type="number"
                  name="volunteerNeeded"
                  value={formData.volunteerNeeded}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-honey focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                  placeholder="Number of volunteers needed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">
                  State *
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-honey focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select state</option>
                  {indianStates.map((state) => (
                    <option key={state.id} value={state.name}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">
                  District
                </label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-honey focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                  placeholder="District name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">
                  Property Name
                </label>
                <input
                  type="text"
                  name="propertyName"
                  value={formData.propertyName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-honey focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                  placeholder="Name of your property/organization"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">
                  Business Link
                </label>
                <input
                  type="url"
                  name="businessLink"
                  value={formData.businessLink}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-honey focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                  placeholder="https://your-website.com"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">
                Property Address
              </label>
              <textarea
                name="propertyAddress"
                value={formData.propertyAddress}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-honey focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                placeholder="Complete address of the property"
              />
            </div>

            <div className="mb-6">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="safeForFemale"
                  checked={formData.safeForFemale}
                  onChange={handleChange}
                  className="h-4 w-4 text-honey focus:ring-honey border-gray-300 rounded"
                />
                <label className="text-sm font-medium text-charcoal dark:text-white">
                  Safe for female volunteers
                </label>
              </div>
            </div>
          </div>

          {/* Property Type */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-charcoal dark:text-white mb-4">
              Property Type
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Select the type(s) that best describe your property
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {propertyTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => toggleArrayValue("propertyType", type.name)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.propertyType.includes(type.name)
                        ? "border-honey bg-honey/10 text-honey"
                        : "border-gray-200 dark:border-gray-600 hover:border-honey/50 text-gray-700 dark:text-white"
                    }`}
                  >
                    <IconComponent className="h-6 w-6 mx-auto mb-2" />
                    <span className="text-sm font-medium block">
                      {type.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Skills Needed */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-charcoal dark:text-white mb-4">
              Skills Needed
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Select the skills that would be helpful for this opportunity
            </p>
            <div className="flex flex-wrap gap-2">
              {(showAllSkills
                ? availableSkills
                : availableSkills.slice(0, 7)
              ).map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleArrayValue("skills", skill)}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    formData.skills.includes(skill)
                      ? "bg-honey text-charcoal"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-honey/20"
                  }`}
                >
                  {skill}
                </button>
              ))}

              {availableSkills.length > 7 && (
                <button
                  type="button"
                  onClick={() => setShowAllSkills(!showAllSkills)}
                  className="px-4 py-2 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-honey hover:text-honey transition-colors"
                >
                  {showAllSkills ? "...less" : "...more"}
                </button>
              )}
            </div>
          </div>

          {/* Duration and Working Hours */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-charcoal dark:text-white mb-6">
              Duration & Working Hours
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">
                  Minimum Duration (weeks) *
                </label>
                <input
                  type="number"
                  name="minimumDuration"
                  value={formData.minimumDuration}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-honey focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">
                  Maximum Duration (weeks)
                </label>
                <input
                  type="number"
                  name="maximumDuration"
                  value={formData.maximumDuration || ""}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-honey focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                  placeholder="Leave empty for no limit"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">
                  Working Hours (per day)
                </label>
                <input
                  type="number"
                  name="workingHours"
                  value={formData.workingHours}
                  onChange={handleChange}
                  min="0"
                  max="24"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-honey focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">
                Days Off (per week)
              </label>
              <input
                type="number"
                name="daysOff"
                value={formData.daysOff}
                onChange={handleChange}
                min="0"
                max="6"
                className="w-full md:w-1/3 px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-honey focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Accommodation & Benefits */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-charcoal dark:text-white mb-6">
              Accommodation & Benefits
            </h2>

            {/* Room Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-charcoal dark:text-white mb-3">
                Room Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {roomTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => toggleArrayValue("roomType", type.name)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.roomType.includes(type.name)
                          ? "border-honey bg-honey/10 text-honey"
                          : "border-gray-200 dark:border-gray-600 hover:border-honey/50 text-gray-700 dark:text-white"
                      }`}
                    >
                      <IconComponent className="h-5 w-5 mx-auto mb-1" />
                      <span className="text-xs font-medium block">
                        {type.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Meals */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-charcoal dark:text-white mb-3">
                Meals Provided *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {mealOptions.map((meal) => {
                  const IconComponent = meal.icon;
                  const isSelected = formData.meals === meal.name;
                  return (
                    <label
                      key={meal.id}
                      className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                        isSelected
                          ? "border-honey bg-honey/10 text-honey"
                          : "border-gray-200 dark:border-gray-600 hover:border-honey/50 text-gray-700 dark:text-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="meals"
                        value={meal.name}
                        checked={isSelected}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <IconComponent className="h-5 w-5 mx-auto mb-1" />
                        <span className="text-xs font-medium block">
                          {meal.name}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Amenities */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-charcoal dark:text-white mb-3">
                Amenities & Benefits
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {amenities.map((amenity) => {
                  const IconComponent = amenity.icon;
                  return (
                    <button
                      key={amenity.id}
                      type="button"
                      onClick={() =>
                        toggleArrayValue("amenities", amenity.name)
                      }
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.amenities.includes(amenity.name)
                          ? "border-honey bg-honey/10 text-honey"
                          : "border-gray-200 dark:border-gray-600 hover:border-honey/50 text-gray-700 dark:text-white"
                      }`}
                      title={amenity.description}
                    >
                      <IconComponent className="h-5 w-5 mx-auto mb-1" />
                      <span className="text-xs font-medium block text-center">
                        {amenity.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Transport */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-charcoal dark:text-white mb-3">
                Transport Options
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {transportOptions.map((transport) => {
                  const IconComponent = transport.icon;
                  return (
                    <button
                      key={transport.id}
                      type="button"
                      onClick={() =>
                        toggleArrayValue("transport", transport.name)
                      }
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.transport.includes(transport.name)
                          ? "border-honey bg-honey/10 text-honey"
                          : "border-gray-200 dark:border-gray-600 hover:border-honey/50 text-gray-700 dark:text-white"
                      }`}
                      title={transport.description}
                    >
                      <IconComponent className="h-5 w-5 mx-auto mb-1" />
                      <span className="text-xs font-medium block text-center">
                        {transport.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Description */}
          {/* <div className="mb-8">
            <h2 className="text-xl font-semibold text-charcoal dark:text-white mb-6">Opportunity Details</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-honey focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                placeholder="Describe the volunteer work, daily activities, and what volunteers can expect..."
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">
                What will volunteers be doing?
              </label>
              <textarea
                name="volunteerIn"
                value={formData.volunteerIn}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-honey focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                placeholder="Specific tasks and activities volunteers will be involved in..."
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">
                Expectations from Volunteers
              </label>
              <textarea
                name="expectations"
                value={formData.expectations}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-honey focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                placeholder="Any specific requirements, minimum commitment, physical demands, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">
                About Location
              </label>
              <textarea
                name="aboutLocation"
                value={formData.aboutLocation}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-honey focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                placeholder="Describe the location, nearby attractions, weather, culture, etc."
              />
            </div>
          </div> */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-charcoal dark:text-white mb-6">
              Opportunity Details
            </h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-honey focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                placeholder="We are a homestay is situated in the hills of Uttarakhand, where we welcome travelers to experience local life and contribute their skills. Volunteers can help with gardening, eco-projects, photography, cooking, or social media. In exchange, you’ll enjoy homely meals, scenic mountain views, and an authentic village experience."
              />
            </div>

            {/* <div className="mb-6">
              <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">
                What will volunteers be doing?
              </label>
              <textarea
                name="volunteerIn"
                value={formData.volunteerIn}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-honey focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                placeholder="Volunteers will assist in planting seasonal crops, watering plants, preparing compost, cooking local meals, helping children with English, and supporting eco-friendly building projects."
              />
            </div> */}

            <div className="mb-6">
              <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">
                Expectations from Volunteers
              </label>
              <textarea
                name="expectations"
                value={formData.expectations}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-honey focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                // placeholder="We expect volunteers to work 5–6 hours a day, 5 days a week, with a minimum stay of 2 weeks. You should be open-minded, respectful of local traditions, and willing to help with both physical and light household tasks."
                placeholder='We’re looking for volunteers who are friendly, respectful, and open to new cultures. We expect you to respect quiet hours after 10 PM, keep shared spaces clean, use water responsibly. Right now, we especially need help with wall art, photography, video editing and social media management, but we’re always open to other creative skills that can add value.'
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">
                About Location
              </label>
              <textarea
                name="aboutLocation"
                value={formData.aboutLocation}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-honey focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                placeholder="Our farm is located in a small village surrounded by apple orchards and mountains, about 2 hours from Manali. The area is peaceful, with fresh air, rivers nearby, and opportunities for hiking. Local markets and cultural festivals give volunteers a chance to explore Himachali traditions."
              />
            </div>
          </div>

          {/* Photos */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-charcoal dark:text-white mb-4">
              Photos
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Upload 1-3 photos of your location, accommodation, and activities
              (Required: minimum 1, maximum 3)
            </p>

            {/* Image Upload Area */}
            {allImages.length < 3 && (
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center mb-4">
                <Camera className="h-12 w-12 text-gray-400 dark:text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-charcoal dark:text-white mb-2">
                  Upload Photos
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {allImages.length === 0
                    ? "Add photos of your location, accommodation, and activities"
                    : `Add ${3 - allImages.length} more photo${
                        3 - allImages.length > 1 ? "s" : ""
                      }`}
                </p>
                <label className="inline-flex items-center px-6 py-3 bg-honey hover:bg-yellow-500 text-charcoal font-semibold rounded-lg transition-colors cursor-pointer">
                  <Upload className="h-5 w-5 mr-2" />
                  Choose Photos
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {/* Image Preview */}
            {allImages.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={`existing-${index}`} className="relative group">
                    <img
                      src={image.url}
                      alt={`Existing ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index, false)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                      Existing
                    </div>
                  </div>
                ))}
                {newlyUploadedImages.map((image, index) => (
                  <div key={`new-${index}`} className="relative group">
                    <img
                      src={image.url}
                      alt={`New ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index, true)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                      New
                    </div>
                  </div>
                ))}
              </div>
            )}

            {allImages.length === 0 && (
              <div className="text-center py-4">
                <ImageIcon className="h-8 w-8 text-gray-400 dark:text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400">
                  No images uploaded yet
                </p>
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-8 py-3 bg-honey hover:bg-yellow-500 text-charcoal font-semibold rounded-lg transition-colors"
            >
              {isEditMode ? "Update Opportunity" : "Publish Opportunity"}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default CreateOpportunity;
