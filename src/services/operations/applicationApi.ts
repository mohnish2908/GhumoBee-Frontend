import { apiConnector } from '../apiconnector';
import { toast } from "react-hot-toast";
// import { setLoading, setUser, clearUser } from "../../slices/userSlice";
import { AxiosError } from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const applicationEndpoints = {
    CREATE_APPLICATION_API: `${BASE_URL}/application/create`,
    GET_VOLUNTEER_APPLICATIONS_API: `${BASE_URL}/application/volunteer`,
}

export async function applyToOpportunity(data: any) {
    const toastId = toast.loading("Applying to opportunity...");
    try{
        const response = await apiConnector("POST", applicationEndpoints.CREATE_APPLICATION_API, data);
        if (response && response.data?.success) {
            toast.success(response.data.message || "Applied successfully", {
                id: toastId,
            });
            return response;
        }
    }
    catch (err) {
    const axiosError = err as AxiosError;
    const errorMessage =
      (axiosError?.response?.data as any)?.message ||
      axiosError?.message ||
      "Could not apply to opportunity";
    toast.error(errorMessage, { id: toastId });
    return null;
  }

}

export async function getVolunteerApplication(data : any) {
    // const toastId = toast.loading("Fetching your applications...");
    try {
        let api= applicationEndpoints.GET_VOLUNTEER_APPLICATIONS_API+`?page=${data.page}`
        if(data.status){
            api=api+`&status=${data.status}`
        }
        const response = await apiConnector("GET", api, data);
        console.log(response);
        if (response && response.data?.success) {
            // toast.success(response.data.message || "Fetched successfully", {
            //     id: toastId,
            // });
            return response;
        }
    } catch (err) {
        const axiosError = err as AxiosError;
        const errorMessage =
            (axiosError?.response?.data as any)?.message ||
            axiosError?.message ||
            "Could not fetch applications";
        // toast.error(errorMessage, { id: toastId });
        return null;
    }
}