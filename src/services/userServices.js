const base = import.meta.env.VITE_BACKEND_URL;
const API_URL = `${base}/api/v1/auth`;


export const loginService = async (email, password) => {
  const res = await fetch(
   `${API_URL}/login`,
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }
  );

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to login");
  return data;
};