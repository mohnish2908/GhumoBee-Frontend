import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageCircle, Send, HelpCircle, Shield, Globe } from 'lucide-react';
import {contactUs} from '../services/operations/authApi';
// import { form } from 'framer-motion/client';
const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    // console.log('Form submitted:', formData);
    const res=contactUs(formData);
    console.log(res);
    
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const faqs = [
    {
      question: "How do I apply for volunteer opportunities?",
      answer: "Browse our opportunities page, find a project that matches your interests, and click 'Apply'. You'll need to create a profile and submit a brief application explaining your motivation and relevant experience."
    },
    {
      question: "Are all hosts and volunteers verified?",
      answer: "Yes! Every host and volunteer goes through our comprehensive verification process, including identity verification, background checks, and reference reviews to ensure safe and authentic experiences."
    },
    {
      question: "What if I need to cancel my volunteer placement?",
      answer: "We understand that plans can change. Our cancellation policy varies by timing - cancellations more than 30 days in advance receive full refunds, while later cancellations may be subject to fees."
    },
    {
      question: "Do I need travel insurance?",
      answer: "Yes, we strongly recommend comprehensive travel insurance for all volunteers. While not mandatory, it protects you against medical emergencies, trip cancellations, and other unforeseen circumstances."
    },
    {
      question: "How long do volunteer placements typically last?",
      answer: "Volunteer placements range from 2 weeks to 6 months, depending on the project and your availability. Most popular placements are 4-8 weeks, which provides enough time for meaningful contribution and cultural immersion."
    },
    {
      question: "What support do you provide during my placement?",
      answer: "We offer 24/7 emergency support, regular check-ins, local coordinator assistance, and a comprehensive resource center with country guides, cultural tips, and safety information."
    }
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <motion.section 
        className="bg-gradient-to-r from-honey/20 to-teal/20 dark:from-honey/10 dark:to-teal/10 py-16"
        initial="initial"
        animate="animate"
        variants={fadeInUp}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-charcoal dark:text-white mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Have questions about volunteering, hosting, or need support? 
            We're here to help you every step of your journey.
          </p>
        </div>
      </motion.section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <motion.div 
            className="lg:col-span-2"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
              variants={fadeInUp}
            >
              <h2 className="text-2xl font-bold text-charcoal dark:text-white mb-6">
                Send us a Message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-honey focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-honey focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">
                    Subject *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-honey focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select a subject</option>
                    <option value="volunteer-inquiry">Volunteer Inquiry</option>
                    <option value="host-inquiry">Host Inquiry</option>
                    <option value="technical-support">Technical Support</option>
                    <option value="safety-concern">Safety Concern</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-honey focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <motion.button
                  type="submit"
                  className="w-full px-8 py-4 bg-honey hover:bg-yellow-500 text-charcoal font-semibold rounded-lg transition-all flex items-center justify-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Send className="h-5 w-5 mr-2" />
                  Send Message
                </motion.button>
              </form>
            </motion.div>
          </motion.div>

          {/* Contact Info & Quick Links */}
          <motion.div 
            className="space-y-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {/* Contact Information */}
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
              variants={fadeInUp}
            >
              <h3 className="text-lg font-semibold text-charcoal dark:text-white mb-4">
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-honey mt-1" />
                  <div>
                    <p className="font-medium text-charcoal dark:text-white">Email</p>
                    <p className="text-gray-600 dark:text-gray-300">info@ghumobee.com</p>
                  </div>
                </div>
                {/* <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-honey mt-1" />
                  <div>
                    <p className="font-medium text-charcoal dark:text-white">24/7 Support</p>
                    <p className="text-gray-600 dark:text-gray-300">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-honey mt-1" />
                  <div>
                    <p className="font-medium text-charcoal dark:text-white">Headquarters</p>
                    <p className="text-gray-600 dark:text-gray-300">
                      123 Global Street<br />
                      San Francisco, CA 94102
                    </p>
                  </div>
                </div> */}
              </div>
            </motion.div>

            {/* Quick Support Links */}
            {/* <motion.div 
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
              variants={fadeInUp}
            >
              <h3 className="text-lg font-semibold text-charcoal dark:text-white mb-4">
                Quick Support
              </h3>
              <div className="space-y-3">
                {[
                  { icon: MessageCircle, label: "Live Chat", desc: "Available 24/7" },
                  { icon: HelpCircle, label: "Help Center", desc: "Find answers fast" },
                  { icon: Shield, label: "Safety Guidelines", desc: "Stay safe while traveling" },
                  { icon: Globe, label: "Community Forum", desc: "Connect with others" }
                ].map((item, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
                  >
                    <item.icon className="h-5 w-5 text-teal" />
                    <div>
                      <p className="font-medium text-charcoal dark:text-white">{item.label}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div> */}
          </motion.div>
        </div>

        {/* FAQ Section */}
        {/* <motion.section 
          className="mt-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div className="text-center mb-12" variants={fadeInUp}>
            <h2 className="text-3xl font-bold text-charcoal dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Find answers to common questions about volunteering and hosting
            </p>
          </motion.div>

          <motion.div 
            className="max-w-4xl mx-auto space-y-4"
            variants={staggerContainer}
          >
            {faqs.map((faq, index) => (
              <motion.details
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg group"
                variants={fadeInUp}
              >
                <summary className="cursor-pointer font-semibold text-charcoal dark:text-white flex items-center justify-between">
                  {faq.question}
                  <span className="text-honey group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                  {faq.answer}
                </p>
              </motion.details>
            ))}
          </motion.div>
        </motion.section> */}
      </div>
    </div>
  );
};

export default Contact;