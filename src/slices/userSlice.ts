import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for a single skill for better type safety
interface Skill {
  _id: string;
  skillName: string;
  proficiencyLevel: string;
  // Add other skill properties if needed
}

// STEP 1: Add the new volunteer-specific fields to the UserState interface
interface UserState {
  _id: string | null;
  name: string;
  email: string | null;
  role: string | null;
  profilePicture: string | null;
  city: string;
  state: string;
  isVerified: boolean;
  token: string | null;
  loading: boolean;
  // Volunteer-specific fields
  skills: Skill[];
  subscriptionPlan: string | null;
  membershipExpiresAt: string | null;
}

// Helper functions for localStorage (updated to handle new fields)
const loadUserFromStorage = (): Partial<UserState> => {
  try {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (user && token) {
      return { ...JSON.parse(user), token };
    }
  } catch (error) {
    console.error("Error loading user from localStorage:", error);
  }
  return {};
};

const saveUserToStorage = (user: Partial<UserState>) => {
  try {
    const { token, ...userData } = user;
    if (token) localStorage.setItem("token", token);
    // Ensure we are saving the complete user data object
    if (userData._id) localStorage.setItem("user", JSON.stringify(userData));
  } catch (error) {
    console.error("Error saving user to localStorage:", error);
  }
};

const clearUserFromStorage = () => {
  try {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  } catch (error) {
    console.error("Error clearing user from localStorage:", error);
  }
};

const storageData = loadUserFromStorage();

// STEP 2: Initialize the new fields in the initial state
const initialState: UserState = {
  _id: storageData._id || null,
  name: storageData.name || "",
  email: storageData.email || null,
  role: storageData.role || null,
  profilePicture: storageData.profilePicture || null,
  city: storageData.city || "",
  state: storageData.state || "",
  isVerified: storageData.isVerified || false,
  token: storageData.token || null,
  loading: false,
  // Initialize new fields
  skills: storageData.skills || [],
  subscriptionPlan: storageData.subscriptionPlan || null,
  membershipExpiresAt: storageData.membershipExpiresAt || null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // STEP 3: Update the setUser reducer to handle the new fields
    setUser: (state, action: PayloadAction<Partial<UserState>>) => {
      // Keep existing fields
      if (action.payload._id !== undefined) state._id = action.payload._id;
      if (action.payload.name !== undefined) state.name = action.payload.name;
      if (action.payload.email !== undefined) state.email = action.payload.email;
      if (action.payload.role !== undefined) state.role = action.payload.role;
      if (action.payload.profilePicture !== undefined)
        state.profilePicture = action.payload.profilePicture;
      if (action.payload.city !== undefined) state.city = action.payload.city;
      if (action.payload.state !== undefined) state.state = action.payload.state;
      if (action.payload.isVerified !== undefined)
        state.isVerified = action.payload.isVerified;
      if (action.payload.token !== undefined) state.token = action.payload.token;

      // Add logic for new volunteer fields
      if (action.payload.skills !== undefined)
        state.skills = action.payload.skills;
      if (action.payload.subscriptionPlan !== undefined)
        state.subscriptionPlan = action.payload.subscriptionPlan;
      if (action.payload.membershipExpiresAt !== undefined)
        state.membershipExpiresAt = action.payload.membershipExpiresAt;

      // Save the complete, updated state to localStorage
      saveUserToStorage(state);
    },
    
    setUserWithToken: (state, action: PayloadAction<{ user: any; token: string; name?: string }>) => {
      const { user, token, name } = action.payload;
      
      state._id = user._id;
      state.name = name || "";
      state.email = user.email;
      state.role = user.role;
      state.profilePicture = user.profilePicture || null;
      state.city = user.city || "";
      state.state = user.state || "";
      state.isVerified = user.isVerified;
      state.token = token;
      
      saveUserToStorage(state);
    },
    
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
      if (action.payload) {
        localStorage.setItem('token', action.payload);
      } else {
        localStorage.removeItem('token');
      }
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // STEP 4: Update clearUser to reset the new fields on logout
    clearUser: (state) => {
      state._id = null;
      state.name = "";
      state.email = null;
      state.role = null;
      state.profilePicture = null;
      state.city = "";
      state.state = "";
      state.isVerified = false;
      state.token = null;
      state.loading = false;
      // Reset new fields
      state.skills = [];
      state.subscriptionPlan = null;
      state.membershipExpiresAt = null;

      clearUserFromStorage();
    },
  },
});

export const { setUser, setUserWithToken, setToken, setLoading, clearUser } = userSlice.actions;
export default userSlice.reducer;