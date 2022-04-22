// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Controller.sol";
import "./VotingToken.sol";

contract Governance is Controller {

    address private admin;
    VotingToken private token;
    uint256 private id;

    enum VotedFor{YES, NO}

    struct Proposal{
        uint256 id;
        string name;
        uint256 votedYes;
        uint256 votedNo;
        uint256 votingPeriod;
        address owner;
        uint256 voteCount;
        uint256 completedOn;
        bool isComplete;
        bool isExecuted;
    }
    mapping (uint => Proposal) public proposals;

    struct ProposalOwner{
        uint256 id;
        string name;
        address owner;
        bool isComplete;
    }
    mapping (address => ProposalOwner) public proposalOwner;

    struct VotedForId {
        uint[] votedIds;
    }
    mapping(address => VotedForId) votedId;


    constructor(VotingToken _token) Controller(_token, msg.sender) {
        token = _token;
        admin = msg.sender;
    }

    function createPeoposal(string memory _name, uint256 _votingWeakPeriod) external {
        require(Controller.canPropose(msg.sender) == true, "don't have proposal rights");
        require(proposalOwner[msg.sender].owner == address(0), "Can submit only one proposal at a time");
        id += 1;
        proposals[id].id = id;
        proposals[id].name = _name;
        proposals[id].votingPeriod = block.timestamp + (_votingWeakPeriod * 1 weeks);
        proposals[id].owner = msg.sender;
        proposalOwner[msg.sender] = ProposalOwner(id, _name, msg.sender, false);
    }

    function removeProposal(uint256 _id) external {
        require(proposals[_id].owner == msg.sender || msg.sender == admin, "Only proposal creator or admin can remove");
        require(proposals[_id].isComplete != false, "Proposal is not completed yet");
        delete proposals[_id];
        delete proposalOwner[msg.sender];
    }

    function voteForProposal(uint256 _id, VotedFor _voteFor) external {
        require(Controller.canVote(msg.sender) == true, "don't have voting rights");
        require(_voteFor == VotedFor.YES || _voteFor == VotedFor.NO, "Only yes(0) or no(1) accepted");
        require(proposals[_id].owner != address(0), "Proposal does not exist");
        require(proposals[id].votingPeriod > block.timestamp, "Voting period ended");
        for (uint i = 0; i < votedId[msg.sender].votedIds.length; i++) {
            require(votedId[msg.sender].votedIds[i] != _id, "already voted for this proposal");
        }
        votedId[msg.sender].votedIds.push(_id);
        if(_voteFor == VotedFor.YES){
            proposals[_id].votedYes += 1;
        }else{
            proposals[_id].votedNo += 1;
        }
        proposals[_id].voteCount += 1;
    }

    function completeProposalVoting(uint256 _id) external{
        require(proposals[_id].owner == msg.sender || msg.sender == admin, "Only proposal creator or admin can mark complete");
        require(proposals[_id].owner != address(0), "Proposal does not exist");
        require(proposals[id].votingPeriod < block.timestamp, "Voting period not ended yet");
        require(proposals[_id].isComplete == false, "Proposal already marked complete");
        proposals[id].isComplete = true;
        proposals[_id].completedOn = block.timestamp;
    }

    function proposalResult(uint256 _proposalId) external view returns(string memory){
        require(proposals[_proposalId].isComplete != false, "Proposal not completed yet");
        if(proposals[_proposalId].votedYes > proposals[_proposalId].votedNo) return("Proposal is accepted");
        else if(proposals[_proposalId].votedYes < proposals[_proposalId].votedNo) return("Proposal is Rejected");
        else return("Proposal Ties");
    }

    function execution(uint256 _id) external {
        require(Controller.canExecute(msg.sender) == true, "Don't have execution rights");
        require(proposals[_id].votedYes > proposals[_id].votedNo, "Denied Proposal can't be executed");
        require(proposals[_id].owner != address(0), "Proposal does not exist");
        require(proposals[_id].isComplete != false, "Proposal is not completed yet");
        require(Controller.isExecutable(proposals[_id].completedOn) == true, "Can't execute before 1 week");
        proposals[_id].isExecuted = true;
    }   

}