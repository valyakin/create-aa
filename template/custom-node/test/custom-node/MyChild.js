// Connector between user app and node interface for testkit
// Separate process runs this code

const { Custom } = require('./kit')
const APP = require('../../app')

class MyNodeChild extends Custom.Child {
	// any initialization code goes here
	run () {
		this.app = new APP()
	}

	// `sendCustomCommand` from MyNode interface can be handled here
	async handleCustomCommand (payload) {
		switch (payload.type) {
		case 'get-chash':
			// use `this.sendCustomMessage` to send arbitrary JSON data to MyNode
			this.sendCustomMessage({ type: 'chash', chash: await this.app.getChash(payload.data) })
			break

		case 'get-my-witnesses':
			this.sendCustomMessage({ type: 'my-witnesses', witnesses: await this.app.getMyWitnesses(payload.data) })
			break
		}
	}
}

const child = new MyNodeChild(process.argv)
child.start()
