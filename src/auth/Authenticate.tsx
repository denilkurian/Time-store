
const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  const tokenExpiryTime = parseInt(localStorage.getItem("tokenExpiryTime") || '0', 10);

  // Check if token exists & session hasn't expired
  if (token && Date.now() < tokenExpiryTime) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return {
        authenticated: true,
        type: payload.type,
        status: payload.status,
      };
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiryTime");
      return { authenticated: false, type: null, status: null };
    }
  }

  // Clear token if expired
  if (token) {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiryTime");
  }

  return { authenticated: false, type: null, status: null };
};

export default isAuthenticated;
