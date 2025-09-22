import { apiConnector } from "../apiconnector";
import { hostEndpoint } from "../apis";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";

const {
  UPDATE_HOST_API
} = hostEndpoint;

export async function updateHostData(data: any) {
    
    const token=localStorage.getItem("token") || null;
    const toastId = toast.loading("Updating user data...");
    try{
        console.log("Data to be sent host:", data);
        const formdata = new FormData();

        // Add basic fields
        formdata.append('organizationName', data.organizationName || '');
        formdata.append('bio', data.bio || '');
        formdata.append('profileCompletion', data.profileCompletion || false);
        formdata.append('isPaidHost', data.isPaidHost || false);

        // Add designation array
        if (data.designation && Array.isArray(data.designation)) {
            data.designation.forEach((item: string, index: number) => {
                formdata.append(`designation[${index}]`, item);
            });
        }

        // Add organizationType array
        if (data.organizationType && Array.isArray(data.organizationType)) {
            data.organizationType.forEach((item: string, index: number) => {
                formdata.append(`organizationType[${index}]`, item);
            });
        }

        // Add needOfVolunteer array
        if (data.needOfVolunteer && Array.isArray(data.needOfVolunteer)) {
            data.needOfVolunteer.forEach((item: string, index: number) => {
                formdata.append(`needOfVolunteer[${index}]`, item);
            });
        }

        // Add socialLinks object
        if (data.socialLinks) {
            formdata.append('socialLinks[instagram]', data.socialLinks.instagram || '');
            formdata.append('socialLinks[linkedin]', data.socialLinks.linkedin || '');
            formdata.append('socialLinks[website]', data.socialLinks.website || '');
        }

        // Add businessDocument
        if (data.businessDocument) {
            if (data.businessDocument.file && data.businessDocument.file instanceof File) {
                formdata.append('businessDocument', data.businessDocument.file);
            }
        }

        // Add opportunitiesPosted array (if needed)
        if (data.opportunitiesPosted && Array.isArray(data.opportunitiesPosted)) {
            data.opportunitiesPosted.forEach((item: any, index: number) => {
                formdata.append(`opportunitiesPosted[${index}]`, JSON.stringify(item));
            });
        }

        // Add reviews array (if needed)
        if (data.reviews && Array.isArray(data.reviews)) {
            data.reviews.forEach((item: any, index: number) => {
                formdata.append(`reviews[${index}]`, JSON.stringify(item));
            });
        }

        // Log FormData contents for debugging
        console.log("FormData contents:");
        for (let [key, value] of formdata.entries()) {
            console.log(key, value);
        }
        console.log("f",formdata)

        const headers: any = {};

        if(token){
        headers.Authorization = `Bearer ${token}`;
       }

        const response = await apiConnector("POST", UPDATE_HOST_API, formdata, {
            'Content-Type': 'multipart/form-data',
            ...headers
        });
        console.log("host response update ",response)
        if (response && response.data?.success) {
            toast.success(response.data.message || "Host data updated successfully", {
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