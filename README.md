# 云函数serverless DB node SDK

## 概述
用于简化用户使用云函数时候连接DB和管理链接池的操作，利用云函数的的特性，提供便捷高效又接近mysql库的操作封装接口

## 用法
``` javascript
/*
环境变量(示例)：
process.env['DB_TESTDB2_HOST'] = 192.168.1.1
process.env['DB_TESTDB2_PORT'] = 3306
process.env['DB_TESTDB2_USER'] = ycp424c
process.env['DB_TESTDB2_PASSWORD'] = pwd123321123
process.env['DB_TESTDB2_DATABASE'] = db_name
*/

const database = require('scf-nodejs-serverlessdb-sdk').database

exports.main_handler = async (event, context, callback) => {
  //async mode
  let connection = await database('TESTDB2').connection()
 
  let result = await connection.queryAsync('select * from coffee') //same as connection.query
  connection.release()
  console.log('db2 query result:',result)

  let pool = (async () => await database('TESTDB2').pool())()
  let result2 = await pool.queryAsync('select * from coffee')
  // no need to release pool

  console.log('db2 query result:',result2)
}


```
