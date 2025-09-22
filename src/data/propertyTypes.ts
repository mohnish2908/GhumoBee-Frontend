// propertyTypes.ts
import { 
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
  Home 
} from 'lucide-react';

export interface PropertyType {
  id: string;
  name: string;
  icon: typeof Tent;
  description?: string;
}

export const propertyTypes: PropertyType[] = [
  {
    id: "camp",
    name: "Camp",
    icon: Tent,
    description: "Outdoor camping experience"
  },
  {
    id: "school",
    name: "School",
    icon: School,
    description: "Educational institution"
  },
  {
    id: "community",
    name: "Community",
    icon: Users,
    description: "Community center or group"
  },
  {
    id: "animal-welfare",
    name: "Animal Welfare",
    icon: Heart,
    description: "Animal care and protection"
  },
  {
    id: "self-help-group",
    name: "Self Help Group",
    icon: HelpCircle,
    description: "Community self-help organization"
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
    id: "individual",
    name: "Individual",
    icon: User,
    description: "Private individual host"
  },
  {
    id: "cafe",
    name: "Cafe",
    icon: Coffee,
    description: "Coffee shop or restaurant"
  },
  {
    id: "hotel",
    name: "Hotel",
    icon: Building,
    description: "Hotel or resort"
  },
  {
    id: "budget-hotel",
    name: "Budget Hotel",
    icon: Home,
    description: "Affordable accommodation"
  }
];

export const propertyTypesMap = new Map(
  propertyTypes.map(type => [type.name, type])
);

export const propertyTypeNames = propertyTypes.map(type => type.name);
