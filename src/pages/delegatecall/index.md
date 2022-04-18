---
title: Delegatecall 多重调用
version: 0.8.10
description: Example of how to use deletegatecall in Solidity
---

`delegatecall` 是一个类似于 `call` 的低级函数。

当合约 `A` 使用 `delegatecall` 调用合约 `B` 的方法, 合约 `B` 的代码，合约 `A`的存储, `msg.sender` 和 `msg.value` 被执行。

相当于合约 A 调用 B 的方法，合约 B 中的值没有发生改变，而合约 A 的值发生改变。

> 注意
>
> 委托调用合约的变量位置和被调用合约的变量位置必须保持一致。
> 在新版 solidity 中，可以在被调用合约的当前所有变量之后添加新的变量，但不能在当前所有变量之前添加新变量。

```solidity
{{{Delegatecall}}}
```
