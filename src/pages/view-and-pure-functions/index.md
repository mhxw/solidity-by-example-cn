---
title: View and Pure 函数
version: 0.8.10
description: An example of view and pure functions in Solidity
---

Getter 函数可以声明为 `view` 或者 `pure` 函数。

### 视图函数（View Functions）

用`View`声明的函数只能读取状态，而**不能修改状态**。

以下几种情况认为是修改了状态：

- 写状态变量
- 触发事件（events）
- 创建其他的合约
- 使用 selfdestruct。
- call 调用附加了以太币
- 调用了任何没有 view 或 pure 修饰的函数
- 使用了低级别的调用（low-level calls）
- 使用了包含特定操作符的内联汇编

### 纯函数（Pure Functions）

用`Pure`声明的函数**既不能读取也不能修改状态**。

以下几种情况被认为是读取了状态：

- 读状态变量
- 访问了 this.balance 或 <address>.balance
- 访问了 block, tx, msg 的成员 (msg.sig 和 msg.data 除外).
- 调用了任何没有 pure 修饰的函数
- 使用了包含特定操作符的内联汇编

```solidity
{{{ViewAndPureFunctions}}}
```

用`View`和`Pure`关键字定义的函数不会改变以太坊区块链的状态，这意味着当你调用这些函数时，你不会向区块链发送任何交易，因为交易被定义为从一个状态到另一个状态的状态栏变换。其仅仅是，你连接的节点通过检查其自己的区块链版本在本地执行函数代码，并将结果返回，而无需将任何交易广播到以太坊网络。
