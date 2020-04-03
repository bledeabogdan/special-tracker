import axios from "axios";

const instance = axios.create({
  // baseURL: "https://sleepy-plateau-26311.herokuapp.com/api",
  baseURL: "http://localhost:8090/api"
});

export default instance;
