//clientCodeDemo

//eslint-disable-next-line no-unused-vars
exports.main_handler = async (event, context, callback) => {

  //callback mode
  context.database.connection('TESTDB1',(err,connection)=>{
    if(!err){
      connection.query('select * from test',async (err,results)=>{
        if(!err){
          console.log('db1 query result:',results)
        }else{
          console.error(err)
        }
        //test end pool
        await context.database.endConnection('TESTDB1')
      })
    }else{
      console.error(err)
    }
  })

  //async mode
  let connection = await context.database.connection('TESTDB2')
  connection.query('select * from coffee',(err,results)=>{
    console.log('db2 callback query result:',results)
  })

  let result = await connection.queryAsync('select * from coffee') //same as connection.query


  console.log('db2 query result:',result)
}
