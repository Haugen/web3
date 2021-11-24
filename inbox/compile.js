const path = require('path');
const fs = require('fs');
const solc = require('solc');

const inboxPath = path.resolve(__dirname, 'contracts', 'Inbox.sol');
const source = fs.readFileSync(inboxPath, 'utf8');

const input = {
  language: 'Solidity',
  sources: {
    Inbox: {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*'],
      },
    },
  },
};

const output = solc.compile(JSON.stringify(input));
// Write compiled contract to file for inspection help.
fs.writeFileSync('./output.json', output);

// Prepare the abi and bytecode for being exported.
const abi = JSON.parse(output).contracts.Inbox.Inbox.abi;
const bytecode = JSON.parse(output).contracts.Inbox.Inbox.evm.bytecode.object;

module.exports = { abi, bytecode };
