// src/utils/faydaService.js
import axios from "axios";

const FAYDA_BASE_URL = process.env.FAYDA_BASE_URL;
const FAYDA_API_KEY = process.env.FAYDA_API_KEY;

// 1️⃣ Initiate OTP
export const initiateFaydaOTP = async (fcn) => {
  if (!fcn) throw new Error("Fayda card number (fcn) is required");

  try {
    const response = await axios.post(
      `${FAYDA_BASE_URL}/api/fayda/otp/initiate`,
      { fcn },
      {
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": FAYDA_API_KEY,
        },
        timeout: 10000
      }
    );

    if (!response.data) throw new Error("Empty response from Fayda");

    return response.data;
  } catch (err) {
    if (err.response?.data) {
      console.error("Fayda API Error:", err.response.data);
      throw new Error(err.response.data.message || "Fayda API Error");
    }
    throw new Error(err.message);
  }
};

// 2️⃣ Verify OTP
export const verifyFaydaOTP = async ({ transactionId, otp, fcn }) => {
  try {
    const response = await axios.post(
      `${FAYDA_BASE_URL}/api/fayda/otp/verify`,
      { transactionId, otp, fcn },
      {
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": FAYDA_API_KEY,
        }
      }
    );

    return response.data;
  } catch (err) {
    if (err.response?.data) {
      console.error("Fayda Verify Error:", err.response.data);
      return { success: false, message: err.response.data.message };
    }
    return { success: false, message: err.message };
  }
};

// Optional: fetch Fayda user data
export const getFaydaUser = async (fcn) => {
  try {
    const response = await axios.get(`${FAYDA_BASE_URL}/api/users/${fcn}`, {
      headers: { "x-api-key": FAYDA_API_KEY },
      responseType: "json",
    });
    return response.data;
  } catch (err) {
    console.error("Fayda Get User Error:", err.message);
    return null;
  }
};
