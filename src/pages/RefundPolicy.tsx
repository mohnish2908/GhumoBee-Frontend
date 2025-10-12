import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Undo2, AlertCircle, CalendarX, Mail, FileWarning } from 'lucide-react';

const RefundPolicy: React.FC = () => {
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
      icon: CreditCard,
      title: "Subscription Fees",
      description:
        "Once paid, membership fees are non-refundable, as users immediately gain access to platform features, listings, and opportunities."
    },
    {
      icon: Undo2,
      title: "Application Outcomes",
      description:
        "Payment allows users to apply and connect with hosts, but does not guarantee acceptance or placement. If a traveler is not selected by a host, the subscription fee will not be refunded."
    },
    {
      icon: FileWarning,
      title: "Exceptional Cases",
      description:
        "Refunds may be issued only for duplicate payments or verified technical errors. Each case will be reviewed individually by the GhumoBee support team."
    },
    {
      icon: CalendarX,
      title: "Cancellation",
      description:
        "Users may cancel their subscription anytime, but no partial refunds will be provided for unused periods."
    },
    {
      icon: AlertCircle,
      title: "Host Services",
      description:
        "Hosts are responsible for their own cancellation or refund terms for accommodations or experiences offered through the platform."
    },
    {
      icon: Mail,
      title: "Refund Queries",
      description:
        "For refund-related concerns, please contact us at info@ghumobee.com within 7 days of the transaction. Our team will assist you promptly."
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
            Refund & <span className="text-honey">Cancellation Policy</span>
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
            variants={fadeInUp}
          >
            (Updated) GhumoBee subscriptions and payments provide access to our verified host and traveler network.  
            Please read the following policy carefully before subscribing or making payments.
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
            Need Help with a Payment?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
            Our support team is here to assist you with refund and payment-related issues.
            Please reach out to <span className="font-semibold text-teal">info@ghumobee.com</span> within 7 days of the transaction.
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

export default RefundPolicy;
