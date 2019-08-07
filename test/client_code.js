let sdk = require('../index')

//eslint-disable-next-line no-unused-vars
exports.main_handler = async (event, context, callback) => {
  let db1 = new sdk('TESTDB1')
  let db2 = new sdk('TESTDB2')

  db1.getConnection((err,connection)=>{
    if(!err){
      connection.query('select * from test',(err,results)=>{
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
      connection.query('select * from coffee',(err,results)=>{
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
