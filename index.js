const mysql = require('mysql')

function errorHandler(err){
  console.error(err)
}

module.exports = {

  getConnection: function(db_name,callback){
    return new Promise((resolve,reject)=>{
      callback = callback || function(){}
      if(!global.poolBucket){
        global.poolBucket = {}
      }
      if(!global.poolBucket[db_name]){
        const DB_HOST = process.env[`DB_${db_name}_HOST`]
        const DB_PORT = process.env[`DB_${db_name}_PORT`]
        const DB_USER = process.env[`DB_${db_name}_USER`]
        const DB_PASSWORD = process.env[`DB_${db_name}_PASSWORD`]
        const DB_NAME = process.env[`DB_${db_name}_DATABASE`]

        const dbConfig = {
          host     : DB_HOST,
          user     : DB_USER,
          port: +DB_PORT,
          password : DB_PASSWORD,
          database : DB_NAME
        }
        console.log(dbConfig)
        const pool = global.poolBucket[db_name] = mysql.createPool(dbConfig)
        pool.on('acquire', function (connection) {
          console.log('Connection %d acquired', connection.threadId)
        })
        pool.getConnection(function(err, connection) {
          if(err){
            errorHandler(err)
            reject(err)
          }else{
            resolve(connection)
          }
          callback(err,connection)
        })
      }else{
        global.poolBucket[db_name].getConnection(function(err, connection) {
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
    
  },
  end: function(db_name,callback){
    return new Promise((resolve,reject)=>{
      callback = callback || function(){}
      if(global.poolBucket[db_name]){
        global.poolBucket[db_name].end((err)=>{
          if(!err){
            console.log(db_name + ' pool ended')
            delete global.poolBucket[db_name]
            resolve(db_name)
          }else{
            errorHandler(err)
            reject(err)
          }
          callback(err)
        })
      }
    })
    
  }
}
