//clientCodeDemo

let sdk = require('../index')

//eslint-disable-next-line no-unused-vars
exports.main_handler = async (event, context, callback) => {
  let db1 = new sdk('TESTDB1')
  let db2 = new sdk('TESTDB2')

  //callback mode
  db1.getConnection((err,connection)=>{
    if(!err){
      connection.query('select * from test',(err,results)=>{
        if(!err){
          console.log('db1 query result:',results)
        }else{
          console.error(err)
        }
        //test end pool
        db1.end()
      })
    }else{
      console.error(err)
    }
  })

  function getDBConnection(db){
    return new Promise((resolve,reject)=>{
      db.getConnection((err,connection)=>{
        if(!err){
          resolve(connection)
        }else{
          console.error(err)
          reject(err)
        }
      })
    })
  }

  function query(connection,sql){
    return new Promise((resolve,reject)=>{
      connection.query(sql,(err,results)=>{
        if(!err){
          resolve(results)
        }else{
          reject(err)
        }
      })
    })
  }

  //async mode
  let connection = await getDBConnection(db2)
  let result = await query(connection,'select * from coffee')

  console.log('db2 query result:',result)
}
