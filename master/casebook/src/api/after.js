import http from "./http";
import { axiosAfterConfig as config } from "@/config/axios-config.js";
const axios = http(config, {
  loading: true, // 开启loading层
});

// 根据条件获取账单
export const getBill = function (month, type, category) {
  return axios.get("/bills", {
    params: {
      month: month ? month : null,
      type: type ? type : null,
      category: category ? category : null,
    },
  });
};
