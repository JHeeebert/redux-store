/* eslint-disable import/no-anonymous-default-export */
import decode from "jwt-decode";
class AuthService {
  constructor() {
    this.tokenKey = "id_token";
  }
  getProfile() {
    const token = this.getToken();
    return token ? decode(token) : null;
  }
  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }
  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
        return true;
      } else return false;
    } catch (err) {
      return false;
    }
  }
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }
  login(idToken) {
    localStorage.setItem(this.tokenKey, idToken);
    window.location.assign("/");
  }
  logout() {
    localStorage.removeItem(this.tokenKey);
    window.location.assign("/");
  }
}

export default new AuthService();
