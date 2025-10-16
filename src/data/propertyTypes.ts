// propertyTypes.ts
import { 
  BedDouble ,
  Tent, 
  School, 
  Users, 
  Heart, 
  HelpCircle, 
  Sprout, 
  TreePine, 
  Flower, 
  User, 
  Coffee, 
  Building, 
  Home ,
  Bed 
} from 'lucide-react';

export interface PropertyType {
  id: string;
  name: string;
  icon: typeof Tent;
  description?: string;
}

export const propertyTypes: PropertyType[] = [
  {
    id: "hotel",
    name: "Hotel",
    icon: BedDouble,
    description: "Hotel or resort"
  },
  {
    id: "hostel",
    name: "Hostel",
    icon: Building,
    description: "Affordable shared accommodation"
  },
  {
    id: "cafe",
    name: "Cafe",
    icon: Coffee,
    description: "Coffee shop or restaurant"
  },
  {
    id: "camp",
    name: "Camp",
    icon: Tent,
    description: "Outdoor camping experience"
  },
  {
    id: "organic-farm",
    name: "Organic Farm",
    icon: Sprout,
    description: "Sustainable farming operation"
  },
  {
    id: "eco-village",
    name: "Eco Village",
    icon: TreePine,
    description: "Sustainable living community"
  },
  {
    id: "yoga-meditation",
    name: "Yoga and Meditation Centre",
    icon: Flower,
    description: "Wellness and spiritual center"
  },
  {
    id: "resort-villa-cottage",
    name: "Resort/Villa/Cottage",
    icon: Users,
    description: "Premium stays and group accommodations"
  },
  {
    id: "individual",
    name: "Individual",
    icon: User,
    description: "Private individual host"
  },
  {
    id: "dormitory",
    name: "Dormitory",
    icon: Bed ,
    description: "Shared dorm-style accommodation"
  },
  {
    id: "school",
    name: "School",
    icon: School,
    description: "Educational institution"
  },
  {
    id: "homestay",
    name: "Homestay",
    icon: Home,
    description: "Stay with local hosts and families"
  }
];

export const propertyTypesMap = new Map(
  propertyTypes.map(type => [type.name, type])
);

export const propertyTypeNames = propertyTypes.map(type => type.name);