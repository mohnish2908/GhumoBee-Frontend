import React from "react";

const SafetyGuideline: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <h1 className="text-3xl font-bold mb-6 text-green-600 dark:text-green-400 text-center">
        🛡️ Safety Guidelines
      </h1>

      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mt-8 mb-2 text-green-700 dark:text-green-300">
            1. Get to Know Each Other Before Confirming
          </h2>
          <p className="mb-2">
            Take time to exchange messages, ask questions, and clearly discuss expectations before confirming a stay or hosting someone. Good communication builds trust and sets the tone for a great experience.
          </p>
          <p className="italic">
            🤝 We recommend keeping all conversations within the GhumoBee platform to help protect your privacy and ensure clarity.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mt-8 mb-2 text-green-700 dark:text-green-300">
            2. Be Cautious, But Trust the Process
          </h2>
          <p>
            It's natural to be careful when connecting with someone new. Ask for details, share only what you're comfortable with, and trust your instincts. If something doesn’t feel right, it’s okay to pause or walk away.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mt-8 mb-2 text-green-700 dark:text-green-300">
            3. Respect Local Culture and House Rules
          </h2>
          <p>
            Travelers should always respect the customs, laws, and expectations of their host and the local community. Hosts should clearly communicate any house rules or guidelines before the stay begins.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mt-8 mb-2 text-green-700 dark:text-green-300">
            4. Report Any Concerns
          </h2>
          <p>
            If you come across anything that feels unsafe, dishonest, or inappropriate, please contact us immediately at{" "}
            <a
              href="mailto:info@ghumobee.com"
              className="text-green-600 dark:text-green-400 underline hover:text-green-700 dark:hover:text-green-300"
            >
              info@ghumobee.com
            </a>
            . All reports are reviewed seriously, and we’re here to help keep our community safe.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mt-8 mb-2 text-green-700 dark:text-green-300">
            5. In Case of Emergency
          </h2>
          <p>
            If you’re in an emergency situation, contact local authorities right away. While GhumoBee is here to support you, we do not replace emergency or law enforcement services. We can, however, assist with verified user information if required by officials.
          </p>
        </div>
      </section>

      <p className="mt-10 text-center italic text-gray-600 dark:text-gray-400">
        Stay safe, travel responsibly, and help us make GhumoBee a trusted global community. 🌍
      </p>
    </div>
  );
};

export default SafetyGuideline;
