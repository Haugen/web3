import { useState, useEffect } from 'react';
import { Container, Button, Heading, Text, Stack } from '@chakra-ui/react';

import lottery from './lottery';
import web3 from './web3';

function App() {
  const [manager, setManager] = useState('');
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState('');
  const [message, setMessage] = useState('');

  // useEffect(() => {
  //   const fetchManager = async () => {
  //     const cManager = await lottery.methods.manager().call();
  //     const cPlayers = await lottery.methods.getPlayers().call();
  //     const cBalance = await web3.eth.getBalance(lottery.options.address);
  //     setManager(cManager);
  //     setPlayers(cPlayers);
  //     setBalance(cBalance);
  //   };
  //   fetchManager();
  // }, []);

  const enterLottery = async () => {
    const amount = web3.utils.toWei('0.001', 'ether');
    setMessage('Entering you into the lottery. Stay put...');
    const [account] = await web3.eth.getAccounts();
    await lottery.methods.enter().send({
      from: account,
      value: amount,
    });
    setMessage('You entered the lottery. Good luck!');
  };

  const pickWinner = async () => {
    setMessage('Picking winner...');
    await lottery.methods.pickWinner().send({ from: manager });
    setMessage('A winner has been picked!');
  };

  return (
    <Container mt={10}>
      <Heading mb={5}>Lottery</Heading>
      <Stack>
        <Text>Lottery contract deployed by address {manager}.</Text>
        <Text>
          There are currently {players.length} addresses entered in the lottery.
        </Text>
        <Text>
          Current price pool {web3.utils.fromWei(balance, 'ether')} ether.
        </Text>
        <Button colorScheme="pink" variant="outline" onClick={enterLottery}>
          Enter the lottery
        </Button>
        <Button colorScheme="pink" onClick={pickWinner}>
          Pick a winner
        </Button>
        <Text>{message}</Text>
      </Stack>
    </Container>
  );
}

export default App;
