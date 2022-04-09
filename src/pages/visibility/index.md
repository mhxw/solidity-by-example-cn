---
title: Visibility  可见性
version: 0.8.10
description: An example of external, internal, private and public functions in Solidity
---

函数和状态变量必须声明它们是否可以被其他合约访问。

### 函数可见性

函数可以声明为

- `public` - 公开函数可以被内外部合约调用，对于 public 状态变量， 会自动生成一个 getter 函数。 (最宽松)
- `private` - 私有函数只能在本合约内部调用，不能被派生合约使用（限制性最强）。
- `internal`- 内部函数可以在本合约和继承合约中调用，不使用 `this` 调用，没有通过合约的 ABI 暴露给外部。
- `external` - 外部函数只能从外部其他合约中调用 (如果要从本合约中调用它，则必须使用 `this.`;即外部函数`externalFunc()`编译错误，但`this.externalFunc()`编译正确)。

### 状态变量可见性

状态变量可以声明为 `public`, `private`, 或者 `internal` 没有 `external` 一说.

- `public` - 公共状态变量与内部变量的不同之处仅在于编译器会自动为它们生成 getter 函数，这允许其他合约读取它们的值。内外部合约均能访问。
- `internal`- 内部状态变量只能被本合约或派生合约中访问。它们不能被外部访问。这是状态变量的默认可见性级别。
- `private` - 私有状态变量类似于内部变量，但它们在派生合约中不可见。

> 将一些变量声明为`private`或`internal`只能防止其他合约读取或修改信息，但它仍然会被区块链之外的真实世界看到。

```solidity
{{{Visibility}}}
```
