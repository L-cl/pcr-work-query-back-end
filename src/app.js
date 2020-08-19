const path = require('path');
const express = require('express');
const cookieSession = require('cookie-session');
const consola = require('consola');
const apiController = require('./controller/api');
const uploadsController = require('./controller/uploads');
const loginController = require('./controller/login');
const { createResponseData } = require('./utils');

const app = express();

const isProd = process.env.NODE_ENV === 'production';

let publicIp;
(async () => {
  publicIp = await require('public-ip').v4();
})();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cookieSession({
    name: 'pcrWorkQuerySession',
    keys: ['pcrWorkQuery'],
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
);
app.use('*', (req, res, next) => {
  res.header(
    'Access-Control-Allow-Origin',
    isProd ? `http://${publicIp}:8280` : 'http://localhost:8280'
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild'
  );
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', true);
  if (req.method == 'OPTIONS') {
    // 让options请求快速返回
    res.sendStatus(200);
  } else {
    const checkLogin = () => {
      return !!req.session.login;
    };
    if (req.originalUrl.indexOf('login') > -1) {
      next();
    } else {
      const isLogin = checkLogin();
      if (isLogin) {
        next();
      } else {
        const responseData = createResponseData();
        responseData.code = 0;
        responseData.message = '请登录';
        res.send(responseData);
      }
    }
  }
});
app.use('/public', express.static(path.resolve(__dirname, '../public/')));
app.use('/api', apiController);
app.use('/uploads', uploadsController);
app.use('/login', loginController);

app.listen(3000, () => {
  consola.ready({
    message: `Server listening on http://localhost:3000`,
    badge: true,
  });
});
