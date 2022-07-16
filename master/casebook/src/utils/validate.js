/**
 * 判断是否是外部路径
 * @param {string} path
 * @returns {Boolean}
 */
export const isExternal = (path) => /^(https?:|mailto:|tel:)/.test(path);

/**
 * 判断是否为数字
 */
export const checkNumberValidator = (rule, value, callback) => {
  const reg = /^\d+$/;
  if (value.trim() === "") {
    return callback(new Error("请输入账单金额"));
  }
  if (!value.match(reg)) {
    return callback(new Error("账单必须为数字"));
  }
  callback();
};
