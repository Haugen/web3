# Lottery

A first test project to interact with a contract front a front end React app. This is a very simple project and in no means done, and still lacking a lot of features and error checks.

## Backend

The backend is mostly a copy from the inbox folder. It defines the contract in Solidity, writes multiple tests for it using Mocha, and includes a compile and deploy script.

## Frontend

A simple React app that interacts with the contract.

### lottery.js

In lottery.js, we take the contract address and the abi generated from the deployment to the Rinkeby test network. We use these the make a connection to our contract that we can then use in the app.

### web3.js

Small file to use our in app version of web3, rather than the web3 object that Metamask is automatically inserting on every website.
