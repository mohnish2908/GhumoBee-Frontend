// transport.ts
import { 
  Bus, 
  Car, 
  MapPin, 
  Bike, 
  X 
} from 'lucide-react';

export interface TransportOption {
  id: string;
  name: string;
  icon: typeof Bus;
  description?: string;
}

export const transportOptions: TransportOption[] = [
  {
    id: "public-transport",
    name: "Public Transport",
    icon: Bus,
    description: "Buses, trains, or other public transportation"
  },
  {
    id: "private-transport",
    name: "Private Transport",
    icon: Car,
    description: "Car or private vehicle transportation"
  },
  {
    id: "walking-distance",
    name: "Walking Distance",
    icon: MapPin,
    description: "Accessible by walking"
  },
  {
    id: "bicycle",
    name: "Bicycle",
    icon: Bike,
    description: "Bicycle transportation available"
  },
  {
    id: "none",
    name: "None",
    icon: X,
    description: "No specific transport arrangement"
  }
];

export const transportOptionsMap = new Map(
  transportOptions.map(option => [option.name, option])
);

export const transportOptionNames = transportOptions.map(option => option.name);
