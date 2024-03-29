"use strict";
import Vue from 'vue';
import axios from "axios";
// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
  //生产环境
  baseURL: 'https://group.gzywudao.top/php/public/admin.php/',
  //测试环境
  //baseURL: 'http://127.0.0.1/myproject/wxgroup/php/public/admin.php/',
  //暂时用不到
  // baseURL: process.env.baseURL || process.env.apiUrl || ""
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
};
const _axios = axios.create(config);
_axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    if (config.method == 'get') {
      config.params = {
        _t: Date.parse(new Date()) / 1000,
        ...config.params
      }
    }
    //console.log("这是处理过后的请求", config)
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);
// Add a response interceptor
_axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    if (response.data.ret === 0) {
      response = response.data.content;
    }
    console.log("打印请求结果", response)
    let state = response.data.state;
    if (state != 200) {
      let message = response.data.message;
      alert(message)
      return
    }


    return response;
  },
  function (error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

Plugin.install = function (Vue, options) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      }
    },
    $axios: {
      get() {
        return _axios;
      }
    },
  });
};

Vue.use(Plugin)

export default _axios;
