import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Heart, MessageCircle } from 'lucide-react';

const Blog: React.FC = () => {
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

  const featuredPosts = [
    {
      id: 1,
      title: "My Life-Changing Experience Teaching in Rural Peru",
      excerpt: "How three months in a small village near Cusco opened my eyes to the power of education and cultural exchange.",
      author: "Sarah Johnson",
      date: "December 20, 2024",
      readTime: "5 min read",
      image: "https://images.pexels.com/photos/8197544/pexels-photo-8197544.jpeg",
      category: "Volunteer Stories",
      likes: 127,
      comments: 23
    },
    {
      id: 2,
      title: "Sustainable Farming Techniques I Learned in Thailand",
      excerpt: "From organic composting to permaculture design - practical tips for eco-friendly agriculture.",
      author: "Marco Silva",
      date: "December 18, 2024",
      readTime: "7 min read",
      image: "https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg",
      category: "Sustainability",
      likes: 89,
      comments: 15
    },
    {
      id: 3,
      title: "Solo Female Volunteer: Safety Tips for First-Time Travelers",
      excerpt: "Essential advice for women embarking on their first international volunteer experience.",
      author: "Emma Chen",
      date: "December 15, 2024",
      readTime: "6 min read",
      image: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg",
      category: "Travel Tips",
      likes: 203,
      comments: 41
    }
  ];

  const recentPosts = [
    {
      id: 4,
      title: "Building a Community Garden in Morocco",
      excerpt: "How volunteers and locals came together to create a sustainable food source in Marrakech.",
      author: "David Wilson",
      date: "December 12, 2024",
      image: "https://images.pexels.com/photos/3889855/pexels-photo-3889855.jpeg",
      category: "Community Impact"
    },
    {
      id: 5,
      title: "Learning Traditional Crafts in Nepal",
      excerpt: "Preserving ancient pottery and weaving techniques while supporting local artisans.",
      author: "Lisa Park",
      date: "December 10, 2024",
      image: "https://images.pexels.com/photos/1157255/pexels-photo-1157255.jpeg",
      category: "Cultural Exchange"
    },
    {
      id: 6,
      title: "Wildlife Conservation Success Stories",
      excerpt: "How volunteer programs are making a real difference in protecting endangered species.",
      author: "James Rodriguez",
      date: "December 8, 2024",
      image: "https://images.pexels.com/photos/247431/pexels-photo-247431.jpeg",
      category: "Conservation"
    }
  ];

  const categories = [
    "All Stories", "Volunteer Stories", "Travel Tips", "Cultural Exchange", 
    "Sustainability", "Community Impact", "Conservation", "Host Stories"
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
            Stories & Insights
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Real stories from our global community of volunteers and hosts. 
            Get inspired, learn from experiences, and discover tips for your next adventure.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.slice(0, 5).map((category) => (
              <button
                key={category}
                className="px-4 py-2 bg-white dark:bg-gray-800 hover:bg-honey hover:text-charcoal dark:hover:bg-honey dark:hover:text-charcoal rounded-full transition-colors text-sm font-medium"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </motion.section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Posts */}
        <motion.section 
          className="mb-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2 
            className="text-3xl font-bold text-charcoal dark:text-white mb-8"
            variants={fadeInUp}
          >
            Featured Stories
          </motion.h2>
          
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
          >
            {featuredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                className={`group cursor-pointer ${
                  index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''
                }`}
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
                  <div className={`relative ${index === 0 ? 'h-64 lg:h-80' : 'h-48'}`}>
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-honey text-charcoal text-sm font-medium rounded-full">
                        {post.category}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  </div>
                  
                  <div className={`p-6 ${index === 0 ? 'lg:p-8' : ''}`}>
                    <h3 className={`font-bold text-charcoal dark:text-white mb-3 group-hover:text-honey transition-colors ${
                      index === 0 ? 'text-2xl lg:text-3xl' : 'text-xl'
                    }`}>
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {post.author}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {post.date}
                        </div>
                      </div>
                      <span>{post.readTime}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Heart className="h-4 w-4 mr-1" />
                          {post.likes}
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {post.comments}
                        </div>
                      </div>
                      <button className="flex items-center text-honey hover:text-yellow-500 transition-colors font-medium">
                        Read More
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </motion.section>

        {/* Recent Posts */}
        <motion.section
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2 
            className="text-3xl font-bold text-charcoal dark:text-white mb-8"
            variants={fadeInUp}
          >
            Recent Posts
          </motion.h2>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
            variants={staggerContainer}
          >
            {recentPosts.map((post) => (
              <motion.article
                key={post.id}
                className="group cursor-pointer"
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
                  <div className="relative h-48">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-teal text-white text-sm font-medium rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-charcoal dark:text-white mb-3 group-hover:text-teal transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {post.author}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {post.date}
                        </div>
                      </div>
                      <button className="flex items-center text-teal hover:text-teal/80 transition-colors">
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>

          {/* Newsletter Signup */}
          <motion.div 
            className="bg-gradient-to-r from-honey/10 to-teal/10 dark:from-honey/5 dark:to-teal/5 rounded-2xl p-8 text-center"
            variants={fadeInUp}
          >
            <h3 className="text-2xl font-bold text-charcoal dark:text-white mb-4">
              Never Miss a Story
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter and get the latest volunteer stories, 
              travel tips, and opportunities delivered to your inbox.
            </p>
            <div className="max-w-md mx-auto flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-honey focus:border-transparent bg-white dark:bg-gray-800 dark:text-white"
              />
              <button className="px-6 py-3 bg-honey hover:bg-yellow-500 text-charcoal font-semibold rounded-lg transition-colors">
                Subscribe
              </button>
            </div>
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
};

export default Blog;