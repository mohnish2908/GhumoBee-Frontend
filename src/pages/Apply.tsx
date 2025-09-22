import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MessageCircle, User, CheckCircle, ArrowLeft } from 'lucide-react';

const Apply: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    message: '',
    startDate: '',
    endDate: '',
    experience: '',
    motivation: '',
    skills: [] as string[]
  });

  // Mock opportunity data
  const opportunity = {
    title: "Organic Farm Helper",
    location: "Siena, Tuscany, Italy",
    host: "Maria & Giuseppe Rossi",
    image: "https://images.pexels.com/photos/2132249/pexels-photo-2132249.jpeg"
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Application submitted:', formData);
    setIsSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const relevantSkills = [
    'Farming', 'Gardening', 'Cooking', 'Physical Work', 'Animal Care',
    'Italian Language', 'Photography', 'Teaching', 'Sustainability'
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-gradient-to-br from-honey/10 to-teal/10 dark:from-honey/5 dark:to-teal/5">
        <motion.div 
          className="max-w-lg mx-auto px-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-charcoal dark:text-white mb-4">
              Application Sent Successfully!
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Your application for <strong>{opportunity.title}</strong> has been sent to {opportunity.host}. 
              They will review your application and get back to you within 48 hours.
            </p>

            <div className="bg-honey/10 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-charcoal dark:text-white mb-2">What happens next?</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 text-left">
                <li>• Host reviews your application</li>
                <li>• You'll receive an email notification</li>
                <li>• If accepted, you can start planning your trip</li>
                <li>• Check your dashboard for updates</li>
              </ul>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => navigate('/opportunities')}
                className="w-full px-6 py-3 bg-honey hover:bg-yellow-500 text-charcoal font-semibold rounded-lg transition-colors"
              >
                Browse More Opportunities
              </button>
              <button 
                onClick={() => navigate('/profile')}
                className="w-full px-6 py-3 border border-teal text-teal hover:bg-teal hover:text-white rounded-lg transition-colors"
              >
                View My Applications
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <motion.section 
        className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-8"
        initial="initial"
        animate="animate"
        variants={fadeInUp}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-teal hover:text-teal/80 mb-4 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Opportunity
          </button>
          
          <div className="flex items-center space-x-4">
            <img
              src={opportunity.image}
              alt={opportunity.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold text-charcoal dark:text-white">
                Apply for {opportunity.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {opportunity.location} • Hosted by {opportunity.host}
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Application Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.form 
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          {/* Personal Message */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-charcoal dark:text-white mb-4 flex items-center">
              <MessageCircle className="h-5 w-5 mr-2 text-honey" />
              Message to Host
            </h2>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-honey focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
              placeholder="Introduce yourself and explain why you're interested in this opportunity. What can you contribute?"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Tip: Mention your relevant experience and what you hope to learn
            </p>
          </div>

          {/* Availability */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-charcoal dark:text-white mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-honey" />
              Your Availability
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">
                  Preferred Start Date *
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-honey focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">
                  Preferred End Date *
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-honey focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Relevant Skills */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-charcoal dark:text-white mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-honey" />
              Your Relevant Skills
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Select skills that match this opportunity
            </p>
            <div className="flex flex-wrap gap-2">
              {relevantSkills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    formData.skills.includes(skill)
                      ? 'bg-honey text-charcoal'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-honey/20'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-charcoal dark:text-white mb-4">
              Relevant Experience
            </h2>
            <textarea
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-honey focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
              placeholder="Describe any relevant experience you have (farming, teaching, volunteering, etc.)"
            />
          </div>

          {/* Motivation */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-charcoal dark:text-white mb-4">
              Why This Opportunity?
            </h2>
            <textarea
              name="motivation"
              value={formData.motivation}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-honey focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
              placeholder="What attracts you to this specific opportunity? What do you hope to learn or contribute?"
            />
          </div>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              className="flex-1 px-8 py-3 bg-honey hover:bg-yellow-500 text-charcoal font-semibold rounded-lg transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Submit Application
            </motion.button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default Apply;