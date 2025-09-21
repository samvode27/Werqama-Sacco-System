// backend/utils/faydaService.js
import axios from 'axios';
import crypto from 'crypto';
import jwt from 'jsonwebtoken'; // used only if you implement JWS via HS256
import { v4 as uuidv4 } from 'uuid';

let clientToken = null;
let tokenExpiry = 0; // timestamp ms

export async function authenticateClient() {
  const url = `${process.env.FAYDA_BASE_URL}/v1/authmanager/authenticate/clientidsecretkey`;
  const body = {
    id: uuidv4(),
    version: '1.0',
    requesttime: new Date().toISOString(),
    metadata: {},
    request: {
      clientId: process.env.FAYDA_CLIENT_ID,
      secretKey: process.env.FAYDA_SECRET_KEY,
      appId: process.env.FAYDA_APP_ID,
    },
  };

  const resp = await axios.post(url, body, {
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 15_000,
  });

  // The real response shape depends on Fayda. Adjust these lines to extract token.
  const token = resp.data?.response?.token || resp.data?.response?.accessToken || resp.data?.accessToken;
  const expiresIn = resp.data?.response?.expiresIn || 3600; // fallback

  clientToken = token;
  tokenExpiry = Date.now() + (expiresIn - 60) * 1000; // refresh 60s earlier
  return clientToken;
}

async function getClientToken() {
  if (!clientToken || Date.now() > tokenExpiry) {
    return authenticateClient();
  }
  return clientToken;
}

function createJwsSignature(payload) {

  const secret = process.env.FAYDA_PARTNER_SIGNING_KEY || process.env.FAYDA_PARTNER_API_KEY || '';
  // jwt.sign will produce a compact JWS
  try {
    return jwt.sign(payload, secret, { algorithm: 'HS256' });
  } catch (err) {
    // fallback: HMAC hex digest (if required)
    return crypto.createHmac('sha256', secret).update(JSON.stringify(payload)).digest('hex');
  }
}

export async function sendOtpToFayda(faydaNumber) {
  const token = await getClientToken();

  const transactionID = uuidv4();
  const body = {
    id: uuidv4(),
    version: '1.0',
    requesttime: new Date().toISOString(),
    request: {
      apiId: 'fayda.identity.otp',
      transactionID,
      uid: faydaNumber,
      // other fields may be required (e.g., channel: 'sms', locale, etc.)
    },
  };

  const signature = createJwsSignature(body);

  const url = `${process.env.FAYDA_BASE_URL}/idauthentication/v1/otp/${process.env.FAYDA_FISP_LICENSE_KEY}/${process.env.FAYDA_AUTH_PARTNER_ID}/${process.env.FAYDA_PARTNER_API_KEY}`;

  const resp = await axios.post(url, body, {
    headers: {
      Authorization: `Bearer ${token}`,
      Signature: signature,
      'Content-Type': 'application/json',
    },
    timeout: 15000,
  });

  // resp.data shape is provider-defined; return what you need (transaction id, status)
  return {
    raw: resp.data,
    transactionID: body.request.transactionID,
  };
}

export async function verifyFaydaOtp({ faydaNumber, otp, transactionID }) {
  const token = await getClientToken();

  const body = {
    id: uuidv4(),
    version: '1.0',
    requesttime: new Date().toISOString(),
    request: {
      apiId: 'fayda.identity.auth',
      transactionID,
      uid: faydaNumber,
      otp,
      // other fields may be required per spec
    },
  };

  const signature = createJwsSignature(body);

  const url = `${process.env.FAYDA_BASE_URL}/idauthentication/v1/auth/${process.env.FAYDA_FISP_LICENSE_KEY}/${process.env.FAYDA_AUTH_PARTNER_ID}/${process.env.FAYDA_PARTNER_API_KEY}`;

  const resp = await axios.post(url, body, {
    headers: {
      Authorization: `Bearer ${token}`,
      Signature: signature,
      'Content-Type': 'application/json',
    },
    timeout: 15000,
  });

  // Interpret response based on spec: return success boolean and returned identity data
  return {
    raw: resp.data,
    success: resp.data?.response?.isAuthenticated || resp.data?.status === 'success' || false,
    identity: resp.data?.response?.identity || resp.data?.response || null,
  };
}
