import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Heart, Users, Award, Target, Shield } from 'lucide-react';

const About: React.FC = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
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

  const values = [
    {
      icon: Heart,
      title: "Cultural Exchange",
      description: "We believe in the power of cultural exchange to build bridges, break down barriers, and create lasting friendships across the globe."
    },
    {
      icon: Shield,
      title: "Trust & Safety",
      description: "Every host and volunteer is verified through our comprehensive screening process to ensure safe and authentic experiences."
    },
    {
      icon: Globe,
      title: "Sustainability",
      description: "We promote sustainable travel practices and encourage volunteers to make positive environmental and social impacts."
    },
    {
      icon: Users,
      title: "Community First",
      description: "Our platform prioritizes meaningful connections and community building over commercial transactions."
    }
  ];

  const stats = [
    { number: "50,000+", label: "Active Volunteers" },
    { number: "120+", label: "Countries" },
    { number: "15,000+", label: "Host Families" },
    { number: "98%", label: "Satisfaction Rate" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section 
        className="relative bg-gradient-to-br from-honey/20 via-teal/10 to-white dark:from-honey/10 dark:via-teal/5 dark:to-gray-900 py-20"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeInUp}>
              <h1 className="text-4xl md:text-5xl font-bold text-charcoal dark:text-white mb-6">
                Building Bridges Through
                <span className="text-honey"> Travel</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                GhumoBee was born from a simple belief: travel should be more than tourism. 
                It should be about connection, contribution, and cultural exchange that 
                benefits both travelers and local communities.
              </p>
              <div className="flex items-center space-x-4">
                <div className="text-3xl">🌍</div>
                <div>
                  <p className="font-semibold text-charcoal dark:text-white">Our Mission</p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Connecting hearts and cultures worldwide
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="relative"
              variants={fadeInUp}
            >
              <img
                src="https://images.pexels.com/photos/1157255/pexels-photo-1157255.jpeg"
                alt="Volunteers working together"
                className="rounded-2xl shadow-2xl"
              />
              <motion.div 
                className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg"
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🐝</span>
                  <div>
                    <p className="font-semibold text-sm text-charcoal dark:text-white">Making Impact</p>
                    <p className="text-xs text-gray-500">Since 2020</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        className="py-16 bg-white dark:bg-gray-900"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={staggerContainer}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center"
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-honey mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Values Section */}
      <motion.section 
        className="py-20 bg-gray-50 dark:bg-gray-800"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal dark:text-white mb-6">
              Our Core Values
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              These principles guide every decision we make and every feature we build
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={staggerContainer}
          >
            {values.map((value, index) => (
              <motion.div 
                key={index}
                className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-lg"
                variants={fadeInUp}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
                }}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-honey to-teal rounded-xl flex items-center justify-center flex-shrink-0">
                    <value.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-charcoal dark:text-white mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Story Section */}
      <motion.section 
        className="py-20"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center" variants={fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal dark:text-white mb-8">
              Our Story
            </h2>
            <div className="prose prose-lg max-w-none text-gray-600 dark:text-gray-300">
              <motion.p className="mb-6" variants={fadeInUp}>
                GhumoBee started in 2020 when our founder, backpacking through Southeast Asia, 
                experienced the transformative power of staying with local families and 
                contributing to their communities. Unlike traditional tourism, these experiences 
                created genuine connections and mutual learning.
              </motion.p>
              
              <motion.p className="mb-6" variants={fadeInUp}>
                We realized there was a gap in the travel industry - a platform that could 
                connect conscious travelers with meaningful volunteer opportunities while 
                ensuring fair compensation and authentic cultural exchange for host communities.
              </motion.p>
              
              <motion.p variants={fadeInUp}>
                Today, GhumoBee is more than just a platform - we're a global community of 
                change-makers, cultural ambassadors, and lifelong learners who believe that 
                travel can be a force for good in the world.
              </motion.p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-20 bg-gradient-to-r from-honey/10 to-teal/10 dark:from-honey/5 dark:to-teal/5"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal dark:text-white mb-6">
            Join Our Global Community
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Whether you're a traveler seeking meaningful experiences or a host wanting to 
            share your culture, there's a place for you in the GhumoBee family.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="/login"
              className="inline-flex items-center px-8 py-4 bg-honey hover:bg-yellow-500 text-charcoal font-semibold rounded-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Your Journey
              <Globe className="ml-2 h-5 w-5" />
            </motion.a>
            <motion.a
              href="/contact"
              className="inline-flex items-center px-8 py-4 border-2 border-teal text-teal hover:bg-teal hover:text-white font-semibold rounded-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get in Touch
              <Heart className="ml-2 h-5 w-5" />
            </motion.a>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default About;