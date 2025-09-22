import { apiConnector } from "../apiconnector";
import { opportunityEndpoint } from "../apis";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";

const {
  CREATE_OPPORTUNITY_API,
  GET_HOST_OPPORTUNITIES_API,
  EDIT_OPPORTUNITY_API,
  DELETE_OPPORTUNITY_API,
  GET_OPPORTUNITY_BY_ID_API,
  GET_ALL_OPPORTUNITIES_API
} = opportunityEndpoint;

export async function createOpportunity(data: any) {
  const toastId = toast.loading("Creating opportunity...");
  const token = localStorage.getItem("token") || null;
  try {
    // console.log("Creating opportunity with data:", data);
    const formdata = new FormData();

    // Add text fields with validation
    formdata.append("aboutLocation", data.aboutLocation || "");
    formdata.append("businessLink", data.businessLink || "");
    formdata.append("daysOff", data.daysOff?.toString() || "0");
    formdata.append("description", data.description || "");
    formdata.append("district", data.district || "");
    formdata.append("expectations", data.expectations || "");
    formdata.append("location", data.location || "");
    
    // Handle null/undefined maximumDuration properly
    if (data.maximumDuration !== null && data.maximumDuration !== undefined) {
      formdata.append("maximumDuration", data.maximumDuration.toString());
    }
    
    formdata.append("meals", data.meals || "");
    formdata.append("minimumDuration", data.minimumDuration?.toString() || "1");
    formdata.append("propertyAddress", data.propertyAddress || "");
    formdata.append("propertyName", data.propertyName || "");
    formdata.append("safeForFemale", data.safeForFemale?.toString() || "false");
    formdata.append("state", data.state || "");
    formdata.append("title", data.title || "");
    formdata.append("volunteerIn", data.volunteerIn || "");
    formdata.append("volunteerNeeded", data.volunteerNeeded?.toString() || "1");
    formdata.append("workingHours", data.workingHours?.toString() || "0");

    // Add array fields
    if (data.amenities && Array.isArray(data.amenities)) {
      data.amenities.forEach((amenity: string) => {
        formdata.append("amenities", amenity);
      });
    }

    if (data.propertyType && Array.isArray(data.propertyType)) {
      data.propertyType.forEach((type: string) => {
        formdata.append("propertyType", type);
      });
    }

    if (data.roomType && Array.isArray(data.roomType)) {
      data.roomType.forEach((type: string) => {
        formdata.append("roomType", type);
      });
    }

    if (data.skills && Array.isArray(data.skills)) {
      data.skills.forEach((skill: string) => {
        formdata.append("skills", skill);
      });
    }

    if (data.transport && Array.isArray(data.transport)) {
      data.transport.forEach((transportType: string) => {
        formdata.append("transport", transportType);
      });
    }

    // Add existing images (as JSON string or IDs)
    if (data.existingImages && Array.isArray(data.existingImages)) {
      data.existingImages.forEach((image: any) => {
        formdata.append("existingImages", typeof image === 'string' ? image : JSON.stringify(image));
      });
    }

    // Add new image files
    if (data.newImages && Array.isArray(data.newImages)) {
      // console.log("Processing newImages:", data.newImages);
      
      data.newImages.forEach((imageObj: any, index: number) => {
        // Check if it's an object with a file property
        if (imageObj && typeof imageObj === 'object' && imageObj.file) {
          if (imageObj.file instanceof File) {
            console.log(`Adding File at index ${index}:`, imageObj.file.name, imageObj.file.size, 'bytes');
            formdata.append("newImages", imageObj.file);
          } else {
            console.warn(`File property at index ${index} is not a File object:`, imageObj.file);
          }
        } else if (imageObj instanceof File) {
          // Direct File object
          console.log(`Adding direct File at index ${index}:`, imageObj.name, imageObj.size, 'bytes');
          formdata.append("newImages", imageObj);
        } else {
          console.warn(`Item at index ${index} is not a File object or doesn't have a file property:`, imageObj);
        }
      });
    }

    const headers: any = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }


    // for (let [key, value] of formdata.entries()) {
    //   if (value instanceof File) {
    
    //   } else {
     
    //   }
    // }

    const response = await apiConnector("POST", CREATE_OPPORTUNITY_API, formdata, { headers });
    if (response && response.data?.success) {
      toast.success(response.data.message || "Opportunity created successfully", {
        id: toastId,
      });
      return response;
    }
  } catch (err) {
    console.error("Full error object:", err);
    const axiosError = err as AxiosError;
    
    // Log detailed error information for debugging
    if (axiosError.response) {
      console.error("Error Status:", axiosError.response.status);
      console.error("Error Data:", axiosError.response.data);
      console.error("Error Headers:", axiosError.response.headers);
    } else if (axiosError.request) {
      console.error("No response received:", axiosError.request);
    } else {
      console.error("Request setup error:", axiosError.message);
    }
    
    const errorMessage =
      (axiosError?.response?.data as any)?.message ||
      axiosError?.message ||
      "Could not create opportunity";
    toast.error(errorMessage, { id: toastId });
    throw err;
  }
}

