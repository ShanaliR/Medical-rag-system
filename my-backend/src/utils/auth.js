import { jwtDecode } from "jwt-decode";

export const getOrCreateUserId = () => {
  let userId = localStorage.getItem("hr_chat_user_id");
  if (!userId) {
    // Generate a simple unique ID (e.g., using current timestamp and random number)
    userId = `user_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
    localStorage.setItem("hr_chat_user_id", userId);
  }
  return userId;
};

// For admin, simply provide a static ID for MVP
export const getAdminId = () => {
  return "admin_hr_team_001"; // Static admin ID for MVP
};

export const getUserIdFromToken = () => {
  const token = localStorage.getItem("jwtToken");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.id || decoded.userId; // match the key used when creating token
  } catch (error) {
    console.error("Invalid JWT token", error);
    return null;
  }
};
