// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;



contract YourContract {
   struct Voter {
       uint weight;
       bool voted;
       address delegate;
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

   uint256 public constant VOTE_DURATION = 1 minutes;
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

   function giveRightToVote(address voter) external {
       checkCurrentTime();
       require(!voteEnded, "Vote is already ended");
       require(
           msg.sender == chairperson,
           "Only chairperson can give right to vote."
       );
       require(
           !voters[voter].voted,
           "The voter already voted."
       );
       require(voters[voter].weight == 0);
      voters[voter].weight = 1;
   }

   function delegate(address to) external {
       checkCurrentTime();
       require(!voteEnded, "Vote is already ended");
       Voter storage sender = voters[msg.sender];
       require(sender.weight != 0, "You have no right to vote");
       require(!sender.voted, "You already voted.");
       require(to != msg.sender, "Self-delegation is disallowed.");
       while (voters[to].delegate != address(0)) {
           to = voters[to].delegate;
           require(to != msg.sender, "Found loop in delegation.");
       }

       Voter storage delegate_ = voters[to];
       require(delegate_.weight >= 1);
       sender.voted = true;
       sender.delegate = to;

       if (delegate_.voted) {
           uint index = uint(searchIndex(sender.vote));
           proposals[index].voteCount += sender.weight;
       } else {
           delegate_.weight += sender.weight;
       }
   }

   function revokeDelegation() external  {
        checkCurrentTime();
        require(!voteEnded, "Vote is already ended");
        Voter storage sender = voters[msg.sender];
        require(sender.delegate != address(0), "You haven't delegated your vote");
        Voter storage delegate_ = voters[sender.delegate];

        if (delegate_.voted) {
            uint index = uint(searchIndex(delegate_.vote));
            proposals[index].voteCount -= sender.weight;
        } else {
            delegate_.weight -= sender.weight;
        }

        sender.voted = false;
        sender.delegate = address(0);
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



   function winningProposal() public returns (uint winningProposal_){
       checkCurrentTime();
       uint winningVoteCount = 0;
       for (uint p = 0; p < proposals.length; p++) {
           if (proposals[p].voteCount > winningVoteCount) {
               winningVoteCount = proposals[p].voteCount;
               winningProposal_ = p;
           }
       }
   }

   function winnerName() external returns (bytes32 winnerName_){
       checkCurrentTime();
       winnerName_ = proposals[winningProposal()].name;
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
