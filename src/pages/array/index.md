---
title: Array 数组
version: 0.8.10
description: Learn about arrays in Solidity
---

数组可以声明时指定长度，也可以时动态变长。

```solidity
{{{Array}}}
```

### Examples of removing array element

- 通过从右向左移动（《=）元素来删除数组元素

```solidity
{{{ArrayRemoveByShifting}}}
```

- 通过将最后一个元素复制到要删除的位置来删除数组元素

这种方案比上面的方案节约 gas，但是顺序被打乱了。

```solidity
{{{ArrayReplaceFromEnd}}}
```
