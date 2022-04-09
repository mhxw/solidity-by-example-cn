---
title: Immutable 不可变量
version: 0.8.10
description: Immutable variables
---

Immutable variables are like constants. Values of immutable variables can be set inside the constructor but cannot be modified afterwards.

Immutable 修饰的变量是在部署的时候确定变量的值, 它在构造函数中赋值一次之后,就不在改变, 这是一个运行时赋值, 就可以解除之前 constant 不支持使用运行时状态赋值的限制。

Immutable 不可变量同样不会占用状态变量存储空间, 在部署时,变量的值会被追加的运行时字节码中, 因此它比使用状态变量便宜的多, 同样带来了更多的安全性(确保了这个值无法在修改)。

```solidity
{{{Immutable}}}
```
