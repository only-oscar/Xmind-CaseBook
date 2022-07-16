import http from "./http";
import { axiosFrontConfig as config } from "@/config/axios-config.js";
const axios = http(config);

export const getBill = function () {
  return axios.get("/bills");
};