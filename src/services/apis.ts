// src/services/apis.ts
const BASE_URL = import.meta.env.VITE_API_URL;

export const endpoints = {
  SENDOTP_API: `${BASE_URL}/auth/sendOTP`,
  LOGIN_API: `${BASE_URL}/auth/login`,
  CREATE_USER_API: `${BASE_URL}/auth/createUser`,
  CREATE_ADMIN_API: `${BASE_URL}/auth/createAdmin`,
  ADMIN_LOGIN_API: `${BASE_URL}/auth/adminLogin`,
  FORGOT_PASSWORD_API: `${BASE_URL}/auth/forgot-password`,
  CHANGE_PASSWORD_API: `${BASE_URL}/auth/change-password`,
  GET_USER_API: `${BASE_URL}/auth/get-user`,
  UPDATE_USER_API: `${BASE_URL}/auth/edit-user`,
  GET_ALL_USERS_API: `${BASE_URL}/auth/getAllUsers`,
  CONTACT_US_API: `${BASE_URL}/auth/contactus`,
};

export const hostEndpoint={
  UPDATE_HOST_API: `${BASE_URL}/auth/edit-host`
}

export const volunteerEndpoint = {
  UPDATE_VOLUNTEER_API: `${BASE_URL}/auth/edit-volunteer`,
  GET_SUBSCRIPTION_STATUS_API: `${BASE_URL}/auth/subscription-status`,
};

export const opportunityEndpoint = {
  CREATE_OPPORTUNITY_API: `${BASE_URL}/opportunity/create`,
  GET_OPPORTUNITY_API: `${BASE_URL}/opportunity/get`,
  EDIT_OPPORTUNITY_API: `${BASE_URL}/opportunity/edit`,
  DELETE_OPPORTUNITY_API: `${BASE_URL}/opportunity/delete`,
  GET_HOST_OPPORTUNITIES_API: `${BASE_URL}/opportunity/get-host-opportunities`,
  GET_OPPORTUNITY_BY_ID_API: `${BASE_URL}/opportunity`,
  GET_ALL_OPPORTUNITIES_API: `${BASE_URL}/opportunity/getAllOpportunities`,
  GET_FILTERED_OPPORTUNITIES_API: `${BASE_URL}/opportunity/search`,
}

export const couponEndpoint = {
  VALIDATE_COUPON_API: `${BASE_URL}/coupon/validate`,
}

export const paymentEndpoint = {
  CAPTURE_PAYMENT_API: `${BASE_URL}/payment/capture-payment`,
  VERIFY_PAYMENT_API: `${BASE_URL}/payment/verify-payment`,
}

