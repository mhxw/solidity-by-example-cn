---
title: Iterable Mapping 可迭代映射
version: 0.8.10
description: Iterable Mapping in Solidity
---

映射本身是无法遍历的，即无法枚举所有的键。不过，可以在它们之上实现一个数据结构来进行迭代。 以下是一个如何创建可迭代 `mapping` 的示例。

```solidity
{{{IterableMapping}}}
```
