---
title: Gas 优化技巧
version: 0.8.10
description: Some gas saving techniques
---

一些节约 gas 技巧。

- 将输入变量的 `memory` 存储位置改为 `calldata`
- 由加载状态变量改为内存变量
- 循环小技巧：将 `i++` 改为 `++i`
- Caching array elements 缓存数组元素
- Short circuit 短路

```solidity
{{{GasGolf}}}
```
