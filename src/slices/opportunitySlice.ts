import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getHostOpportunities, editOpportunity, getOpportunityById } from "../services/operations/opportunityApi";

interface Opportunity {
  _id: string;
  title: string;
  description: string;
  volunteerIn: string;
  state: string;
  district: string;
  propertyName: string;
  propertyAddress: string;
  propertyType: string[];
  businessLink: string;
  volunteerNeeded: number;
  safeForFemale: boolean;
  location: string;
  roomType: string[];
  meals: string;
  amenities: string[];
  transport: string[];
  workingHours: number;
  daysOff: number;
  minimumDuration: number;
  maximumDuration: number | null;
  skills: string[];
  expectations: string;
  aboutLocation: string;
  images: any[];
  status: 'active' | 'inactive' | 'draft';
  applicationsCount: number;
  createdAt: string;
  updatedAt: string;
}

interface OpportunityState {
  opportunities: Opportunity[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  updating: boolean;
}

const initialState: OpportunityState = {
  opportunities: [],
  loading: false,
  error: null,
  lastFetched: null,
  updating: false,
};

// Fetch host opportunities
export const fetchHostOpportunities = createAsyncThunk(
  'opportunity/fetchHostOpportunities',
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching host opportunities...");
      
      const response = await getHostOpportunities();
      console.log("Redux slice received response:", response);
      
      // Handle the correct response structure
      if (response?.data?.success && response?.data?.opportunities) {
        return response.data.opportunities; // Return the opportunities array
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error: any) {
      console.error("fetchHostOpportunities error:", error);
      return rejectWithValue(error.message || "Failed to fetch opportunities");
    }
  }
);

// Update opportunity
export const updateOpportunityData = createAsyncThunk(
  'opportunity/updateOpportunity',
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      console.log("slice data", data);
      
      // Convert data to FormData for file uploads
      const formData = new FormData();
      
      // Add all non-file fields to FormData
      Object.keys(data).forEach(key => {
        if (key === 'newImages' || key === 'existingImages') {
          // Skip these, handle separately
          return;
        }
        
        const value = data[key];
        if (Array.isArray(value)) {
          // For arrays, stringify them
          formData.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });
      
      // Handle existing images
      if (data.existingImages && Array.isArray(data.existingImages)) {
        formData.append('existingImages', JSON.stringify(data.existingImages));
      }
      
      // Handle new image files
      if (data.newImages && Array.isArray(data.newImages)) {
        data.newImages.forEach((imageData: any) => {
          if (imageData.file && imageData.file instanceof File) {
            formData.append('newImages', imageData.file);
          }
        });
      }
      
      console.log("FormData prepared for API:", formData);
      
      const response = await editOpportunity(id, formData);
      console.log("API response:", response);
      
      // Handle different response structures
      if (response.opportunity) {
        return response.opportunity;
      } else if (response.data) {
        return response.data;
      } else {
        // If no opportunity data returned, fetch the updated opportunity
        try {
          const updatedOpportunity = await getOpportunityById(id);
          if (updatedOpportunity?.data?.opportunity) {
            return updatedOpportunity.data.opportunity;
          }
        } catch (fetchError) {
          console.warn("Failed to fetch updated opportunity:", fetchError);
        }
        
        // Final fallback - create a clean serializable object
        const cleanData = { ...data };
        // Remove non-serializable File objects
        delete cleanData.newImages;
        delete cleanData.existingImages;
        return { ...cleanData, _id: id };
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update opportunity");
    }
  }
);

const opportunitySlice = createSlice({
  name: 'opportunity',
  initialState,
  reducers: {
    clearOpportunities: (state) => {
      state.opportunities = [];
      state.loading = false;
      state.error = null;
      state.lastFetched = null;
      state.updating = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateOpportunityLocal: (state, action) => {
      const index = state.opportunities.findIndex(op => op._id === action.payload._id);
      if (index !== -1) {
        state.opportunities[index] = action.payload;
      }
    },
    addOpportunity: (state, action) => {
      state.opportunities.unshift(action.payload);
    },
    invalidateCache: (state) => {
      state.lastFetched = null;
    },
    // Add this new action to clear on user change
    clearOnUserChange: (state) => {
      state.opportunities = [];
      state.loading = false;
      state.error = null;
      state.lastFetched = null;
      state.updating = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch opportunities
      .addCase(fetchHostOpportunities.pending, (state) => {
        state.loading = true;
        state.error = null;
        // Clear previous opportunities when starting a new fetch
        state.opportunities = [];
      })
      .addCase(fetchHostOpportunities.fulfilled, (state, action) => {
        state.loading = false;
        state.opportunities = action.payload; // This is now the opportunities array
        state.lastFetched = Date.now();
        console.log("Opportunities stored in Redux:", action.payload);
      })
      .addCase(fetchHostOpportunities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error("fetchHostOpportunities rejected:", action.payload);
      })
      
      // Update opportunity
      .addCase(updateOpportunityData.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateOpportunityData.fulfilled, (state, action) => {
        state.updating = false;
        const updatedOpportunity = action.payload;
        
        // Ensure we have a valid opportunity with _id
        if (updatedOpportunity && updatedOpportunity._id) {
          const index = state.opportunities.findIndex(opp => opp._id === updatedOpportunity._id);
          if (index !== -1) {
            state.opportunities[index] = updatedOpportunity;
          }
        } else {
          console.warn("Updated opportunity data is missing _id:", updatedOpportunity);
        }
      })
      .addCase(updateOpportunityData.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  clearOpportunities, 
  clearError, 
  updateOpportunityLocal, 
  addOpportunity,
  invalidateCache,
  clearOnUserChange
} = opportunitySlice.actions;

export default opportunitySlice.reducer;