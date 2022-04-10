---
title: Fallback 回退函数
version: 0.8.10
description: Example of how to use fallback in Solidity
---

一个合约最多可以有一个回退函数，函数可声明为： `fallback () external [payable]` 或 `fallback (bytes calldata _input) external [payable] returns (bytes memory _output)` (都没有 `function` 关键字)。 它可以是 `virtual` 的，可以被重载也可以有`modifier` 。

### fallback 函数的场景：

- 当调用的函数找不到时，就会调用默认的`fallback`函数（如果函数标识符与智能合约中的任何可用函数都不匹配）。
- 当向某个合约中发送以太，接收合约没有`receive`函数，不管`msg.data`是否为空，都会调用`fallback`函数。
- 当向某个合约发送以太时，接收合约有`receive`函数，但`msg.data`不为空，这种情况也会调用`fallback`函数；除非`msg.data`为空，此时就会调用`receive`函数。

如果回退函数在接收以太时调用，该函数仅有 2300 gas limit 可以使用（如，当使用 send 或 transfer 时）。除了基础的日志输出之外，进行其他操作的余地很小。

下面的操作会消耗 2300 gas :

- 写入存储
- 创建合约
- 调用消耗大量 gas 的外部函数
- 发送以太币

```solidity
{{{Fallback}}}
```
