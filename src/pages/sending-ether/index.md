---
title: 发送以太 (transfer, send, call)
version: 0.8.10
description: An example of sending Ether in Solidity
---

### 如何发送以太？

你可以向其他合约发送以太通过：

- `transfer` (2300 gas, throws error)
- `send` (2300 gas, returns bool)
- `call` (forward all gas or set gas, returns bool)

### 如何接收以太？

接收 Ether 的合约必须至少具有以下函数之一

- `receive() external payable`
- `fallback() external payable`

如果 `msg.data` 为空调用 `receive()` 否则调用 `fallback()`。

### Which method should you use?

`call` in combination with re-entrancy guard is the recommended method to use after December 2019.

Guard against re-entrancy by

- making all state changes before calling other contracts
- using re-entrancy guard modifier

```solidity
{{{SendingEther}}}
```
