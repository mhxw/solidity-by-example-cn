---
title: Self Destruct 自毁函数
version: 0.8.10
description: An example of how to delete your smart contract by calling seldestruct in Solidity
---

可以调用 `selfdestruct` 从区块链网络删除合约。

`selfdestruct` 将存储在合约中的所有剩余以太币发送到指定地址

自毁合约只是给你 gas 补贴，不能给你扩大 gas 限制。

### Vulnerability 漏洞

A malicious contract can use `selfdestruct` to
force sending Ether to any contract.

```solidity
{{{ForceEther}}}
```

### 防御措施

不要依赖 `address(this).balance`

```solidity
{{{PreventForceEther}}}
```
