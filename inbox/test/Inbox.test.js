const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

// Create a web3 client using Ganache.
const web3 = new Web3(ganache.provider());
// Get our abi and bytecode from our compiled project.
const { abi, bytecode } = require('../compile');

let account;
let inbox;

beforeEach(async () => {
  // Get an account from the available Ganache accounts.
  [account] = await web3.eth.getAccounts();

  // Create the contract. We use out abi and bytecode from the compiled
  // contract. The arguments array correspond to the arguments our contracat
  // contructor expects.
  inbox = await new web3.eth.Contract(abi)
    .deploy({
      data: bytecode,
      arguments: ['Hi there!'],
    })
    .send({ from: account, gas: '1000000' });
});

describe('Main test', () => {
  it('Tests', () => {
    console.log(inbox);
  });
});
