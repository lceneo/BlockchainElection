// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;



contract YourContract {
   struct Voter {
       uint weight;
       bool voted;
       uint vote;
       bool isParticipatingInVote;
   }
   struct Proposal {
       uint id;
       bytes32 name;
       uint voteCount;
   }

   address public chairperson;
   mapping(address => Voter) public voters;
   Proposal[] private proposals;
   bool public voteEnded = false;

   uint256 public constant VOTE_DURATION = 24 hours;
   uint256 public creationTimestamp;

   constructor(bytes32[] memory proposalNames) {
       chairperson = msg.sender;
       voters[chairperson].weight = 1;
       for (uint i = 0; i < proposalNames.length; i++) {
           proposals.push(Proposal({
               id: i + 1,
               name: proposalNames[i],
               voteCount: 0
           }));
       }
      creationTimestamp = block.timestamp;
   }


    function checkCurrentTime() private  {
        if (voteEnded) { return; }
        else if (block.timestamp >= creationTimestamp + VOTE_DURATION) {
            endVoting();
        }
    }

   function getProposals() public returns (Proposal[] memory){
        checkCurrentTime();
        return proposals;
   }

   function endVoting() private  {
        require(!voteEnded, "Vote is already ended");
        voteEnded = true;
   }

   function vote(uint proposalId) external {
       checkCurrentTime();
       require(!voteEnded, "Vote is already ended");
       Voter storage sender = voters[msg.sender];
       if (!sender.isParticipatingInVote) {
        sender.weight = 1;
        sender.isParticipatingInVote = true;
       }
       require(sender.weight != 0, "Has no right to vote");
       require(!sender.voted, "Already voted.");
       int index = searchIndex(proposalId);
       require(index != -1, "Candidate not found");
       sender.voted = true;
       sender.vote = proposalId;
       proposals[uint(index)].voteCount += sender.weight;
   }

   function searchIndex(uint _id) public view returns (int) {
       for (uint i = 0; i < proposals.length; i++) {
           if (proposals[i].id == _id) {
               return int(i);
           }
       }
       return -1;
   }
}
