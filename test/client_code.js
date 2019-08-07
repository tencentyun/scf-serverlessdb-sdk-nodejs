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
        db1.end()
      })
    }else{
      console.error(err)
    }
  })


  //async mode
  let connection = await (()=>{
    return new Promise((resolve,reject)=>{
      db2.getConnection((err,connection)=>{
        if(!err){
          resolve(connection)
        }else{
          console.error(err)
          reject(err)
        }
      })
    })
  })()

  connection.query('select * from coffee',(err,results)=>{
    if(!err){
      console.log('db2 query result:',results)
    }else{
      console.error(err)
    }
  })
}
