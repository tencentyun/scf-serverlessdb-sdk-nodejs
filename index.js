const mysql = require('mysql')

function errorHandler(err){
  console.error(err)
}

module.exports = class ScfMysql{

  constructor(db_name){
    this.db_name = db_name
    this.poolBucket = global.poolBucket
    //无pool情况下预先建立一个pool
    if(!this.poolBucket || !this.poolBucket[db_name]){
      this.getConnection()
    }
  }

  getConnection(callback){
    callback = callback || function(){}
    if(!this.poolBucket){
      global.poolBucket = {}
     
      this.poolBucket = global.poolBucket
    }
    if(!this.poolBucket[this.db_name]){
      const DB_HOST = process.env[`${this.db_name}_HOST`]
      const DB_PORT = process.env[`${this.db_name}_PORT`]
      const DB_USER = process.env[`${this.db_name}_USER`]
      const DB_PASSWORD = process.env[`${this.db_name}_PASSWORD`]
      const DB_NAME = process.env[`${this.db_name}_DATABASE`]

      const dbConfig = {
        host     : DB_HOST,
        user     : DB_USER,
        port: +DB_PORT,
        password : DB_PASSWORD,
        database : DB_NAME
      }
      const pool = this.poolBucket[this.db_name] = mysql.createPool(dbConfig)
      pool.on('acquire', function (connection) {
        console.log('Connection %d acquired', connection.threadId)
      })
      pool.getConnection(function(err, connection) {
        if(err){
          errorHandler(err)
        }
        callback(err,connection)
      })
    }else{
      this.poolBucket[this.db_name].getConnection(function(err, connection) {
        if(err){
          errorHandler(err)
        }
        callback(err,connection)
      })
    }
  }

  end(callback){
    callback = callback || function(){}
    if(this.poolBucket[this.db_name]){
      this.poolBucket[this.db_name].end((err)=>{
        if(!err){
          console.log(this.db_name + ' pool ended')
          delete this.poolBucket[this.db_name]
        }else{
          errorHandler(err)
        }
        callback(err)
      })
    }
  }
}