export async function getHostOpportunities() {
  const token = localStorage.getItem("token") || null;
  
  try {
    const headers: any = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    } 

    console.log("api", GET_HOST_OPPORTUNITIES_API);

    const response = await apiConnector("GET", GET_HOST_OPPORTUNITIES_API, undefined, { headers });
    console.log("getHostOpportunities API response:", response);
    
    if (response && response.data?.success) {
      return response; // Return the full response, Redux slice will extract what it needs
    } else {
      throw new Error(response?.data?.message || "Failed to fetch opportunities");
    }
  } catch (err) {
    console.error("Full error object:", err);
    const axiosError = err as AxiosError;
    
    // Log detailed error information for debugging
    if (axiosError.response) {
      console.error("Error Status:", axiosError.response.status);
      console.error("Error Data:", axiosError.response.data);
      console.error("Error Headers:", axiosError.response.headers);
    } else if (axiosError.request) {
      console.error("No response received:", axiosError.request);
    } else {
      console.error("Request setup error:", axiosError.message);
    }
    
    const errorMessage =
      (axiosError?.response?.data as any)?.message ||
      axiosError?.message ||
      "Could not fetch opportunities";
    throw new Error(errorMessage);
  }
}

export async function editOpportunity(id: string, data: any) {
  const token = localStorage.getItem("token") || null;
  
  try {
    let formdata: FormData;
    
    // Check if data is already FormData (from Redux slice) or needs to be converted
    if (data instanceof FormData) {
      formdata = data;
    } else {
      // Create FormData from regular object (for direct calls)
      formdata = new FormData();

      // Add text fields with validation (same as createOpportunity but conditional)
      if (data.aboutLocation !== undefined) formdata.append("aboutLocation", data.aboutLocation || "");
      if (data.businessLink !== undefined) formdata.append("businessLink", data.businessLink || "");
      if (data.daysOff !== undefined) formdata.append("daysOff", data.daysOff?.toString() || "0");
      if (data.description !== undefined) formdata.append("description", data.description || "");
      if (data.district !== undefined) formdata.append("district", data.district || "");
      if (data.expectations !== undefined) formdata.append("expectations", data.expectations || "");
      if (data.location !== undefined) formdata.append("location", data.location || "");
      
      // Handle null/undefined maximumDuration properly
      if (data.maximumDuration !== undefined) {
        if (data.maximumDuration !== null) {
          formdata.append("maximumDuration", data.maximumDuration.toString());
        }
      }
      
      if (data.meals !== undefined) formdata.append("meals", data.meals || "");
      if (data.minimumDuration !== undefined) formdata.append("minimumDuration", data.minimumDuration?.toString() || "1");
      if (data.propertyAddress !== undefined) formdata.append("propertyAddress", data.propertyAddress || "");
      if (data.propertyName !== undefined) formdata.append("propertyName", data.propertyName || "");
      if (data.safeForFemale !== undefined) formdata.append("safeForFemale", data.safeForFemale?.toString() || "false");
      if (data.state !== undefined) formdata.append("state", data.state || "");
      if (data.title !== undefined) formdata.append("title", data.title || "");
      if (data.volunteerIn !== undefined) formdata.append("volunteerIn", data.volunteerIn || "");
      if (data.volunteerNeeded !== undefined) formdata.append("volunteerNeeded", data.volunteerNeeded?.toString() || "1");
      if (data.workingHours !== undefined) formdata.append("workingHours", data.workingHours?.toString() || "0");
      if (data.status !== undefined) formdata.append("status", data.status || "draft");

      // Add array fields
      if (data.amenities && Array.isArray(data.amenities)) {
        data.amenities.forEach((amenity: string) => {
          formdata.append("amenities", amenity);
        });
      }

      if (data.propertyType && Array.isArray(data.propertyType)) {
        data.propertyType.forEach((type: string) => {
          formdata.append("propertyType", type);
        });
      }

      if (data.roomType && Array.isArray(data.roomType)) {
        data.roomType.forEach((type: string) => {
          formdata.append("roomType", type);
        });
      }

      if (data.skills && Array.isArray(data.skills)) {
        data.skills.forEach((skill: string) => {
          formdata.append("skills", skill);
        });
      }

      if (data.transport && Array.isArray(data.transport)) {
        data.transport.forEach((transportType: string) => {
          formdata.append("transport", transportType);
        });
      }

      // Add existing images (as JSON string or IDs)
      if (data.existingImages && Array.isArray(data.existingImages)) {
        data.existingImages.forEach((image: any) => {
          formdata.append("existingImages", typeof image === 'string' ? image : JSON.stringify(image));
        });
      }

      // Add new image files
      if (data.newImages && Array.isArray(data.newImages)) {
        data.newImages.forEach((imageObj: any, index: number) => {
          // Check if it's an object with a file property
          if (imageObj && typeof imageObj === 'object' && imageObj.file) {
            if (imageObj.file instanceof File) {
              console.log(`Adding File at index ${index}:`, imageObj.file.name, imageObj.file.size, 'bytes');
              formdata.append("newImages", imageObj.file);
            } else {
              console.warn(`File property at index ${index} is not a File object:`, imageObj.file);
            }
          } else if (imageObj instanceof File) {
            // Direct File object
            console.log(`Adding direct File at index ${index}:`, imageObj.name, imageObj.size, 'bytes');
            formdata.append("newImages", imageObj);
          } else {
            console.warn(`Item at index ${index} is not a File object or doesn't have a file property:`, imageObj);
          }
        });
      }
    }

    const headers: any = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await apiConnector("PUT", `${EDIT_OPPORTUNITY_API}/${id}`, formdata, { headers });

    if (response && response.data?.success) {
      return response.data;
    } else {
      throw new Error(response?.data?.message || "Failed to update opportunity");
    }
  } catch (err) {
    console.error("Full error object:", err);
    const axiosError = err as AxiosError;
    
    // Log detailed error information for debugging
    if (axiosError.response) {
      console.error("Error Status:", axiosError.response.status);
      console.error("Error Data:", axiosError.response.data);
      console.error("Error Headers:", axiosError.response.headers);
    } else if (axiosError.request) {
      console.error("No response received:", axiosError.request);
    } else {
      console.error("Request setup error:", axiosError.message);
    }
    
    const errorMessage =
      (axiosError?.response?.data as any)?.message ||
      axiosError?.message ||
      "Could not update opportunity";
    throw new Error(errorMessage);
  }
}

