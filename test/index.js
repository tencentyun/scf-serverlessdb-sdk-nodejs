let clientCode = require('./client_code')
let sdk = require('../index')
let context = {
  db:{
    connection:sdk.getConnection,
    endConnection: sdk.end
  }
}
process.env['DB_TESTDB1_HOST'] = 'localhost'
process.env['DB_TESTDB1_PORT'] = 3306
process.env['DB_TESTDB1_USER'] = 'root'
process.env['DB_TESTDB1_PASSWORD'] = 'justyntest123'
process.env['DB_TESTDB1_DATABASE'] = 'serverless_db_test'

process.env['DB_TESTDB2_HOST'] = 'localhost'
process.env['DB_TESTDB2_PORT'] = 3306
process.env['DB_TESTDB2_USER'] = 'root'
process.env['DB_TESTDB2_PASSWORD'] = 'justyntest123'
process.env['DB_TESTDB2_DATABASE'] = 'serverless_db_test2'

clientCode.main_handler({},context)
