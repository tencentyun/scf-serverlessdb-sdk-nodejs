let clientCode = require('./client_code')

process.env['TESTDB1_HOST'] = 'localhost'
process.env['TESTDB1_PORT'] = 3306
process.env['TESTDB1_USER'] = 'root'
process.env['TESTDB1_PASSWORD'] = 'justyntest123'
process.env['TESTDB1_DATABASE'] = 'serverless_db_test'

process.env['TESTDB2_HOST'] = 'localhost'
process.env['TESTDB2_PORT'] = 3306
process.env['TESTDB2_USER'] = 'root'
process.env['TESTDB2_PASSWORD'] = 'justyntest123'
process.env['TESTDB2_DATABASE'] = 'serverless_db_test2'

clientCode.main_handler()
