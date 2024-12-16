import { expect } from "chai";
import { ethers } from "hardhat";
import { YourContract } from "../typechain-types";
import { beforeEach } from "mocha";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("YourContract", function () {
  const candidateNames = ["first", "second"];

  let yourContract: YourContract;
  beforeEach(async () => {
    const yourContractFactory = await ethers.getContractFactory("YourContract");
    const candidates = candidateNames.map(candidate => ethers.encodeBytes32String(candidate));
    yourContract = (await yourContractFactory.deploy(candidates)) as YourContract;
    await yourContract.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should have correct candidates", async function () {
      const proposals = await yourContract.getProposals(); //returns transaction instead of return value because function isn't pure/view
      const proposalsNames = proposals.map(proposal => ethers.decodeBytes32String(proposal.name));
      expect(proposalsNames).to.have.same.members(candidateNames);
    });
  });

  describe("Voting", function () {
    it("Vote should work", async function () {
      const proposalIdToVoteFor = 1;
      const proposalBeforeVote = await yourContract.getProposal(proposalIdToVoteFor);
      expect(proposalBeforeVote.voteCount).equal(0n);
      await yourContract.vote(proposalIdToVoteFor);
      const proposalAfterVote = await yourContract.getProposal(proposalIdToVoteFor);
      expect(proposalAfterVote.voteCount).equal(1n);
    });

    it("Should correctly return winner name", async function () {
      const proposalIdToVoteFor = 2;
      await yourContract.vote(proposalIdToVoteFor);
      const winningProposalName = ethers.decodeBytes32String(await yourContract.winnerName());
      expect(winningProposalName).equal(candidateNames[proposalIdToVoteFor - 1]);
    });

    it("Should end vote after 24 hrs", async function () {
      const voteIsEndedAfterDeploy = await yourContract.voteEnded();
      expect(voteIsEndedAfterDeploy).equal(false);
      const msInOneDay = 24 * 60 * 60 * 1000;
      const nextDayDate = new Date(new Date().getTime() + msInOneDay);
      await time.increaseTo(nextDayDate);
      const voteCall = yourContract.vote(1);
      expect(voteCall).to.be.revertedWith("Vote is already ended");
    });

    it("Should drop error when trying to vote multiple times", async function () {
      const proposalIdToVoteFor = 1;
      await yourContract.vote(proposalIdToVoteFor);
      const voteCall2 = yourContract.vote(proposalIdToVoteFor);
      await expect(voteCall2).to.be.revertedWith("Already voted.");
    });

    it("Should drop error when trying to vote for non-existing proposal", async function () {
      const proposalIdToVoteFor = 62323;
      const voteCall = yourContract.vote(proposalIdToVoteFor);
      await expect(voteCall).to.be.revertedWith("Candidate not found");
    });
  });
});
