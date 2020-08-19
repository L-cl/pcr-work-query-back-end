/**
 * code 200 成功
 * code 0 未登录
 * code -1 查询数据库出错
 */

/**
 * 生成基本的返回数据信息
 */
const createResponseData = () => {
  return {
    code: 200,
    message: '成功',
  };
};

/**
 * 是否未定义
 */
const isUndef = (v) => {
  return v === undefined || v === null;
};

module.exports = {
  createResponseData,
  isUndef,
};
