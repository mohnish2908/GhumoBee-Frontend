import { apiConnector } from "../apiconnector";
import { volunteerEndpoint } from "../apis";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";
import { SubscriptionStatusResponse } from "../../types";

const {
  UPDATE_VOLUNTEER_API,
  GET_SUBSCRIPTION_STATUS_API
} = volunteerEndpoint;

export async function updateVolunteerData(data: any) {
    const toastId = toast.loading("Updating volunteer data...");
    const token=localStorage.getItem("token") || null;

    try{
        // console.log(data);
         const headers: any = {};

        if(token){
        headers.Authorization = `Bearer ${token}`;
       }

        const response = await apiConnector("POST", UPDATE_VOLUNTEER_API, data, {
            headers
        });

        if (response && response.data?.success) {
            toast.success(response.data.message || "Volunteer data updated successfully", {
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
            "Could not update host data";
        toast.error(errorMessage, { id: toastId });
        return null;
    }
}

export async function getSubscriptionStatus(): Promise<SubscriptionStatusResponse | null> {
    const token = localStorage.getItem("token") || null;

    try {
        const headers: any = {};
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const response = await apiConnector("GET", GET_SUBSCRIPTION_STATUS_API, undefined, {
            headers
        });

        if (response && response.data?.success) {
            return response.data.data; // Returns subscription status object
        }
        return null;
    } catch (err) {
        const axiosError = err as AxiosError;
        console.error("Error fetching subscription status:", axiosError);
        return null;
    }
}