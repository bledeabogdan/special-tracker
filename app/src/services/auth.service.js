import axios from "../config/axios";


class AuthService {
  login(values) {
    return axios.post("/login", values).then(response => {
      if (response.data.token) {
        localStorage.setItem("user", response.data.token);
      }
      return response.data;
    });
  }

  getToken() {
    return localStorage.getItem("user");
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(values) {
    return axios.post("/register", values);
  }
}

export default new AuthService();
