const router = require('express').Router();
const { createResponseData } = require('../utils');

const botNameOrNickname = ['压力马斯内', '前辈', '野兽', '北鼻', '阿西吧'];

/**
 * 登录
 */
router.post('/login', (req, res) => {
  const responseData = createResponseData();
  const session = req.session;
  const data = req.body;
  const { value } = data;
  if (!botNameOrNickname.includes(value)) {
    responseData.code = -1;
    responseData.message = '输入有错';
    res.send(responseData);
    return;
  }
  session.login = true;
  res.send(responseData);
});

module.exports = router;
