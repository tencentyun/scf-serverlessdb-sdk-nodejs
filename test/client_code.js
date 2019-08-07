let sdk = require('../index')

exports.main_handler = async (event, context, callback) => {
  let db1 = new sdk('TESTDB1')
  let db2 = new sdk('TESTDB2')

  db1.getConnection((err,connection)=>{
    if(!err){
      connection.query('select * from test',(err,results,fields)=>{
        if(!err){
          console.log(results)
        }else{
          console.error(err)
        }
      })
    }else{
      console.error(err)
    }
  })

  db2.getConnection((err,connection)=>{
    if(!err){
      connection.query('select * from coffee',(err,results,fields)=>{
        if(!err){
          console.log(results)
        }else{
          console.error(err)
        }
      })
    }else{
      console.error(err)
    }
  })

}
