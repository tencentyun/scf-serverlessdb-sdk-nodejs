let clientCode = require('./client_code')
let sdk = require('../index')
let dbConfig = require('./config')
let context = {
  database:sdk.database
}
process.env['DB_TESTDB1_HOST'] = dbConfig[0].host
process.env['DB_TESTDB1_PORT'] = dbConfig[0].port
process.env['DB_TESTDB1_USER'] = dbConfig[0].user
process.env['DB_TESTDB1_PASSWORD'] = dbConfig[0].pwd
process.env['DB_TESTDB1_DATABASE'] = dbConfig[0].database

process.env['DB_TESTDB2_HOST'] = dbConfig[1].host
process.env['DB_TESTDB2_PORT'] = dbConfig[1].port
process.env['DB_TESTDB2_USER'] = dbConfig[1].user
process.env['DB_TESTDB2_PASSWORD'] = dbConfig[1].pwd
process.env['DB_TESTDB2_DATABASE'] = dbConfig[1].database

clientCode.main_handler({},context)
