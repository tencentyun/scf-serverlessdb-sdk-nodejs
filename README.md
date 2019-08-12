# 云函数serverless DB node SDK

## 概述
用于简化用户使用云函数时候连接DB和管理链接池的操作，利用云函数的的特性，提供便捷高效又接近mysql库的操作封装接口

## 用法
``` javascript

exports.main_handler = async (event, context, callback) => {

  const database = require('scf-nodejs-serverlessdb-sdk').database

  //callback mode
  database('TESTDB1').connection((err,connection)=>{
    if(!err){
      connection.query('select * from test',async (err,results)=>{
        if(!err){
          console.log('db1 query result:',results)
        }else{
          console.error(err)
        }
        //test end pool
        await database('TESTDB1').endConnection()
      })
    }else{
      console.error(err)
    }
  })

  //async mode
  let connection = await database('TESTDB2').connection()
  connection.query('select * from coffee',(err,results)=>{
    console.log('db2 callback query result:',results)
  })

  let result = await connection.queryAsync('select * from coffee') //same as connection.query

  console.log('db2 query result:',result)
}


```
