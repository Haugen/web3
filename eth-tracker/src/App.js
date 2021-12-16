import { useEffect, useState } from 'react';

import { ethers } from 'ethers';

import './App.css';

function App() {
  let [txs, setTxs] = useState([]);

  useEffect(() => {
    (async () => {
      // const apiKey = process.env.REACT_APP_ETHERSCAN_API_KEY;
      const etherscan = new ethers.providers.EtherscanProvider('mainnet');

      const wallet = '0x79308680fA5297401f335C39e7F440C35C6f6Fc5';
      const history = await etherscan.getHistory(wallet);
      const lastThree = history.slice(Math.max(history.length - 3, 0));
      lastThree.reverse();

      const txsData = lastThree.map((tx) => {
        return {
          txHash: tx.hash,
          block: tx.blockNumber,
          timestamp: tx.timestamp,
          from: tx.from,
          to: tx.to,
        };
      });

      setTxs(txsData);
    })();
  }, []);

  const formatAddress = (address) => {
    const first = address.slice(0, 5);
    const last = address.slice(Math.max(address.length - 4, 0));
    return `${first}...${last}`;
  };

  const formatTx = (hash) => {
    return hash.slice(0, 15) + '...';
  };

  const formatTime = (timestamp) => {
    const now = Date.now() / 1000;
    return Math.floor((now - timestamp) / 60 / 60);
  };

  const formatTxs = (txs) => {
    const formatted = [];
    for (const tx of txs) {
      formatted.push(
        <tr key={tx.txHash}>
          <td>{formatTx(tx.txHash)}</td>
          <td>{tx.block}</td>
          <td>{formatTime(tx.timestamp)} hours ago</td>
          <td>{formatAddress(tx.from)}</td>
          <td>{formatAddress(tx.to)}</td>
        </tr>
      );
    }
    return formatted;
  };

  return (
    <div className="App">
      <h1 className="text-3xl font-bold">ETH tracker</h1>
      <p>Why use Etherscan when you have ETH tracker?</p>
      <table>
        <thead>
          <tr>
            <th>Txn Hash</th>
            <th>Block</th>
            <th>Age</th>
            <th>From</th>
            <th>To</th>
          </tr>
        </thead>
        <tbody>{formatTxs(txs)}</tbody>
      </table>
    </div>
  );
}

export default App;
