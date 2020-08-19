const fs = require('fs');
const path = require('path');
const router = require('express').Router();
const multer = require('multer');
const upload = multer({
  dest: 'uploads/',
});
const { createResponseData } = require('../utils');

const isProd = process.env.NODE_ENV === 'production';

let publicIp;
(async () => {
  publicIp = await require('public-ip').v4();
})();

router.post('/pcr', upload.single('file'), (req, res) => {
  const responseData = createResponseData();
  const { file } = req;
  fs.readFile(file.path, (err, data) => {
    if (err) {
      responseData.code = -1;
      responseData.message = '图片保存失败！';
      res.send(responseData);
      return;
    }
    const { originalname } = file;
    const randomNum =
      new Date().getTime() + '-' + parseInt(Math.random() * 666);
    const picName = randomNum + '-' + originalname;
    const picPath = path.join(__dirname, '../../public/images/' + picName);
    const picUrl =
      'http://' +
      `${isProd ? publicIp : 'localhost'}` +
      ':3000' +
      '/public/images/' +
      picName;
    fs.writeFile(picPath, data, (err) => {
      if (err) {
        responseData.code = -1;
        responseData.message = '图片保存失败！';
        responseData.data = err;
        res.send(responseData);
        return;
      }
      responseData.data = picUrl;
      res.send(responseData);
    });
  });
});

module.exports = router;
