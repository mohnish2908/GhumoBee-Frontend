import React from "react";

// --- Types ---
interface IconProps {
  className?: string;
}

interface Step {
  icon: React.ComponentType<IconProps>;
  title: string;
  description: string;
}

interface StepCardProps {
  icon: React.ComponentType<IconProps>;
  title: string;
  description: string;
}

// --- New Icon Components ---
const RegisterIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
       fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
       strokeLinejoin="round" className={className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

const DestinationIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
       viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const ConnectIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
       viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const PlanIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
       viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const FeedbackIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
       viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 
                     12 17.77 5.82 21.02 7 14.14 2 9.27 
                     8.91 8.26 12 2"/>
  </svg>
);

const HostIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
       viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const PostIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
       viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="16"/>
    <line x1="8" y1="12" x2="16" y2="12"/>
  </svg>
);

const ReviewIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
       viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4
             c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const PassionateTravelersIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
       viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

// --- Data for the steps ---
const volunteerSteps: Step[] = [
  { icon: RegisterIcon, title: "Register as volunteer", description: "Sign up, showcase your skills, and get verified. Tell us who you are, what you’re good at, and what you’d love to explore." },
  { icon: DestinationIcon, title: "Choose destination & Apply", description: "Browse opportunities across India and pick the exchange that excites you most." },
  { icon: ConnectIcon, title: "Connect with Hosts", description: "Once selected, chat directly with verified hosts who’ll provide food and stay in exchange for your skills." },
  { icon: PlanIcon, title: "Travel & Share", description: "Enjoy a meaningful travel experience, contribute your skills, and leave your feedback for the community." },
//   { icon: FeedbackIcon, title: "Leave Feedback", description: "Share your honest experience to help others make informed decisions and strengthen the community." },
];

const hostSteps: Step[] = [
  { icon: HostIcon, title: "Register as a Host", description: "Create your free account and introduce your property, project, or community to potential travelers." },
  { icon: PostIcon, title: "Post Your Opportunity", description: "List the type of support you need. From digital marketing to photography, gardening, cooking, or creative help." },
  { icon: ReviewIcon, title: "Review Applications", description: "We pre-screen volunteers for you, so you only see relevant, genuine applications." },
  { icon: PassionateTravelersIcon, title: "Welcome Skilled Travelers", description: "Host passionate travelers who bring energy, skills, and cultural exchange to your space, all in return for meals + stay" },
//   { icon: FeedbackIcon, title: "Leave Feedback", description: "Share your honest experience to help others make informed decisions and strengthen the community." },
];

// --- Reusable Step Card Component ---
const StepCard: React.FC<StepCardProps> = ({ icon: Icon, title, description }) => (
  <div className="text-center flex flex-col items-center">
    <div className="w-20 h-20 mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
      <Icon className="h-10 w-10 text-gray-600 dark:text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
      {title}
    </h3>
    <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
  </div>
);

// --- The Main "How It Works" Component ---
const HowItWorksSection: React.FC = () => {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl mx-auto">
            Whether you’re a traveler seeking meaningful experiences or a host looking for passionate help, GhumoBee makes it easy to connect, share skills, and create lasting memories.
          </p>
        </div>

        {/* For Volunteer Section */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-12">
            For Volunteer
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {volunteerSteps.map((step, index) => (
              <StepCard key={`volunteer-${index}`} {...step} />
            ))}
          </div>
        </div>

        {/* For Host Section */}
        <div>
          <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-12">
            For Host
          </h3>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {hostSteps.map((step, index) => (
              <StepCard key={`host-${index}`} {...step} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
