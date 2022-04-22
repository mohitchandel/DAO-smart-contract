## Uniswap Smart Contract

This Project is deployed on the Rinkeby testnet

Governance Smart contract address: [0x5eF8De539c008114225b5Da150c93FcF3AF00F1d](https://rinkeby.etherscan.io/address/0x5eF8De539c008114225b5Da150c93FcF3AF00F1d)

ERC20 Token (Voting Token) address: [0x38a50e6529Bb1F9CBB2f9631701958c2D959B9a2](https://rinkeby.etherscan.io/address/0x38a50e6529Bb1F9CBB2f9631701958c2D959B9a2)



### Usage
How to clone and run this project
- Clone this repository : git clone https://github.com/mohitchandel/DAO-smart-contract.git
- Installing dependencies : `npm install`
- Compile the smart contracts with Hardhat : `npx hardhat compile`
- Run the tests : `npx hardhat test`
- Deploy contract to network : `npx hardhat run --network rinkeby scripts/deploy.js`

### About

The Governance smart contract is used to add some proposals and vote on them, this contract is controlled by the Controller smart contract which is responsible for all the controlling actions. This smart contract decide weather user can submit proposal or vote for any proposal. The controller smart contract is also protect users with the time lock e.g. if any proposal is accepted only admin can execute that proposal and admin can only execute after 1 week of acceptance so the users can be ready for the implementation of new proposal.

Governance smart contract will be created after the creation of ERC20 token (Voting Token) because the DAO smart contract (governance) need parameters of token address in its constructor.

`constructor(VotingToken _token) {}`


- #### Roles
  - Voter : Must have at least 100 Voting Tokens
  - Proposer : Must have at least 1000 Voting Tokens


### How to add Proposal

In Governance smart contract function `createProposal()` is used to add proposal.

this function has following arguments:

- `string memory _name` : It is name of the proposal.
- `string memory _description` : It is the description of the proposal.
- `uint256 _votingWeakPeriod` : Voting Time in weeks 



### How to Vote for Proposal

The `voteForProposal()` function is used to complete the process of voting

This function need two arguments:
- `uint256 _proposalId` - Proposal Id
- `VotedFor _voteFor`- where VoteFor is an enum which has two values {YES(0 and NO(1))}


In Governance contract there are few more functions 

- `completeProposalVoting(uint256 _proposalId)` : This function is used to mark proposal voting complete.
- `proposalResult(uint256 _proposalId)` : This function is called to check the final result of the proposal voting.
- `execution(uint256 _proposalId)` : This function is called when proposal is ready to execute (only admin can call this function)
- `removeProposal(uint256 _proposalId)` : This function is called when proposal is executed or denied and it needs to be removed.

