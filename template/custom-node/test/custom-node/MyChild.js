// Connector between user provided API and node interface for testkit
// Separate process runs this code
// Import and run API code here

const { Custom } = require('./kit')
const API = require('../../api')

class MyNodeChild extends Custom.Child {
	// any initialization code goes here
	run () {
		this.api = new API()
	}

	// `sendCustomCommand` from MyNode interface can be handled here
	async handleCustomCommand (payload) {
		switch (payload.type) {
		case 'get-chash':
			// use `this.sendCustomMessage` to send arbitrary JSON data to MyNode
			this.sendCustomMessage({ type: 'chash', chash: await this.api.getChash(payload.data) })
			break

		case 'get-my-witnesses':
			this.sendCustomMessage({ type: 'my-witnesses', witnesses: await this.api.getMyWitnesses(payload.data) })
			break
		}
	}
}

const child = new MyNodeChild(process.argv)
child.start()