export async function deleteOpportunity(id: string) {
  const token = localStorage.getItem("token") || null;
  
  try {
    const headers: any = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await apiConnector("DELETE", `${DELETE_OPPORTUNITY_API}/${id}`, undefined, { headers });
    
    if (response && response.data?.success) {
      return response.data;
    } else {
      throw new Error(response?.data?.message || "Failed to delete opportunity");
    }
  } catch (err) {
    console.error("Full error object:", err);
    const axiosError = err as AxiosError;
    
    // Log detailed error information for debugging
    if (axiosError.response) {
      console.error("Error Status:", axiosError.response.status);
      console.error("Error Data:", axiosError.response.data);
      console.error("Error Headers:", axiosError.response.headers);
    } else if (axiosError.request) {
      console.error("No response received:", axiosError.request);
    } else {
      console.error("Request setup error:", axiosError.message);
    }
    
    const errorMessage =
      (axiosError?.response?.data as any)?.message ||
      axiosError?.message ||
      "Could not delete opportunity";
    throw new Error(errorMessage);
  }
}

export async function getOpportunityById(id: string) {
  const token = localStorage.getItem("token") || null;
  
  try {
    const headers: any = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await apiConnector("GET", `${GET_OPPORTUNITY_BY_ID_API}/${id}`, undefined, { headers });
    
    if (response && response.data?.success) {
      return response.data;
    } else {
      throw new Error(response?.data?.message || "Failed to fetch opportunity");
    }
  } catch (err) {
    console.error("Full error object:", err);
    const axiosError = err as AxiosError;
    
    // Log detailed error information for debugging
    if (axiosError.response) {
      console.error("Error Status:", axiosError.response.status);
      console.error("Error Data:", axiosError.response.data);
      console.error("Error Headers:", axiosError.response.headers);
    } else if (axiosError.request) {
      console.error("No response received:", axiosError.request);
    } else {
      console.error("Request setup error:", axiosError.message);
    }
    
    const errorMessage =
      (axiosError?.response?.data as any)?.message ||
      axiosError?.message ||
      "Could not fetch opportunity";
    throw new Error(errorMessage);
  }
}

//not being used currently
export async function getFilteredOpportunities(filters: any) {
  try{
    
  }
  catch (err) {
    console.error("Full error object:", err);
    const axiosError = err as AxiosError;

    // Log detailed error information for debugging
    if (axiosError.response) {
      console.error("Error Status:", axiosError.response.status);
      console.error("Error Data:", axiosError.response.data);
      console.error("Error Headers:", axiosError.response.headers);
    } else if (axiosError.request) {
      console.error("No response received:", axiosError.request);
    } else {
      console.error("Request setup error:", axiosError.message);
    }

    const errorMessage =
      (axiosError?.response?.data as any)?.message ||
      axiosError?.message ||
      "Could not fetch filtered opportunities";
    throw new Error(errorMessage);
  }
}

export async function getAllOpportunities() {
  try{
    const response = await apiConnector("GET", GET_ALL_OPPORTUNITIES_API);
    
    if (response && response.data?.success) {
      return response.data;
    } else {
      throw new Error(response?.data?.message || "Failed to fetch opportunities");
    }
    
  }
  catch (err) {
    console.error("Full error object:", err);
    const axiosError = err as AxiosError;
    
    // Log detailed error information for debugging
    if (axiosError.response) {
      console.error("Error Status:", axiosError.response.status);
      console.error("Error Data:", axiosError.response.data);
      console.error("Error Headers:", axiosError.response.headers);
    } else if (axiosError.request) {
      console.error("No response received:", axiosError.request);
    } else {
      console.error("Request setup error:", axiosError.message);
    }
    
    const errorMessage =
      (axiosError?.response?.data as any)?.message ||
      axiosError?.message ||
      "Could not update opportunity";
    throw new Error(errorMessage);
  }
}