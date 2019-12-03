//clientCodeDemo

//eslint-disable-next-line no-unused-vars
exports.main_handler = async (event, context, callback) => {

  context.database = context.database || require('../index').database

  //callback mode
  // context.database('TESTDB1').connection((err,connection)=>{
  //   if(!err){
  //     connection.query('select * from test',async (err,results)=>{
  //       if(!err){
  //         // console.log('db1 query result:',results)
  //       }else{
  //         console.error(err)
  //       }
  //       //test end pool
  //       await context.database('TESTDB1').endConnection()
  //     })
  //   }else{
  //     console.error(err)
  //   }
  // })

  //async mode
  let connection = await context.database('TESTDB2').connection()
  // connection.query('select * from coffee',(err,results)=>{
  //   // console.log('db2 callback query result:',results)
  // })

  let result = await connection.queryAsync('select * from coffee') //same as connection.query
  connection.release()

  console.log('db2 query result:',result)
}
