// Deployed to Rinkeby Nov 24th
// Contract address: 0xD91eB9518aE232b30a62a54a4F1c56a9b687492c

require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { abi, bytecode } = require('./compile');

const provider = new HDWalletProvider(
  process.env.SEED_PHRASE,
  'https://rinkeby.infura.io/v3/345c8902ca104e7296566df548c5a10d' // Deprecated
);

const web3 = new Web3(provider);

const deploy = async () => {
  const [account] = await web3.eth.getAccounts();
  console.log('Deploying from account', account);

  const result = await new web3.eth.Contract(abi)
    .deploy({
      data: bytecode,
      arguments: ['Hi there!'],
    })
    .send({ from: account, gas: '1000000' });

  console.log('Contract address:', result.options.address);
  provider.engine.stop();
};

deploy();
