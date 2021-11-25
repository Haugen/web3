const path = require('path');
const fs = require('fs');
const solc = require('solc');

const contractPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');
const source = fs.readFileSync(contractPath, 'utf8');

const input = {
  language: 'Solidity',
  sources: {
    Lottery: {
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

// Prepare the abi and bytecode for being exported.
const abi = JSON.parse(output).contracts.Lottery.Lottery.abi;
const bytecode =
  JSON.parse(output).contracts.Lottery.Lottery.evm.bytecode.object;

module.exports = { abi, bytecode };
