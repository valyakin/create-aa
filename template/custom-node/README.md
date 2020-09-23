# Autonomous Agent custom node template

Custom node provides the interface for integration with `aa-testkit`

`app.js` - user provided app based on `headless-obyte` or script

`test/custom-node/test.spec.js` - file with tests

`test/custom-node/MyNode.js` - interface for node in testkit. Functions from this class can be used inside test file

`test/custom-node/MyChild.js` - connector between node interface and user app.

Use `MyChild` to run your app. `MyChild` will be run in separate process and communicate with `MyNode` via inter-process communication(IPC). `MyChild` process will run `ocore` itself. `MyNode` does not run  any `ocore` code. It is being used to connect `MyChild` with `aa-testkit`

Use `this.sendCustomCommand` to send arbitrary JSON data from `MyNode` to `MyChild`. This messages can be handled inside `MyChild.handleCustomCommand` function

Use `this.sendCustomMessage` to send arbitrary JSON data from `MyChild` to `MyNode`. This messages can be handled inside `MyNode.handleCustomMessage` function

## Usage

### Run test

```bash
npm run test
# or
yarn test
```

### Lint test files

```bash
npm run lint
# or
yarn lint
```
