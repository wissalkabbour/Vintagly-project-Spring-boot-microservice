import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

export const useAuthStore = create((set) => ({
  accessToken: null,
  userInfo: null,
  isAuthenticated: false,

  login: async (email, password) => {
    const data = new URLSearchParams();
    data.append("grant_type", "password");
    data.append("client_id", "backend");
    data.append("client_secret", "wS9nhxLfxtWOjteSOwHgaVAxX18pVOjb");
    data.append("username", email);
    data.append("password", password);

    const res = await fetch(
    "http://localhost:8080/realms/myrealm/protocol/openid-connect/token",
    // "http://localhost:8195/auth/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: data,
      }
    );

    if (!res.ok) return false;

    const json = await res.json();
    const token = json.access_token; 
    const decoded = jwtDecode(token);
    const userData = {
      id: decoded.sub,
      name: decoded.name || decoded.preferred_username,
      email: decoded.email,
      roles: decoded.realm_access?.roles || [],
    };

    set({
      accessToken: json.access_token,
      userInfo: userData,
      isAuthenticated: true,
    });


    localStorage.setItem("token", token);
    localStorage.setItem("userInfo", JSON.stringify(userData));

    return true;
  },

}));
