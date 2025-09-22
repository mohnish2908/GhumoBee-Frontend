import { apiConnector } from '../apiconnector';

const BASE_URL = import.meta.env.VITE_API_URL;

// Admin API endpoints
export const adminEndpoints = {
  // User Management
  GET_ALL_USERS_API: `${BASE_URL}/auth/admin/users`,
  GET_USER_BY_ID_API: `${BASE_URL}/auth/admin/user`,
  SEARCH_USER_BY_EMAIL_API: `${BASE_URL}/auth/admin/search-user`,
  VERIFY_USER_API: `${BASE_URL}/auth/admin/verify-user`,
  
  // Coupon Management
  CREATE_COUPON_API: `${BASE_URL}/coupon/create`,
  GET_ALL_COUPONS_API: `${BASE_URL}/coupon/admin/all`,
  GET_COUPON_BY_ID_API: `${BASE_URL}/coupon/admin`,
  UPDATE_COUPON_API: `${BASE_URL}/coupon/admin`,
  DELETE_COUPON_API: `${BASE_URL}/coupon/admin`,
  VALIDATE_COUPON_API: `${BASE_URL}/coupon/validate`,
};

// User Management APIs
export const getAllUsers = async (params: any, token: string) => {
  try {
    const response = await apiConnector("GET", adminEndpoints.GET_ALL_USERS_API, undefined, {
      Authorization: `Bearer ${token}`,
    }, params);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserById = async (userId: string, token: string) => {
  try {
    const response = await apiConnector("GET", `${adminEndpoints.GET_USER_BY_ID_API}/${userId}`, undefined, {
      Authorization: `Bearer ${token}`,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyUser = async (userId: string, token: string) => {
  try {
    const response = await apiConnector("PUT", `${adminEndpoints.VERIFY_USER_API}/${userId}`, undefined, {
      Authorization: `Bearer ${token}`,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const searchUserByEmail = async (email: string, token: string) => {
  try {
    const response = await apiConnector("GET", adminEndpoints.SEARCH_USER_BY_EMAIL_API, undefined, {
      Authorization: `Bearer ${token}`,
    }, { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Coupon Management APIs
export const createCoupon = async (couponData: any, token: string) => {
  try {
    console.log("Creating coupon with data:", couponData);
    console.log("Using token:", token);
    const response = await apiConnector("POST", adminEndpoints.CREATE_COUPON_API, couponData, {
      Authorization: `Bearer ${token}`,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllCoupons = async (params: any, token: string) => {
  try {
    const response = await apiConnector("GET", adminEndpoints.GET_ALL_COUPONS_API, undefined, {
      Authorization: `Bearer ${token}`,
    }, params);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCouponById = async (couponId: string, token: string) => {
  try {
    const response = await apiConnector("GET", `${adminEndpoints.GET_COUPON_BY_ID_API}/${couponId}`, undefined, {
      Authorization: `Bearer ${token}`,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCoupon = async (couponId: string, couponData: any, token: string) => {
  try {
    const response = await apiConnector("PUT", `${adminEndpoints.UPDATE_COUPON_API}/${couponId}`, couponData, {
      Authorization: `Bearer ${token}`,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCoupon = async (couponId: string, token: string) => {
  try {
    const response = await apiConnector("DELETE", `${adminEndpoints.DELETE_COUPON_API}/${couponId}`, undefined, {
      Authorization: `Bearer ${token}`,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const validateCoupon = async (couponCode: string, token: string) => {
  try {
    const response = await apiConnector("POST", adminEndpoints.VALIDATE_COUPON_API, { code: couponCode }, {
      Authorization: `Bearer ${token}`,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
