// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

// NOTE: Deploy this contract first
contract B {
    // NOTE: storage layout must be the same as contract A
    // 注意：变量布局必须和合约A中的变量布局保持一致
    uint public num;
    address public sender;
    uint public value;

    function setVars(uint _num) public payable {
        num = _num;
        sender = msg.sender;
        value = msg.value;
    }
}

contract A {
    uint public num;
    address public sender;
    uint public value;

    function setVars(address _contract, uint _num) public payable {
        // A's storage is set, B is not modified.
        // A的变量发送变化，B没有改变
        (bool success, bytes memory data) = _contract.delegatecall(
            abi.encodeWithSignature("setVars(uint256)", _num)
        );
    }
}
