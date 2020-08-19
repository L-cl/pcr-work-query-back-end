const router = require('express').Router();
const mysql = require('mysql');
const { createResponseData, isUndef } = require('../utils');

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'MySql860086',
  database: 'pcr',
});

/**
 * 获取作业
 */
router.get('/pcr/getWorkList', (req, res) => {
  const responseData = createResponseData();
  const { query } = req;
  const baseSql = `SELECT * FROM work_info`;
  const params = Object.keys(query).map((key) => {
    return `${key} LIKE '%${query[key]}%'`;
  });
  const searchSql = `WHERE ${params.join(' AND ')}`;
  const getSql = params.length === 0 ? baseSql : baseSql + ' ' + searchSql;
  connection.query(getSql, (err, results) => {
    if (err) {
      responseData.code = -1;
      responseData.message = '查询数据库出错';
      responseData.data = err;
      res.send(responseData);
      return;
    }
    responseData.data = results;
    res.send(responseData);
  });
});

/**
 * 删除作业
 */
router.get('/pcr/deleteWork', (req, res) => {
  const responseData = createResponseData();
  const { query } = req;
  const { id } = query;
  const deleteSql = `DELETE FROM work_info WHERE id = ?`;
  connection.query(deleteSql, id, (err, results) => {
    if (err) {
      responseData.code = -1;
      responseData.message = '数据库删除数据出错';
      responseData.data = err;
      res.send(responseData);
      return;
    }
    res.send(responseData);
  });
});

/**
 * 新增作业
 */
router.post('/pcr/createWork', (req, res) => {
  const responseData = createResponseData();
  const data = req.body;
  const keys = Object.keys(data);
  const table = [];
  const values = [];
  if (keys.length > 0) {
    keys.forEach((key) => {
      const item = data[key];
      table.push(key);
      values.push(`'${item}'`);
    });
  }
  const addSql = `
    INSERT INTO work_info(${table.join(',')})
    VALUES(${values.join(',')})
  `;
  connection.query(addSql, (err) => {
    if (err) {
      responseData.code = -1;
      responseData.message = '数据库新增出错';
      responseData.data = err;
      res.send(responseData);
      return;
    }
    res.send(responseData);
  });
});

/**
 * 更新作业
 */
router.post('/pcr/updateWork', (req, res) => {
  const responseData = createResponseData();
  const data = req.body;
  const { id } = data;
  if (isUndef(id) || id === '') {
    responseData.code = -1;
    responseData.message = '缺少作业 id';
    return res.send(responseData);
  }
  delete data.id;
  const setData = Object.keys(data)
    .map((key) => {
      return `${key}='${data[key]}'`;
    })
    .join(',');
  const updateSql = `UPDATE work_info SET ${setData} WHERE id = ?`;
  connection.query(updateSql, id, (err) => {
    if (err) {
      responseData.code = -1;
      responseData.message = '数据库更新出错';
      responseData.data = err;
      res.send(responseData);
      return;
    }
    res.send(responseData);
  });
});

/**
 * 查询作业
 */
router.get('/pcr/queryWork', (req, res) => {
  const responseData = createResponseData();
  const { query } = req;
  const { id } = query;
  if (isUndef(id) || id === '') {
    responseData.code = -1;
    responseData.message = '缺少作业 id';
    return res.send(responseData);
  }
  const baseSql = `SELECT * FROM work_info`;
  const params = Object.keys(query).map((key) => {
    return `${key} LIKE '%${query[key]}%'`;
  });
  const searchSql = `WHERE ${params.join(' AND ')}`;
  const getSql = params.length === 0 ? baseSql : baseSql + ' ' + searchSql;
  connection.query(getSql, (err, results) => {
    if (err) {
      responseData.code = -1;
      responseData.message = '查询数据库出错';
      responseData.data = err;
      res.send(responseData);
      return;
    }
    responseData.data = results[0];
    res.send(responseData);
  });
});

module.exports = router;
