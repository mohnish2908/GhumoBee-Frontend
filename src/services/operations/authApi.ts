import { apiConnector } from "../apiconnector";
import { endpoints } from "../apis";
import { toast } from "react-hot-toast";
import { setLoading, setUser, clearUser } from "../../slices/userSlice";
import { AxiosError } from "axios";
import { clearOpportunities } from "../../slices/opportunitySlice";

const {
  LOGIN_API,
  CREATE_USER_API,
  FORGOT_PASSWORD_API,
  CHANGE_PASSWORD_API,
  GET_USER_API,
  UPDATE_USER_API,
  CONTACT_US_API
} = endpoints;

const token = localStorage.getItem("token") || null;

// Forgot Password API: takes only email
export async function forgotPassword(email: string) {
  const toastId = toast.loading("Sending reset email...");
  try {
    const response = await apiConnector("POST", FORGOT_PASSWORD_API, { email });
    if (response && response.data?.success) {
      toast.success(response.data.message || "Reset email sent", {
        id: toastId,
      });
      return response;
    }
  } catch (err) {
    const axiosError = err as AxiosError;
    const errorMessage =
      (axiosError?.response?.data as any)?.message ||
      axiosError?.message ||
      "Could not send reset email";
    toast.error(errorMessage, { id: toastId });
    return null;
  }
}

// Change Password API: takes email, otp, password, confirmPassword
export async function changePassword(data: {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
}) {
  const toastId = toast.loading("Changing password...");
  try {
    const response = await apiConnector("POST", CHANGE_PASSWORD_API, data);
    if (response && response.data?.success) {
      toast.success(response.data.message || "Password changed successfully", {
        id: toastId,
      });
      return response;
    }
  } catch (err) {
    const axiosError = err as AxiosError;
    const errorMessage =
      (axiosError?.response?.data as any)?.message ||
      axiosError?.message ||
      "Could not change password";
    toast.error(errorMessage, { id: toastId });
    return null;
  }
}

interface LoginData {
  email: string;
  password: string;
}

