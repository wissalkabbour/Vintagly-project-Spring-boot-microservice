import { create } from "zustand";

export const useAuthStore = create((set) => ({
  accessToken: null,
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

    set({
      accessToken: json.access_token,
      isAuthenticated: true,
    });


    localStorage.setItem("token", json.access_token);

    return true;
  },

}));
