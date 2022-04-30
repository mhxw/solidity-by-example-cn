---
title: 发送以太 (transfer, send, call)
version: 0.8.10
description: An example of sending Ether in Solidity
---

### 如何发送以太？

你可以向其他合约发送以太通过：

- `transfer` (2300 gas, 抛出错误)
- `send` (2300 gas, 返回布尔值)
- `call` (转发所有 gas 或设置 gas，返回布尔值)

### 如何接收以太？

接收 Ether 的合约必须至少具有以下函数之一

- `receive() external payable`
- `fallback() external payable`

如果 `msg.data` 为空调用 `receive()` 否则调用 `fallback()`。

### 您应该使用哪种方法？

`call` 是 2019 年 12 月后推荐使用与重入防护结合使用的方法。

通过以下方式防止重入

- 在调用其他合约之前进行所有状态更改，遵循先判断，后写入变量在进行外部调用的编码规范（Checks-Effects-Interactions）；
- 使用防重入锁

注意点：在使用 call.value 时候，如果调用者是合约对象，会执行 fallback。

具体案例可参考此文章。

[https://mp.weixin.qq.com/s/nveh1aVTxIBUDTzzQqSuIQ](https://mp.weixin.qq.com/s/nveh1aVTxIBUDTzzQqSuIQ)

```solidity
{{{SendingEther}}}
```
