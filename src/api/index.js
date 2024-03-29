import axios from "axios";
import { getCookie } from "../Fetch";

const API = axios.create({ baseURL: "https://collegy-server.herokuapp.com" });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("user_info")) {
    req.headers.Authorization = `Bearer ${JSON.parse(
      localStorage.getItem("user_info").token
    )}`;
  }

  return req;
});

export const continueGoogle = (accessToken) =>
  API.post("/auth/continue", {
    googleAccessToken: accessToken,
    visitorId: getCookie("visitorId="),
  });
