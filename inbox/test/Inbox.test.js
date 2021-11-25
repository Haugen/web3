const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

// Create a web3 client using Ganache.
const web3 = new Web3(ganache.provider());
// Get our abi and bytecode from our compiled project.
const { abi, bytecode } = require('../compile');

let account;
let inbox;
const INITIAL_MESSAGE = 'Hi there!';

beforeEach(async () => {
  // Get an account from the available Ganache accounts.
  [account] = await web3.eth.getAccounts();

  // Create the contract. We use out abi and bytecode from the compiled
  // contract. The arguments array correspond to the arguments our contracat
  // contructor expects.
  inbox = await new web3.eth.Contract(abi)
    .deploy({
      data: bytecode,
      arguments: [INITIAL_MESSAGE],
    })
    .send({ from: account, gas: '1000000' });
});

describe('Inbox', () => {
  it('Deploys a contract', () => {
    assert.ok(inbox.options.address);
  });

  it('Has a default message', async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, INITIAL_MESSAGE);
  });

  it('Can update the message', async () => {
    await inbox.methods
      .setMessage('New message')
      .send({ from: account, gas: '1000000' });
    const message = await inbox.methods.message().call();
    assert.equal(message, 'New message');
  });
});
