// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Controller {

    ERC20 private token;

    constructor(ERC20 _token) {
        token = _token;
    }

    function canVote(address _participient) internal view returns(bool){
        if(token.balanceOf(_participient) > (100 * 10**token.decimals()) ) return true;
        else return false;
    }

    function canPropose(address _participient) internal view returns(bool){
        if(token.balanceOf(_participient) > (1000 * 10**token.decimals()) ) return true;
        else return false;
    }
    
}