import React from 'react';
import { motion } from 'framer-motion';
import { Lock, User, Database, ShieldCheck, CreditCard, Mail } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const policies = [
    {
      icon: User,
      title: "Data We Collect",
      description:
        "We collect basic user data such as your name, contact details, and preferences to personalize your experience on GhumoBee."
    },
    {
      icon: Database,
      title: "Use of Information",
      description:
        "Your information is used solely for connecting hosts and travelers, enhancing our platform, and improving user experience."
    },
    {
      icon: ShieldCheck,
      title: "Data Sharing",
      description:
        "We never sell, rent, or trade your personal information to third parties. Your privacy is our top priority."
    },
    {
      icon: CreditCard,
      title: "Payment Security",
      description:
        "All payment transactions are processed via secure gateways like Razorpay. Payment data is encrypted and never stored on our servers."
    },
    {
      icon: Lock,
      title: "Data Modification & Deletion",
      description:
        "You can request modification or deletion of your personal data anytime by contacting our support team. We respect your right to control your information."
    },
    {
      icon: ShieldCheck,
      title: "Security Measures",
      description:
        "We follow industry-standard security protocols to ensure your personal data remains safe, confidential, and protected against unauthorized access."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <motion.section
        className="py-20 bg-gradient-to-br from-honey/20 via-teal/10 to-white dark:from-honey/10 dark:via-teal/5 dark:to-gray-900"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-charcoal dark:text-white mb-6"
            variants={fadeInUp}
          >
            Privacy <span className="text-honey">Policy</span>
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
            variants={fadeInUp}
          >
            At <strong>GhumoBee</strong>, we value your privacy and are committed to protecting
            your personal information. Please read this policy carefully to understand how
            we collect, use, and safeguard your data.
          </motion.p>
        </div>
      </motion.section>

      {/* Policy Section */}
      <motion.section
        className="py-20"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {policies.map((policy, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-honey to-teal rounded-xl flex items-center justify-center flex-shrink-0">
                  <policy.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-charcoal dark:text-white mb-3">
                    {policy.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {policy.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Contact Footer */}
      <motion.section
        className="py-16 bg-gradient-to-r from-honey/10 to-teal/10 dark:from-honey/5 dark:to-teal/5 text-center"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-charcoal dark:text-white mb-4">
            Have Questions About Your Data?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
            If you wish to modify, delete, or inquire about how your data is handled, contact our
            support team at <span className="font-semibold text-teal">info@ghumobee.com</span>.
          </p>
          <motion.a
            href="/contact"
            className="inline-flex items-center px-8 py-4 bg-honey hover:bg-yellow-500 text-charcoal font-semibold rounded-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Support
            <Mail className="ml-2 h-5 w-5" />
          </motion.a>
        </div>
      </motion.section>
    </div>
  );
};

export default PrivacyPolicy;
