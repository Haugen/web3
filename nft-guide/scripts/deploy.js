async function main() {
  const nftFactory = await ethers.getContractFactory('nftTest');

  // Start deployment, returning a promise that resolves to a contract object
  const nftTest = await nftFactory.deploy();
  console.log('Contract deployed to address:', nftTest.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
