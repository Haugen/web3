// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint minimum) public {
        address campaignAddress = address(new Campaign(minimum, msg.sender));
        deployedCampaigns.push(campaignAddress);
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    uint public requestNum;
    address public manager;
    uint public minimumContribution;
    uint public contributorsCount;

    mapping (uint => Request) public requests;
    mapping(address => bool) public contributors;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    
    constructor(uint minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
    }


    function contribute() public payable {
        require(msg.value > minimumContribution);
        contributors[msg.sender] = true;
        contributorsCount++;
    }

    function createRequest(string memory description, uint value, address payable recipient) public restricted {
        uint requestId = requestNum++;
        Request storage r = requests[requestId]; 
        r.description = description;
        r.value = value;
        r.recipient = recipient;
        r.complete = false;
        r.approvalCount = 0;
    }

    function approveRequest(uint requestId) public {
        require(contributors[msg.sender]);
        Request storage request = requests[requestId];
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint requestId) public restricted {
        Request storage request = requests[requestId];
        require(!request.complete);
        require(request.approvalCount > (contributorsCount / 2));

        request.recipient.transfer(request.value);
        request.complete = true;
    }
}