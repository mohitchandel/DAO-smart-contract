import { expect } from "chai";
import { Contract } from "ethers";
import { ethers, network } from "hardhat";
import { VotingToken } from "../typechain";

describe("DAO smart contract", function () {
    let admin: { address: string; }, voter: { address: string; };
    let token: VotingToken;
    let contract: Contract;
    let proposalName: string;
    let proposalDesc: string;
    let proposalTime: number;
    const tokenAmount = (num : string) => ethers.BigNumber.from(num);

    beforeEach(async function () {
        // getting admin address
        [admin, voter] = await ethers.getSigners();

        proposalName = "Introduce another Token";
        proposalDesc = "Do we need to Introduce another token?";
        proposalTime = 1;

        // Deploying flayer token 
        const VotingToken = await ethers.getContractFactory("VotingToken");
        token = await VotingToken.deploy();
        await token.deployed();

        // deploying staking contract
        const Governance = await ethers.getContractFactory("Governance");
        contract = await Governance.deploy(token.address);
        await contract.deployed();
    });

    describe("Governance Contract", function () {

        it("should create proposal", async function () {
            const createProposal = await contract.createProposal(proposalName, proposalDesc, proposalTime);
            await createProposal.wait();
            const proposals = await contract.proposals(1);
            expect(proposals.name).to.equal(proposalName);
        });

        it("should vote for proposal", async function() {
            const createProposal = await contract.createProposal(proposalName, proposalDesc, proposalTime);
            await createProposal.wait();
            
            const voteForProposal = await contract.voteForProposal(1, "0");
            await voteForProposal.wait();
            const proposals = await contract.proposals(1);
            expect(proposals.votedYes).to.equal(1);
        });

        it("complete proposal voting", async function() {
            const createProposal = await contract.createProposal(proposalName, proposalDesc, proposalTime);
            await createProposal.wait();
            
            const voteForProposal = await contract.voteForProposal(1, "0");
            await voteForProposal.wait();

            let openTimes = 10 * (7 * 24 * 60 * 60);
			await network.provider.send('evm_increaseTime', [openTimes])
			await network.provider.send('evm_mine')
            
            const completeVoting = await contract.completeProposalVoting(1);
            await completeVoting.wait();
            const proposals = await contract.proposals(1);
            expect(proposals.isComplete).to.equal(true);
        });

        it("Return proposal result", async function() {
            const createProposal = await contract.createProposal(proposalName, proposalDesc, proposalTime);
            await createProposal.wait();
            
            const voteForProposal = await contract.voteForProposal(1, "0");
            await voteForProposal.wait();

            let openTimes = 10 * (7 * 24 * 60 * 60);
			await network.provider.send('evm_increaseTime', [openTimes])
			await network.provider.send('evm_mine')
            
            const completeVoting = await contract.completeProposalVoting(1);
            await completeVoting.wait();
            
            const viewResult = await contract.proposalResult(1);
            expect(viewResult).to.equal("Proposal is accepted");
        });

        it("should execute proposal", async function () {
            const createProposal = await contract.createProposal(proposalName, proposalDesc, proposalTime);
            await createProposal.wait();
            
            const voteForProposal = await contract.voteForProposal(1, "0");
            await voteForProposal.wait();

            let openTimes = 1 * (7 * 24 * 60 * 60);
			await network.provider.send('evm_increaseTime', [openTimes])
			await network.provider.send('evm_mine')
            
            const completeVoting = await contract.completeProposalVoting(1);
            await completeVoting.wait();

            openTimes = 2 * (7 * 24 * 60 * 60);
			await network.provider.send('evm_increaseTime', [openTimes])
			await network.provider.send('evm_mine')

            const executeProposal = await contract.execution(1);
            await executeProposal.wait();

            const proposals = await contract.proposals(1);
            expect(proposals.isExecuted).to.equal(true);

        })

        it("should remove proposal", async function () {
            const createProposal = await contract.createProposal(proposalName, proposalDesc, proposalTime);
            await createProposal.wait();
            
            const voteForProposal = await contract.voteForProposal(1, "0");
            await voteForProposal.wait();

            let openTimes = 2 * (7 * 24 * 60 * 60);
			await network.provider.send('evm_increaseTime', [openTimes])
			await network.provider.send('evm_mine')
            
            const completeVoting = await contract.completeProposalVoting(1);
            await completeVoting.wait();

            openTimes = 2 * (7 * 24 * 60 * 60);
			await network.provider.send('evm_increaseTime', [openTimes])
			await network.provider.send('evm_mine')

            const executeProposal = await contract.execution(1);
            await executeProposal.wait();

            const removeProposal = await contract.removeProposal(1);
            await removeProposal.wait();

            const proposals = await contract.proposals(1);
            expect(proposals.name).to.equal("");
        })
    });

});
