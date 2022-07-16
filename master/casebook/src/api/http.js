import axios from "axios";
import qs from "qs";
import { ElLoading, ElMessage } from "element-plus";
// import store from "@/store";

const pendingMap = new Map(); // 建立哈希表，来记录请求中的接口
const LoadingInstance = {
  _target: null, // 保存Loading实例
  _count: 0, // 计数器，避免有两个请求同时触发，当一个请求完成，另一个请求却没有结束，但Loading层却关闭了的情况
};

function http(baseConfig, customOptions, loadingOptions) {
  const service = axios.create(baseConfig);
  // 自定义配置
  const custom_options = Object.assign(
    {
      repeat_request_cancel: true, // 是否开启取消重复请求，默认为true
      loading: false, // 是否开启loading层效果, 默认为false
      error_message_show: true, // 是否开启接口错误信息展示默认为true
    },
    customOptions
  );

  // 请求拦截
  service.interceptors.request.use(
    (config) => {
      removePending(config);
      custom_options.repeat_request_cancel && addPending(config);

      // 如果开启loading层效果，创建loading实例
      if (custom_options.loading) {
        LoadingInstance._count++;
        if (LoadingInstance._count === 1) {
          // 所有请求共同使用同一个Loading实例，Loading的延迟关闭，通过_count实现。
          LoadingInstance._target = ElLoading.service(loadingOptions);
        }
      }

      // 自动携带cookie
      // if (store.state.user.token && typeof window !== "undefined") {
      //   config.headers.Authorization = store.state.user.token;
      // }
      return config;
    },
    (error) => {
      // Do something with request error
      return Promise.reject(error);
    }
  );

  service.interceptors.response.use(
    (response) => {
      removePending(response.config); // 清除已完成的请求
      custom_options.loading && closeLoading(custom_options); // 关闭loading
      return response;
    },
    (error) => {
      // Do something with response error
      custom_options.loading && closeLoading(custom_options); // 关闭loading
      custom_options.error_message_show && httpErrorStatusHandle(error); // 错误处理
      return Promise.reject(error);
    }
  );
  return service;
}

/**
 * 根据请求路径，请求方法，请求参数生成唯一的键。
 * （请求路径，请求方法，请求参数三者相同就代表是同一请求）
 * @param {[Object]} config axios中的配置，在请求拦截器中就是config参数，在响应拦截器中就是response.config参数
 * @returns  string
 */
function getPendingKey(config) {
  const { url, method, params, data } = config;
  return [url, method, qs.stringify(params), qs.stringify(data)].join("&");
}

/**
 * 添加请求到哈希表中
 * @param {[Object]} config  axios中的配置，在请求拦截器中就是config参数，在响应拦截器中就是response.config参数
 */
function addPending(config) {
  // 得到当前请求对应的键
  const pendingKey = getPendingKey(config);
  // 生成CancelToken对象 cancel()方法, 用于取消请求
  config.cancelToken =
    config.cancelToken ||
    new axios.CancelToken((cancel) => {
      if (!pendingMap.has(pendingKey)) {
        pendingMap.set(pendingKey, cancel);
      }
    });
}

/**
 * 取消重复请求
 * @param {[Object]} config
 */

function removePending(config) {
  // 得到当前请求对应的键
  const pendingKey = getPendingKey(config);
  // 判断是否是重复请求，如果是重复请求，则取消上一次请求
  if (pendingMap.has(pendingKey)) {
    const cancelToken = pendingMap.get(pendingKey);
    cancelToken(pendingKey);
    pendingMap.delete(pendingKey);
  }
}

/**
 * 关闭Loading层实例
 * @param {[Object]} _options 配置对象
 */
function closeLoading(_options) {
  // 如果开启了loading加载，并且加载实例（LoadingInstance）存在，则将计数器减一
  if (_options.loading && LoadingInstance._count > 0) LoadingInstance._count--;
  if (LoadingInstance._count === 0) {
    // 当所有请求都结束后，关闭Loading实例
    LoadingInstance._target.close();
    LoadingInstance._target = null;
  }
}

function httpErrorStatusHandle(error) {
  //  处理被取消的请求
  if (axios.isCancel(error)) {
    return console.error("取消的重复请求" + error.message);
  }
  let message = "";
  if (error && error.response) {
    switch (error.response.status) {
      case 302:
        message = "接口重定向了!";
        break;
      case 400:
        message = "参数不正确!";
        break;
      case 401:
        message = "您未登录，或者登录已经超时，请先登录!";
        break;
      case 403:
        message = "您没有权限操作!";
        break;
      case 404:
        message = `请求地址出错:${error.response.config.url}`;
        break;
      case 408:
        message = "请求超时!";
        break;
      case 409:
        message = "系统已存在相同数据!";
        break;
      case 500:
        message = "服务器内部错误!";
        break;
      case 501:
        message = "服务未实现!";
        break;
      case 502:
        message = "网关错误!";
        break;
      case 503:
        message = "服务不可用!";
        break;
      case 504:
        message = "服务暂时无法访问,请稍后再试!";
        break;
      case 505:
        message = "HTTP版本不受支持!";
        break;
      default:
        message = "异常问题,请联系管理员!";
        break;
    }
    if (error.message.includes("timeout")) message = "网络请求超时!";
    if (error.message.includes("Network")) {
      message = window.navigator.onLine ? "服务端异常" : "您断网了！";
    }
    ElMessage({
      type: "error",
      message,
    });
  }
}

export default http;
