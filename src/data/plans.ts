export type Plan = {
    name: string;
    price: number;
    perDay: number;
    duration: string;
    icon: string;
    features: string[];
    highlight: boolean;
    badge?: string;
};

export const plans: Plan[] = [
    {
        name: "3-Month Explorer",
        price: 749,
        perDay: 9,
        duration: "3 Months",
        icon: "🌱",
        features: [
            "Access to all volunteer opportunities",
            "Create & manage your profile",
            "Apply to up to 10 opportunities",
            "Host reviews & ratings access",
            "Basic email support",
        ],
        highlight: false,
    },
    {
        name: "6-Month Adventurer",
        price: 1099,
        perDay: 6,
        duration: "6 Months",
        icon: "🌍",
        features: [
            "Everything in Explorer, plus:",
            "Unlimited applications",
            "Priority listing in host searches",
            "Save favorite opportunities",
            "Access to exclusive \"high-demand\" roles",
            "Standard support (email + chat)",
        ],
        highlight: false,
    },
    {
        name: "12-Month Pro Bee",
        price: 1499,
        perDay: 4,
        duration: "12 Months",
        icon: "🐝",
        features: [
            "Everything in Adventurer, plus:",
            "Featured profile badge (hosts trust you more)",
            "Early access to new opportunities",
            "Free participation in GhumoBee community events & meetups",
            "Certificate of completion (on request)",
            "Priority support (email + chat + call)",
        ],
        highlight: true,
        badge: "🏆 Best Value",
    },
];
