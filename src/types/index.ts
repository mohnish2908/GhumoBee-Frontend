// User and Profile related interfaces
export interface ProfilePicture {
  asset_id: string;
  public_id: string;
  url: string;
  file?: File;
  preview?: string;
}

export interface SocialLinks {
  instagram: string;
  linkedin: string;
  website: string;
}

export interface VolunteerSkill {
  skillName: string;
  proficiencyLevel: 'beginner' | 'intermediate' | 'advanced' | '';
  description: string;
  portfolioLink: string;
  yearOfExperience: string;
}

export interface Volunteer {
  _id: string;
  user: string;
  skills: VolunteerSkill[];
  bio: string;
  socialLinks: SocialLinks;
  achievements: string;
  bloodGroup: string;
  medicalComplication: string;
  smoke: 'yes' | 'never' | 'occasionally' | '';
  alcohol: 'yes' | 'never' | 'occasionally' | '';
  portfolio: string;
  profileCompletion: boolean;
  isPaidMember: boolean;
  membershipExpiresAt?: Date;
  available: boolean;
  subscriptionStatus: 'inactive' | 'active' | 'expired' | 'cancelled';
  subscriptionPlan: '3 Months' | '6 Months' | '12 Months' | null;
  subscriptionStartDate?: Date;
  subscriptionEndDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionStatusResponse {
  subscriptionStatus: 'inactive' | 'active' | 'expired' | 'cancelled';
  subscriptionPlan: '3 Months' | '6 Months' | '12 Months' | null;
  subscriptionStartDate?: Date;
  subscriptionEndDate?: Date;
  membershipExpiresAt?: Date;
  isPaidMember: boolean;
  daysRemaining: number;
}

export interface Host {
  _id: string;
  user: string;
  designation: ('owner' | 'partner' | 'manager')[];
  organizationName: string;
  organizationType: ('Non-profit' | 'corporate' | 'government org' | 'startup' | 'business' | 'ngo' | 'initiative' | 'other')[];
  needOfVolunteer: string[];
  businessDocument: string | { file?: File; preview?: string; url?: string };
  bio: string;
  profileCompletion: boolean;
  isPaidHost: boolean;
  opportunitiesPosted: string[];
  reviews: string[];
  socialLinks: SocialLinks;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  _id: string;
  name: string;
  host?: Host | null;
  volunteer?: Volunteer | null;
  email: string;
  phone: string;
  emergencyContactNumber: string;
  emergencyContactPersonName: string;
  password: string;
  role: 'host' | 'volunteer' | 'admin';
  profilePicture: ProfilePicture;
  dob: Date | null;
  gender: 'male' | 'female' | 'other' | '';
  languages: string[];
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  isVerified: boolean;
  aadhaarDoc: string | { file?: File; preview?: string; url?: string };
  createdAt: Date;
  updatedAt: Date;
}

// API Response interfaces
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface UserApiResponse extends ApiResponse<User> {}

// Form props interfaces
export interface PersonalInfoFormData extends User {}
export interface RoleProfileFormData extends User {}

// Navigation interfaces
export interface NavigationItem {
  name: string;
  href: string;
  roles?: ('host' | 'volunteer' | 'admin')[];
}
