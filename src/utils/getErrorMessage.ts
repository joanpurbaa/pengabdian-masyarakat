import { message } from "antd";

interface ApiErrorResponse {
  code?: number;
  message?: string;
  errors?: Record<string, string>;
}

export const getErrorMessage = (error: any): string => {
  const responseData: ApiErrorResponse = error?.response?.data || error;

  if (responseData?.errors && typeof responseData.errors === "object") {
    const errorValues = Object.values(responseData.errors);
    
    if (errorValues.length > 0) {
      return errorValues.join(", "); 
    }
  }

  if (responseData?.message) {
    return responseData.message;
  }

  return error?.message || "Terjadi kesalahan pada server.";
};

export const showApiError = (error: any) => {
  const msg = getErrorMessage(error);
  message.error(msg);
};