export function login(data: LoginData) {
  return async (dispatch: any) => {
    const toastId = toast.loading("Logging In...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", LOGIN_API, data);
      console.log("login response:", response);

      if (response && response.data?.success) {
        // Correctly access the nested 'data' object from your API response
        const { user, token } = response.data;

        // Prepare the base user payload
        const userPayload: any = {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profilePicture: user.profilePicture?.url || null,
          city: user.city,
          state: user.state,
          isVerified: user.isVerified,
          token: token,
        };

        // If the user is a 'volunteer', add their specific details
        if (user.role === "volunteer" && user.volunteer) {
          userPayload.skills = user.volunteer.skills;
          userPayload.subscriptionPlan = user.volunteer.subscriptionPlan;
          userPayload.membershipExpiresAt = user.volunteer.membershipExpiresAt;
        }

        // Dispatch the complete payload to the Redux store
        dispatch(setUser(userPayload));

        toast.success("Login Successful", { id: toastId });
        return response;
      }
    } catch (err) {
      console.error("LOGIN API ERROR:", err);
      const axiosError = err as AxiosError;
      const errorMessage =
        (axiosError?.response?.data as any)?.message ||
        axiosError?.message ||
        "Could not login";
      toast.error(errorMessage, { id: toastId });
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export async function createUser(data: any) {
  const toastId = toast.loading("Signing Up...");
  try {
    console.log("aaa", data);
    const response = await apiConnector("POST", CREATE_USER_API, data);

    toast.success(response.data.message, { id: toastId });
    console.log("response create user", response);
    return response;
  } catch (err) {
    console.error("CREATE USER API ERROR:", err);
    const axiosError = err as AxiosError;

    const errorMessage =
      (axiosError?.response?.data as any)?.message ||
      axiosError?.message ||
      "Could not create user";

    toast.error(errorMessage, { id: toastId });
    return null;
  }
}

export async function getUserData(email: string) {
  const toastId = toast.loading("Fetching profile data...");
  try {
    console.log("Fetching user data for email:", email);
    const response = await apiConnector("POST", GET_USER_API, { email });
    console.log("Volunteer data fetched:", response);
    if (response && response.data?.success) {
      toast.success("Profile data loaded", { id: toastId });
      return response.data;
    }
  } catch (err) {
    const axiosError = err as AxiosError;
    const errorMessage =
      (axiosError?.response?.data as any)?.message ||
      axiosError?.message ||
      "Could not fetch profile data";
    toast.error(errorMessage, { id: toastId });
    return null;
  }
}

export async function updateUserData(data: any, dispatch?: any) {
  const toastId = toast.loading("Updating profile...");
  try {
    console.log("send", data);
    
    const formData = new FormData();
    
    Object.keys(data).forEach(key => {
      if (key !== 'profilePictureFile' && key !== 'aadhaarDocFile' && data[key] !== null && data[key] !== undefined) {
        if (Array.isArray(data[key])) {
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      }
    });
    
    if (data.profilePictureFile) {
      formData.append('profilePicture', data.profilePictureFile);
    }
    
    if (data.aadhaarDocFile) {
      formData.append('aadhaarDoc', data.aadhaarDocFile);
    }

    const headers: any = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    console.log("formdata", [...formData]);

    const response = await apiConnector("PUT", UPDATE_USER_API, formData, headers);
    console.log("Profile update response:", response);
    
    if (response && response.data?.success && response.data?.data) {
      const updatedUserData = response.data.data;
      
      const existingUserData = JSON.parse(localStorage.getItem("user") || "{}");
      
      const userDataForStorage = {
        ...existingUserData,
        _id: updatedUserData._id,
        name: updatedUserData.name,
        email: updatedUserData.email,
        role: updatedUserData.role,
        profilePicture: updatedUserData.profilePicture?.url || updatedUserData.profilePicture,
        city: updatedUserData.city,
        state: updatedUserData.state,
        isVerified: updatedUserData.isVerified,
      };
      
      localStorage.setItem("user", JSON.stringify(userDataForStorage));
      
      if (dispatch) {
        dispatch(setUser({
          _id: updatedUserData._id,
          name: updatedUserData.name,
          email: updatedUserData.email,
          role: updatedUserData.role,
          profilePicture: updatedUserData.profilePicture?.url || updatedUserData.profilePicture,
          city: updatedUserData.city,
          state: updatedUserData.state,
          isVerified: updatedUserData.isVerified,
        }));
      }
      
      console.log("Updated localStorage user data:", userDataForStorage);
      
      toast.success("Profile updated successfully", { id: toastId });
      return response.data;
    }

    toast.success("Profile updated successfully", { id: toastId });
    return { success: true };
  } catch (err) {
    const axiosError = err as AxiosError;
    const errorMessage =
      (axiosError?.response?.data as any)?.message ||
      axiosError?.message ||
      "Could not update profile";
    toast.error(errorMessage, { id: toastId });
    return null;
  }
}

export function logout() {
  return async (dispatch: any) => {
    try {
      document.cookie.split(";").forEach((c) => {
        const eqPos = c.indexOf("=");
        const name = eqPos > -1 ? c.substr(0, eqPos) : c;
        document.cookie =
          name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        document.cookie =
          name +
          "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" +
          window.location.hostname;
        document.cookie =
          name +
          "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=." +
          window.location.hostname;
      });

      dispatch(clearUser());
      dispatch(clearOpportunities());
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      dispatch(clearUser());
      toast.success("Logged out successfully");
    }
  };
}

export async function contactUs(data: {name:string,email:string,subject:string,message:string}){
  const toastId = toast.loading("Sending message...");
  try{
    console.log("data",data);
    const response = await apiConnector("POST", CONTACT_US_API, data);
    if (response && response.data?.success) {
      toast.success("Message sent successfully", { id: toastId });
      return response.data;
    }
    toast.error("Failed to send message", { id: toastId });
    return null;
  }
  catch (err) {
    const axiosError = err as AxiosError;
    const errorMessage =
      (axiosError?.response?.data as any)?.message ||
      axiosError?.message ||
      "Could not fetch profile data";
    toast.error(errorMessage, { id: toastId });
    return null;
  }
}