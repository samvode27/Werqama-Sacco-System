import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout as logoutAction,
} from "./userRedux";
import api from "../api/axios";
import { msUntilExpiry, isTokenValid } from "../utils/token";

let logoutTimer;

// -------------------- EMAIL/PASSWORD LOGIN --------------------
export const saccoLogin = async (dispatch, credentials) => {
  dispatch(loginStart());
  try {
    const res = await api.post("auth/login", credentials);
    const { token, user } = res.data;

    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    if (logoutTimer) clearTimeout(logoutTimer);
    const ms = msUntilExpiry(token);
    if (ms > 0) logoutTimer = setTimeout(() => saccoLogout(dispatch), ms);

    dispatch(loginSuccess({ token, user }));
    return { token, user };
  } catch (err) {
    dispatch(loginFailure(err.response?.data?.message || "Login failed"));
    throw err;
  }
};

// -------------------- FAYDA LOGIN --------------------
// Step 1: initiate OTP
export const faydaLogin = {
  initiate: async (dispatch, { fcn }) => {
    dispatch(loginStart());
    try {
      const res = await api.post("/auth/fayda/initiate", { fcn });
      return res.data; // contains transactionId and maskedMobile
    } catch (err) {
      dispatch(loginFailure(err.response?.data?.message || "Fayda initiation failed"));
      throw err;
    }
  },

  // Step 2: verify OTP
  verify: async (dispatch, { fcn, otp, transactionId }) => {
    dispatch(loginStart());
    try {
      const res = await api.post("/auth/fayda/verify", { fcn, otp, transactionId });
      const { token, user } = res.data;

      // store token and update axios
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // auto logout
      if (logoutTimer) clearTimeout(logoutTimer);
      const ms = msUntilExpiry(token);
      if (ms > 0) logoutTimer = setTimeout(() => saccoLogout(dispatch), ms);

      // update redux
      dispatch(loginSuccess({ token, user }));
      return { token, user };
    } catch (err) {
      dispatch(loginFailure(err.response?.data?.message || "Fayda verification failed"));
      throw err;
    }
  },
};

// -------------------- BOOTSTRAP / LOGOUT --------------------
export const saccoBootstrapAuth = (dispatch, token, user) => {
  if (!token || !user || !isTokenValid(token)) return saccoLogout(dispatch);

  localStorage.setItem("token", token);
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  if (logoutTimer) clearTimeout(logoutTimer);
  const ms = msUntilExpiry(token);
  if (ms > 0) logoutTimer = setTimeout(() => saccoLogout(dispatch), ms);

  dispatch(loginSuccess({ token, user }));
};

export const saccoLogout = (dispatch) => {
  if (logoutTimer) clearTimeout(logoutTimer);
  localStorage.removeItem("token");
  delete api.defaults.headers.common["Authorization"];
  dispatch(logoutAction());
};
