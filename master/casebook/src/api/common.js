import http from "./http";
import { axiosDefaultConfig as config } from "@/config/axios-config.js";
const axios = http(config);

export const getCateories = function () {
  return axios.get("/caretories");
};

export const createBill = function (data) {
  return axios.post("/add", data);
};
