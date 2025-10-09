import axios from "axios";

const FYDA_BASE_URL = process.env.FAYDA_BASE_URL; // WITHOUT /api/fayda
const FYDA_API_KEY = process.env.FAYDA_API_KEY;

// 1️⃣ Initiate OTP
export const initiateFaydaOTP = async (fcn) => {
  try {
    const response = await axios.post(
      `${FYDA_BASE_URL}/api/fayda/otp/initiate`,
      { fcn },
      {
        headers: {
          "X-API-Key": FYDA_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Fayda initiate error full:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || "Fayda OTP initiation failed");
  }
};

// 2️⃣ Verify OTP
export const verifyFaydaOTP = async ({ transactionId, otp, fcn }) => {
  try {
    const response = await axios.post(
      `${FYDA_BASE_URL}/api/fayda/otp/verify`,
      { transactionId, otp, fcn },
      {
        headers: {
          "X-API-Key": FYDA_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Fayda verify error full:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || "Fayda OTP verification failed");
  }
};

// 3️⃣ Get Fayda user info (optional)
export const getFaydaUser = async (fcn) => {
  try {
    const response = await axios.get(`${FYDA_BASE_URL}/api/fayda/user/${fcn}`, {
      headers: {
        "X-API-Key": FYDA_API_KEY,
      },
    });
    return response.data;
  } catch (err) {
    console.error("Fayda get user error:", err.response?.data || err.message);
    return null;
  }
};
