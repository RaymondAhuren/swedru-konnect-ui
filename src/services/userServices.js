const base = import.meta.env.VITE_BACKEND_URL;
if (!base) console.warn("VITE_BACKEND_URL is not set");
const API_URL = `${base}/api/v1/auth`;

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }
  return data;
};

export const loginService = async (email, password) => {
  if (!email || !password) throw new Error("Email and password are required");
  
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    credentials: "include",
    headers: { 
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({ email, password }),
  });

  return handleResponse(res);
};

export const logoutService = async () => {
  const res = await fetch(`${API_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });
  return handleResponse(res);
};

export const refreshTokenService = async () => {
  try {
    const res = await fetch(`${API_URL}/refresh-token`, {
      method: "POST",
      credentials: "include",
    });
    return res.ok ? await handleResponse(res) : null;
  } catch (error) {
    console.error('Refresh token error:', error);
    return null;
  }
};

export const getUserDetails = async () => {
  try {
    const res = await fetch(`${API_URL}/user/me`, {
      method: "GET",
      credentials: "include",
      headers: { 
        "Accept": "application/json",
        "Cache-Control": "no-cache"
      },
    });
    return res.ok ? await handleResponse(res) : null;
  } catch (error) {
    console.error('Get user details error:', error);
    return null;
  }
};