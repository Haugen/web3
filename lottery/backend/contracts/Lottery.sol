// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

contract Lottery {
    address public manager;
    address[] public players;

    constructor() {
        manager = msg.sender;
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function enter() public payable {
        require(msg.value == .001 ether);
        players.push(msg.sender);
    }

    // Pseudo random generator. True RNG is difficult on the blockchain. One
    // option to use is Chainlink VRF.
    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
    }

    function pickWinner() public restricted {
        uint index = random() % players.length;
        // Players address needs to be marked payable.
        payable(players[index]).transfer(address(this).balance);
        players = new address[](0);
    }

    function getPlayers() public view returns (address[] memory) {
        return players;
    }
}
