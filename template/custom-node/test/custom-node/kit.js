const path = require('path')
const { Testkit } = require('aa-testkit')

// init testkit once
module.exports = Testkit({
	TESTDATA_DIR: path.join(process.cwd(), 'testdata')
})
