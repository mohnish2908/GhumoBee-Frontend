import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Users, MapPin, Heart, Star, ArrowRight } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import OpportunityCard from '../components/OpportunityCard';
import TestimonialCard from '../components/TestimonialCard';

const Home: React.FC = () => {
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

  const featuredOpportunities = [
    {
      id: 1,
      title: "Organic Farm Helper",
      location: "Tuscany, Italy",
      host: "Maria & Giuseppe",
      image: "https://images.pexels.com/photos/2132249/pexels-photo-2132249.jpeg",
      skills: ["Farming", "Cooking"],
      duration: "2-4 weeks",
      rating: 4.9,
      reviews: 23
    },
    {
      id: 2,
      title: "English Teaching Assistant",
      location: "Cusco, Peru",
      host: "Carlos & Family",
      image: "https://images.pexels.com/photos/8197544/pexels-photo-8197544.jpeg",
      skills: ["Teaching", "Spanish"],
      duration: "1-3 months",
      rating: 4.8,
      reviews: 31
    },
    {
      id: 3,
      title: "Wildlife Conservation",
      location: "Cape Town, South Africa",
      host: "Green Earth Foundation",
      image: "https://images.pexels.com/photos/247431/pexels-photo-247431.jpeg",
      skills: ["Conservation", "Research"],
      duration: "3-6 weeks",
      rating: 4.9,
      reviews: 18
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      country: "Canada",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
      text: "GhumoBee gave me the chance to live with a family in Nepal while teaching English. It was life-changing!",
      rating: 5
    },
    {
      name: "Marco Silva",
      country: "Brazil",
      image: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg",
      text: "I helped with sustainable farming in Costa Rica. The community was so welcoming, and I learned so much.",
      rating: 5
    },
    {
      name: "Emma Chen",
      country: "Australia",
      image: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg",
      text: "From wildlife conservation in Kenya to cooking classes in Thailand - every experience was incredible!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section 
        className="relative bg-gradient-to-br from-honey/20 via-teal/10 to-white dark:from-honey/10 dark:via-teal/5 dark:to-gray-900 py-20 overflow-hidden"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-10 right-10 text-6xl opacity-10"
          >
            🐝
          </motion.div>
          <motion.div
            animate={{ y: [-20, 20, -20] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute bottom-10 left-10 text-4xl opacity-10"
          >
            ✈️
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-charcoal dark:text-white mb-6"
              variants={fadeInUp}
            >
              Travel, Volunteer,{' '}
              <span className="text-honey">Connect</span>
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto"
              variants={fadeInUp}
            >
              Explore the world with GhumoBee. Find meaningful volunteer opportunities, 
              connect with local communities, and create unforgettable memories.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
              variants={fadeInUp}
            >
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-4 bg-honey hover:bg-yellow-500 text-charcoal font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Join as Volunteer
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/create-opportunity"
                className="inline-flex items-center px-8 py-4 border-2 border-teal text-teal hover:bg-teal hover:text-white font-semibold rounded-xl transition-all transform hover:scale-105"
              >
                List Your Stay
                <Heart className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>

            {/* Search Bar */}
            <motion.div variants={fadeInUp}>
              <SearchBar />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Featured Opportunities */}
      <motion.section 
        className="py-20 bg-gray-50 dark:bg-gray-800"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal dark:text-white mb-4">
              Featured Opportunities
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Discover amazing volunteer opportunities from verified hosts around the world
            </p>
          </motion.div>

          {/* <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
          >
            {featuredOpportunities.map((opportunity) => (
              <motion.div key={opportunity.id} variants={fadeInUp}>
                <OpportunityCard opportunity={opportunity} />
              </motion.div>
            ))}
          </motion.div> */}

          <motion.div className="text-center mt-12" variants={fadeInUp}>
            <Link
              to="/opportunities"
              className="inline-flex items-center px-8 py-3 bg-teal hover:bg-teal/90 text-white font-semibold rounded-lg transition-colors"
            >
              View All Opportunities
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section 
        className="py-20"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Start your volunteer journey in three simple steps
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
            variants={staggerContainer}
          >
            {[
              {
                step: "01",
                icon: Search,
                title: "Find & Apply",
                description: "Browse volunteer opportunities that match your skills and interests. Apply directly through our platform."
              },
              {
                step: "02",
                icon: Users,
                title: "Connect & Plan",
                description: "Connect with hosts, discuss expectations, and plan your volunteer experience together."
              },
              {
                step: "03",
                icon: MapPin,
                title: "Travel & Volunteer",
                description: "Embark on your adventure, make meaningful contributions, and create lasting memories."
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="text-center"
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-honey to-teal rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-10 w-10 text-white" />
                  </div>
                  <span className="absolute -top-2 -right-2 bg-teal text-white text-sm font-bold px-2 py-1 rounded-full">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-charcoal dark:text-white mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section 
        className="py-20 bg-gradient-to-r from-honey/10 to-teal/10 dark:from-honey/5 dark:to-teal/5"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal dark:text-white mb-4">
              Stories from Our Community
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Hear from volunteers who've experienced the magic of cultural exchange
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <TestimonialCard testimonial={testimonial} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-20 bg-charcoal text-white"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of volunteers who are making a difference while exploring the world
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="inline-flex items-center px-8 py-4 bg-honey hover:bg-yellow-500 text-charcoal font-semibold rounded-xl transition-all transform hover:scale-105"
            >
              Start Volunteering
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-charcoal font-semibold rounded-xl transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;