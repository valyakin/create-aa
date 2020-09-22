// Interface for CustomNode
// Functions from this class will be available in *.spec.js file with tests
// Custom.Node provides same functions as HeadlessWallet node from aa-testkit
const path = require('path')
const { Custom } = require('./kit')

class MyNode extends Custom.Node {
	// path to CustomNodeChild implementation. Mandatory to be provided
	childPath () {
		return path.join(__dirname, './MyChild')
	}

	getChash (data) {
		return new Promise(resolve => {
			this.once('chash', (chash) => resolve(chash))
			// use `this.sendCustomCommand` to send arbitrary JSON data to MyChild
			this.sendCustomCommand({ type: 'get-chash', data })
		})
	}

	getMyWitnesses () {
		return new Promise(resolve => {
			this.once('my-witnesses', (witnesses) => resolve(witnesses))
			this.sendCustomCommand({ type: 'get-my-witnesses' })
		})
	}

	handleCustomMessage (payload) {
		// `sendCustomMessage` from MyChild can be handled here
		switch (payload.type) {
		case 'chash':
			this.emit('chash', payload.chash)
			break
		case 'my-witnesses':
			this.emit('my-witnesses', payload.witnesses)
			break
		}
	}
}

module.exports = MyNode
