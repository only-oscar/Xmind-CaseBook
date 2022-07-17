import http from "./http";
import { axiosFrontConfig as config } from "@/config/axios-config.js";
const axios = http(config, {
  loading: true,
});

export const getBill = function () {
  return axios.get("/bills");
};
