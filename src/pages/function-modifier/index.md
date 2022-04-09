---
title: Function Modifier 函数修改器
version: 0.8.10
description: Example of how to write function modifier in Solidity
---

Modifiers are code that can be run before and / or after a function call.
函数修改器(Modifiers)可以用来改变一个函数的行为，用于在函数执行前后检查某种条件。

修改器可用于:

- Restrict access
- Validate inputs
- Guard against reentrancy hack

```solidity
{{{FunctionModifier}}}
```
