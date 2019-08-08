const mysql = require('mysql')
const blueBird = require('bluebird')

function errorHandler(err){
  console.error(err)
}

module.exports = {

  database: function (db_name){
    db_name = db_name ||  process.env['DB_DEFAULT'] 
    if(!db_name){
      throw new Error('必须输入db名或设置DB_DEFAULT环境变量')
    }
    this.db_name = db_name
    this.connection = function(callback){
      return new Promise((resolve,reject)=>{
        callback = callback || function(){}
        if(!global.poolBucket){
          global.poolBucket = {}
        }
        if(!global.poolBucket[this.db_name]){
          const DB_HOST = process.env[`DB_${this.db_name}_HOST`]
          const DB_PORT = process.env[`DB_${this.db_name}_PORT`]
          const DB_USER = process.env[`DB_${this.db_name}_USER`]
          const DB_PASSWORD = process.env[`DB_${this.db_name}_PASSWORD`]
          const DB_NAME = process.env[`DB_${this.db_name}_DATABASE`]
  
          const dbConfig = {
            host     : DB_HOST,
            user     : DB_USER,
            port: +DB_PORT,
            password : DB_PASSWORD,
            database : DB_NAME
          }
          console.log(dbConfig)
          const pool = global.poolBucket[this.db_name] = mysql.createPool(dbConfig)
          pool.on('acquire', function (connection) {
            console.log('Connection %d acquired', connection.threadId)
          })
          pool.getConnection(function(err, connection) {
            blueBird.promisifyAll(connection)
            if(err){
              errorHandler(err)
              reject(err)
            }else{
              resolve(connection)
            }
            callback(err,connection)
          })
        }else{
          global.poolBucket[this.db_name].getConnection(function(err, connection) {
            if(err){
              errorHandler(err)
              reject(err)
            }else{
              resolve(connection)
            }
            callback(err,connection)
          })
        }
      })
    }
    this.endConnection=function(callback){
      return new Promise((resolve,reject)=>{
        callback = callback || function(){}
        if(global.poolBucket[this.db_name]){
          global.poolBucket[this.db_name].end((err)=>{
            if(!err){
              console.log(this.db_name + ' pool ended')
              delete global.poolBucket[this.db_name]
              resolve(this.db_name)
            }else{
              errorHandler(err)
              reject(err)
            }
            callback(err)
          })
        }
      })
    }
    return this
  }
  
}
