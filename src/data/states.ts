// states.ts - Indian States and Union Territories
export interface State {
  id: string;
  name: string;
  type: 'state' | 'ut'; // state or union territory
}

export const indianStates: State[] = [
  // States
  { id: "1", name: "Andhra Pradesh", type: "state" },
  { id: "2", name: "Arunachal Pradesh", type: "state" },
  { id: "3", name: "Assam", type: "state" },
  { id: "4", name: "Bihar", type: "state" },
  { id: "5", name: "Chhattisgarh", type: "state" },
  { id: "6", name: "Goa", type: "state" },
  { id: "7", name: "Gujarat", type: "state" },
  { id: "8", name: "Haryana", type: "state" },
  { id: "9", name: "Himachal Pradesh", type: "state" },
  { id: "10", name: "Jharkhand", type: "state" },
  { id: "11", name: "Karnataka", type: "state" },
  { id: "12", name: "Kerala", type: "state" },
  { id: "13", name: "Madhya Pradesh", type: "state" },
  { id: "14", name: "Maharashtra", type: "state" },
  { id: "15", name: "Manipur", type: "state" },
  { id: "16", name: "Meghalaya", type: "state" },
  { id: "17", name: "Mizoram", type: "state" },
  { id: "18", name: "Nagaland", type: "state" },
  { id: "19", name: "Odisha", type: "state" },
  { id: "20", name: "Punjab", type: "state" },
  { id: "21", name: "Rajasthan", type: "state" },
  { id: "22", name: "Sikkim", type: "state" },
  { id: "23", name: "Tamil Nadu", type: "state" },
  { id: "24", name: "Telangana", type: "state" },
  { id: "25", name: "Tripura", type: "state" },
  { id: "26", name: "Uttar Pradesh", type: "state" },
  { id: "27", name: "Uttarakhand", type: "state" },
  { id: "28", name: "West Bengal", type: "state" },
  
  // Union Territories
  { id: "29", name: "Andaman and Nicobar Islands", type: "ut" },
  { id: "30", name: "Chandigarh", type: "ut" },
  { id: "31", name: "Dadra and Nagar Haveli and Daman and Diu", type: "ut" },
  { id: "32", name: "Delhi", type: "ut" },
  { id: "33", name: "Jammu and Kashmir", type: "ut" },
  { id: "34", name: "Ladakh", type: "ut" },
  { id: "35", name: "Lakshadweep", type: "ut" },
  { id: "36", name: "Puducherry", type: "ut" },
];
