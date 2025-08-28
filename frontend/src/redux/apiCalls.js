// src/redux/apiCalls.js
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout as logoutAction,
} from "./userRedux";
import api from "../api/axios";
import { msUntilExpiry, isTokenValid } from "../utils/token";

let logoutTimer;

export const saccoLogin = async (dispatch, credentials) => {
  dispatch(loginStart());
  try {
    const res = await api.post("/auth/login", credentials);
    const { token, user } = res.data;

    // ✅ Save token globally
    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // ✅ Auto logout after expiry
    if (logoutTimer) clearTimeout(logoutTimer);
    const ms = msUntilExpiry(token);
    if (ms > 0) logoutTimer = setTimeout(() => saccoLogout(dispatch), ms);

    // ✅ Update redux
    dispatch(loginSuccess({ token, user }));

    // ✅ Return both
    return { token, user };
  } catch (err) {
    console.error("Login error:", err.response?.data || err.message);
    dispatch(
      loginFailure(err.response?.data?.message || "Login failed")
    );
    throw err;
  }
};

export const saccoBootstrapAuth = (dispatch, token, user) => {
  if (!token || !user || !isTokenValid(token)) {
    return saccoLogout(dispatch);
  }

  localStorage.setItem("token", token);
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  if (logoutTimer) clearTimeout(logoutTimer);
  const ms = msUntilExpiry(token);
  if (ms > 0) {
    logoutTimer = setTimeout(() => saccoLogout(dispatch), ms);
  }

  dispatch(loginSuccess({ token, user }));
};

export const saccoLogout = (dispatch) => {
  if (logoutTimer) clearTimeout(logoutTimer);
  localStorage.removeItem("token");
  delete api.defaults.headers.common["Authorization"];
  dispatch(logoutAction());
};
