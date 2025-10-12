import React from 'react';
import { motion } from 'framer-motion';
import { Shield, FileText, AlertTriangle, Users, RefreshCw } from 'lucide-react';

const TermAndConditions: React.FC = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 50 },
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

  const terms = [
    {
      icon: Users,
      title: "Eligibility",
      description:
        "Users must be at least 18 years of age to register or participate in volunteer exchanges."
    },
    {
      icon: FileText,
      title: "Use of Platform",
      description:
        "Travelers and hosts are responsible for the accuracy of information shared on their profiles. GhumoBee acts as a connecting platform and is not responsible for any arrangements made directly between users."
    },
    {
      icon: Shield,
      title: "Membership",
      description:
        "Subscription fees (if applicable) provide access to the GhumoBee network but do not guarantee placements or specific experiences."
    },
    {
      icon: AlertTriangle,
      title: "Conduct",
      description:
        "Users must behave respectfully, avoid misuse of the platform, and follow local laws and host guidelines during their stay."
    },
    {
      icon: Shield,
      title: "Liability",
      description:
        "GhumoBee is not liable for personal injury, loss, or damage during any host-traveler interaction. Users are encouraged to verify details before confirming exchanges."
    },
    {
      icon: RefreshCw,
      title: "Modifications",
      description:
        "GhumoBee reserves the right to modify or update these terms at any time without prior notice."
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
            Terms & <span className="text-honey">Conditions</span>
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
            variants={fadeInUp}
          >
            By accessing or using <strong>GhumoBee</strong>, you agree to comply with the
            following terms. Please read them carefully before participating as a host or traveler.
          </motion.p>
        </div>
      </motion.section>

      {/* Terms Section */}
      <motion.section
        className="py-20"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {terms.map((term, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-honey to-teal rounded-xl flex items-center justify-center flex-shrink-0">
                  <term.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-charcoal dark:text-white mb-3">
                    {term.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {term.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Agreement Footer */}
      <motion.section
        className="py-16 bg-gradient-to-r from-honey/10 to-teal/10 dark:from-honey/5 dark:to-teal/5 text-center"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-charcoal dark:text-white mb-4">
            Agreement
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
            By continuing to use <strong>GhumoBee</strong>, you acknowledge and agree to
            these Terms & Conditions. Your participation helps maintain a safe, honest, and
            supportive travel community.
          </p>
        </div>
      </motion.section>
    </div>
  );
};

export default TermAndConditions;
