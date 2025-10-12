import React from "react";

const SafetyGuideline: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <h1 className="text-3xl font-bold mb-6 text-green-600 dark:text-green-400 text-center">
        🛡️ Safety Guidelines
      </h1>

      <p className="mb-4 text-lg">
        At <strong>GhumoBee</strong>, your safety is our top priority. We aim to create a secure and trustworthy
        community for both travelers and hosts. Please follow the guidelines below to ensure a safe experience.
      </p>

      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mt-8 mb-2 text-green-700 dark:text-green-300">
            1. Verify Profiles Before Interacting
          </h2>
          <p>
            Always check the profile details, reviews, and verification status of hosts or travelers before confirming
            stays or collaborations. Avoid communicating outside the GhumoBee platform until both parties are verified.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mt-8 mb-2 text-green-700 dark:text-green-300">
            2. Keep Payments Secure
          </h2>
          <p>
            All payments should be made only through GhumoBee’s secure payment gateway. Avoid transferring money
            directly to any individual’s account or sharing payment details via chat or external platforms.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mt-8 mb-2 text-green-700 dark:text-green-300">
            3. Meet in Safe Locations
          </h2>
          <p>
            For initial meet-ups, choose public places and inform a trusted friend or family member of your plans.
            Avoid sharing your home address until you’re confident about the other party’s authenticity.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mt-8 mb-2 text-green-700 dark:text-green-300">
            4. Respect Local Laws and Culture
          </h2>
          <p>
            Travelers should follow local rules, customs, and community norms. Hosts must clearly communicate
            house rules and expectations before confirming a stay.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mt-8 mb-2 text-green-700 dark:text-green-300">
            5. Report Suspicious Behavior
          </h2>
          <p>
            If you notice any suspicious or inappropriate activity, report it immediately to our support team at{" "}
            <a
              href="mailto:support@ghumobee.com"
              className="text-green-600 dark:text-green-400 underline hover:text-green-700 dark:hover:text-green-300"
            >
              info@ghumobee.com
            </a>
            . We review all reports seriously to ensure community safety.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mt-8 mb-2 text-green-700 dark:text-green-300">
            6. Emergency Situations
          </h2>
          <p>
            In case of an emergency, contact local authorities immediately. GhumoBee does not replace law enforcement
            or emergency services but can assist in providing necessary user information to the authorities if required.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mt-8 mb-2 text-green-700 dark:text-green-300">
            7. Keep Communication Transparent
          </h2>
          <p>
            Use GhumoBee’s in-app messaging system to communicate. This helps maintain transparency and ensures
            protection in case of any dispute or misunderstanding.
          </p>
        </div>
      </section>

      <p className="mt-10 text-center italic text-gray-600 dark:text-gray-400">
        Stay safe, travel smart, and help us make GhumoBee a trustworthy global community. 🌍
      </p>
    </div>
  );
};

export default SafetyGuideline;
