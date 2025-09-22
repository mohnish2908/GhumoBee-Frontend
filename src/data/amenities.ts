// amenities.ts
import { 
  Wifi, 
  Shirt, 
  Utensils, 
  Dumbbell, 
  Car, 
  Mountain, 
  Percent, 
  Award, 
  MapPin, 
  DollarSign ,
  Coffee
} from 'lucide-react';

export interface Amenity {
  id: string;
  name: string;
  icon: typeof Wifi; // Lucide React icon component type
  description?: string;
}

export const amenities: Amenity[] = [
  {
    id: "internet-access",
    name: "Internet Access",
    icon: Wifi,
    description: "High-speed WiFi available"
  },
  {
    id: "free-laundry",
    name: "Free Laundry",
    icon: Shirt,
    description: "Washing and drying facilities provided"
  },
  {
    id: "free-food",
    name: "Free Food",
    icon: Coffee,
    description: "Meals included at no extra cost"
  },
  {
    id: "free-gym",
    name: "Free Gym",
    icon: Dumbbell,
    description: "Access to fitness facilities"
  },
  {
    id: "free-transportation",
    name: "Free Transportation",
    icon: Car,
    description: "Transportation assistance provided"
  },
  {
    id: "hiking-tours",
    name: "Hiking Tours",
    icon: Mountain,
    description: "Guided hiking and nature tours"
  },
  {
    id: "discount-food",
    name: "Discount on Food",
    icon: Percent,
    description: "Reduced prices on meals and snacks"
  },
  {
    id: "certificate",
    name: "Certificate After Completion",
    icon: Award,
    description: "Official completion certificate provided"
  },
  {
    id: "local-experiences",
    name: "Local Experiences",
    icon: MapPin,
    description: "Cultural and local activities included"
  },
  {
    id: "stipend",
    name: "Stipend",
    icon: DollarSign,
    description: "Financial compensation provided"
  }
];

// Export for easy access by name
export const amenitiesMap = new Map(
  amenities.map(amenity => [amenity.name, amenity])
);

// Export just the names as an array for enum validation
export const amenityNames = amenities.map(amenity => amenity.name);
