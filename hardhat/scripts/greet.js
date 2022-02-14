async function main() {
  const contract = await ethers.getContractAt(
    'Greeter',
    '0x5fbdb2315678afecb367f032d93f642f64180aa3'
  );

  console.log(await contract.greet());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
