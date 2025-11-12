import { TOKEN_KEY } from "../config";
import type { User } from "../types/user";

const USER_KEY = "user_info";

export const auth = {
  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  setUser(user: User) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getUser(): User | null {
    const data = localStorage.getItem(USER_KEY);
    return data ? (JSON.parse(data) as User) : null;
  },

  logout() {
    this.clear();
  },
};
