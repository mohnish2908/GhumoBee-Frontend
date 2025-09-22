// roomTypes.ts
import { 
  Home, 
  Users, 
  Building, 
  Tent, 
  MoreHorizontal 
} from 'lucide-react';

export interface RoomType {
  id: string;
  name: string;
  icon: typeof Home;
  description?: string;
}

export const roomTypes: RoomType[] = [
  {
    id: "private-room",
    name: "Private Room",
    icon: Home,
    description: "Individual private room"
  },
  {
    id: "shared-room",
    name: "Shared Room",
    icon: Users,
    description: "Room shared with other volunteers"
  },
  {
    id: "team-dorm",
    name: "Team Dorm",
    icon: Building,
    description: "Dormitory-style accommodation"
  },
  {
    id: "camp",
    name: "Camp",
    icon: Tent,
    description: "Camping or outdoor accommodation"
  },
  {
    id: "other",
    name: "Other",
    icon: MoreHorizontal,
    description: "Other accommodation type"
  }
];

export const roomTypesMap = new Map(
  roomTypes.map(type => [type.name, type])
);

export const roomTypeNames = roomTypes.map(type => type.name);
