import { jwtDecode } from 'jwt-decode';

export const isTokenValid = (token) => {
  try {
    const decoded = jwtDecode(token);
    if (!decoded.exp) return false;
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export const msUntilExpiry = (token) => {
  try {
    const { exp } = jwtDecode(token);
    return Math.max(exp * 1000 - Date.now(), 0);
  } catch {
    return 0;
  }
};
