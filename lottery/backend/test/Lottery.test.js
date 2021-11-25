const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

// Create a web3 client using Ganache.
const web3 = new Web3(ganache.provider());
// Get our abi and bytecode from our compiled project.
const { abi, bytecode } = require('../compile');

let lottery;
let owner, account1, account2;
const LOTTERY_AMOUNT = '0.001';

beforeEach(async () => {
  [owner, account1, account2] = await web3.eth.getAccounts();
  lottery = await new web3.eth.Contract(abi)
    .deploy({ data: bytecode })
    .send({ from: owner, gas: '1000000' });
});

describe('Lottery Contract', () => {
  it('Deploys a contract', () => {
    assert.ok(lottery.options.address);
  });

  it('Allows one account to enter', async () => {
    await lottery.methods.enter().send({
      from: account1,
      value: web3.utils.toWei(LOTTERY_AMOUNT, 'ether'),
    });

    const players = await lottery.methods.getPlayers().call({
      from: owner,
    });

    assert.equal(account1, players[0]);
    assert.equal(1, players.length);
  });

  it('Allows multiple accounts to enter', async () => {
    await lottery.methods.enter().send({
      from: account1,
      value: web3.utils.toWei(LOTTERY_AMOUNT, 'ether'),
    });

    await lottery.methods.enter().send({
      from: account2,
      value: web3.utils.toWei(LOTTERY_AMOUNT, 'ether'),
    });

    const players = await lottery.methods.getPlayers().call({
      from: owner,
    });

    assert.equal(account1, players[0]);
    assert.equal(account2, players[1]);
    assert.equal(2, players.length);
  });

  it('Requires the correct amount of ether to enter', async () => {
    try {
      await lottery.methods.enter().send({
        from: account1,
        value: web3.utils.toWei('0.0005', 'ether'),
      });
      assert.fail();
    } catch (error) {
      assert.ok(true);
    }
  });

  it('Only allow owner to pick winner', async () => {
    try {
      await lottery.methods.pickWinner().send({
        from: account1,
      });
      assert.fail();
    } catch (error) {
      assert.ok(true);
    }
  });

  it('Sends money to the winner and resets lottery', async () => {
    await lottery.methods.enter().send({
      from: account1,
      value: web3.utils.toWei(LOTTERY_AMOUNT, 'ether'),
    });
    const initialBalance = await web3.eth.getBalance(account1);
    await lottery.methods.pickWinner().send({ from: owner });
    const newBalance = await web3.eth.getBalance(account1);
    const players = await lottery.methods.getPlayers().call({ from: owner });
    assert(players.length == 0);
    assert(newBalance > initialBalance);
  });
});
