// meals.ts
import { 
  Utensils, 
  Coffee, 
  Sun, 
  Plus,
  Cookie,
  X
} from 'lucide-react';

export interface MealOption {
  id: string;
  name: string;
  icon: typeof Utensils;
  description?: string;
}

export const mealOptions: MealOption[] = [
  {
    id: "1-meal",
    name: "1 Meal",
    icon: Utensils,
    description: "One meal per day provided"
  },
  {
    id: "2-meals",
    name: "2 Meals",
    icon: Utensils,
    description: "Two meals per day provided"
  },
  {
    id: "3-meals",
    name: "3 Meals",
    icon: Utensils,
    description: "Three meals per day provided"
  },
  {
    id: "3-meals-snacks",
    name: "3 meals+ snacks",
    icon: Utensils,
    description: "Three meals plus snacks provided"
  },
  {
    id: "No-meal",
    name: "No Meal",
    icon: X,
    description: "Only snacks provided"
  }
];

export const mealOptionsMap = new Map(
  mealOptions.map(option => [option.name, option])
);

export const mealOptionNames = mealOptions.map(option => option.name);
