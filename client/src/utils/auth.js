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
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      return true; // Token is considered expired if decoding fails
    }
  }
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }
  setToken(idToken) {
    localStorage.setItem(this.tokenKey, idToken);
  }
  logout() {
    localStorage.removeItem(this.tokenKey);
    window.location.assign("/");
  }
}
export default new AuthService();
