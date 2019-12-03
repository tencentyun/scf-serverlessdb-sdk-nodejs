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
    this.pool = function(callback){
      return new Promise((resolve)=>{
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
          const DB_TZ = process.env[`DB_${this.db_name}_TIMEZONE`]
          const connectionLimit = process.env[`DB_${this.db_name}_CONNECTION_LIMIT`] || process.env['CONNECTION_LIMIT']  || 100
  
          const dbConfig = {
            host     : DB_HOST,
            user     : DB_USER,
            port: +DB_PORT,
            password : DB_PASSWORD,
            database : DB_NAME,
            connectionLimit: +connectionLimit,
            timezone: DB_TZ
          }
          const pool = global.poolBucket[this.db_name] = blueBird.promisifyAll(mysql.createPool(dbConfig))
          pool.on('acquire', function (connection) {
            console.log('Connection %d acquired', connection.threadId)
          })
          callback(pool)
          resolve(pool)
        }else{
          callback(global.poolBucket[this.db_name]) 
          resolve(global.poolBucket[this.db_name])
        }
      })
    }
    this.connection = async function(callback){
      let pool = await this.pool()
      return new Promise((resolve,reject)=>{
        pool.getConnection(function(err, connection) {
          if(err){
            errorHandler(err)
            reject(err)
          }else{
            blueBird.promisifyAll(connection)
            resolve(connection)
          }
          callback(err,connection)
        })
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
