import React from "react"
import SEO from "../components/SEO"
import styles from "./index.module.css"

interface Route {
  path: string
  title: string
}

const SOL_ROUTES: Route[] = [
  {
    path: "hello-world",
    title: "Hello World",
  },
  {
    path: "first-app",
    title: "First App",
  },
  {
    path: "primitives",
    title: "Primitive Data Types 数据类型",
  },
  {
    path: "variables",
    title: "Variables 变量",
  },
  {
    path: "constants",
    title: "Constants 常量",
  },
  {
    path: "immutable",
    title: "Immutable 不可变量",
  },
  {
    path: "state-variables",
    title: "读写状态变量",
  },
  {
    path: "ether-units",
    title: "Ether and Wei",
  },
  {
    path: "gas",
    title: "Gas and Gas Price",
  },
  // Flow control
  {
    path: "if-else",
    title: "If / Else 分支",
  },
  {
    path: "loop",
    title: "For 和 While 循环",
  },
  // collection data types
  {
    path: "mapping",
    title: "Mapping 映射",
  },
  {
    path: "array",
    title: "Array 数组",
  },
  // custom data types
  {
    path: "enum",
    title: "Enum 枚举",
  },
  {
    path: "structs",
    title: "Structs 结构体",
  },
  {
    path: "data-locations",
    title: "数据位置- Storage, Memory and Calldata",
  },
  // function
  {
    path: "function",
    title: "Function 函数简介",
  },
  {
    path: "view-and-pure-functions",
    title: "只读函数：View 和 Pure",
  },
  {
    path: "error",
    title: "Error 报错控制",
  },
  {
    path: "function-modifier",
    title: "Function Modifier 函数修改器",
  },
  {
    path: "events",
    title: "Events 事件",
  },
  // inheritance
  {
    path: "constructor",
    title: "Constructor 构造函数",
  },
  {
    path: "inheritance",
    title: "Inheritance 继承",
  },
  {
    path: "shadowing-inherited-state-variables",
    title: "覆盖父级状态变量",
  },
  {
    path: "super",
    title: "调用父级合约",
  },
  {
    path: "visibility",
    title: "Visibility 可见性",
  },
  {
    path: "interface",
    title: "Interface 接口合约",
  },
  // send / receive ether
  {
    path: "payable",
    title: "Payable 支付以太",
  },
  {
    path: "sending-ether",
    title: "发送以太 - Transfer, Send, and Call",
  },
  {
    path: "fallback",
    title: "Fallback 回退函数",
  },
  // contract interaction
  {
    path: "call",
    title: "Call 低级Call",
  },
  {
    path: "delegatecall",
    title: "Delegatecall 委托调用",
  },
  {
    path: "function-selector",
    title: "Function Selector 函数选择器",
  },

  {
    path: "calling-contract",
    title: "调用其他合约",
  },
  {
    path: "new-contract",
    title: "工厂合约：用合约部署合约",
  },
  // misc
  {
    path: "try-catch",
    title: "Try / Catch 语句",
  },
  {
    path: "import",
    title: "Import 引入",
  },
  {
    path: "library",
    title: "Library 库合约",
  },
  {
    path: "abi-decode",
    title: "ABI 解码",
  },
  // crypto
  {
    path: "hashing",
    title: "Hashing with Keccak256 哈希运算",
  },
  {
    path: "signature",
    title: "Verifying Signature 验证签名",
  },
  {
    path: "gas-golf",
    title: "Gas 优化",
  },
]

const APP_ROUTES: Route[] = [
  {
    path: "ether-wallet",
    title: "以太钱包合约",
  },
  {
    path: "multi-sig-wallet",
    title: "Multi Sig Wallet 多签钱包",
  },
  {
    path: "merkle-tree",
    title: "Merkle Tree 梅克尔树",
  },
  {
    path: "iterable-mapping",
    title: "Iterable Mapping 可迭代映射",
  },
  {
    path: "erc20",
    title: "ERC20合约",
  },
  {
    path: "erc721",
    title: "ERC721合约",
  },
  {
    path: "create2",
    title: "使用Create2计算新合约地址",
  },
  {
    path: "minimal-proxy",
    title: "Minimal Proxy Contract",
  },
  {
    path: "upgradeable-proxy",
    title: "Upgradeable Proxy 升级代理",
  },
  {
    path: "deploy-any-contract",
    title: "Deploy Any Contract 部署任意合约",
  },
  {
    path: "write-to-any-slot",
    title: "Write to Any Slot 写入任意插槽",
  },
  {
    path: "uni-directional-payment-channel",
    title: "Uni-directional Payment Channel 单向支付通道",
  },
  {
    path: "bi-directional-payment-channel",
    title: "Bi-directional Payment Channel 双向支付通道",
  },
  {
    path: "english-auction",
    title: "English Auction 英式拍卖",
  },
  {
    path: "dutch-auction",
    title: "Dutch Auction 荷兰式拍卖",
  },
  {
    path: "crowd-fund",
    title: "Crowd Fund 众筹合约",
  },
  {
    path: "multi-call",
    title: "Multi Call 多重调用",
  },
  {
    path: "multi-delegatecall",
    title: "Multi Delegatecall 多重委托调用",
  },
  {
    path: "time-lock",
    title: "Time Lock 时间锁",
  },
]

const HACK_ROUTES: Route[] = [
  {
    path: "re-entrancy",
    title: "Re-Entrancy 重入",
  },
  {
    path: "overflow",
    title: "Arithmetic Overflow and Underflow 算术溢出",
  },
  {
    path: "self-destruct",
    title: "Self Destruct 自毁函数",
  },
  {
    path: "accessing-private-data",
    title: "Accessing Private Data 访问私有数据",
  },
  {
    path: "delegatecall",
    title: "Delegatecall 委托调用",
  },
  {
    path: "randomness",
    title: "Source of Randomness 随机数",
  },
  {
    path: "denial-of-service",
    title: "Denial of Service",
  },
  {
    path: "phishing-with-tx-origin",
    title: "Phishing with tx.origin",
  },
  {
    path: "hiding-malicious-code-with-external-contract",
    title: "Hiding Malicious Code with External Contract",
  },
  {
    path: "honeypot",
    title: "Honeypot 蜜罐",
  },
  {
    path: "front-running",
    title: "Front Running",
  },
  {
    path: "block-timestamp-manipulation",
    title: "Block Timestamp Manipulation",
  },
  {
    path: "signature-replay",
    title: "Signature Replay 签名重放",
  },
  {
    path: "contract-size",
    title: "Bypass Contract Size Check",
  },
]

const SEC_ROUTES: Route[] = [
  {
    path: "solidity-security",
    title: "合约安全",
  },
]

const TEST_ROUTES: Route[] = [
  {
    path: "echidna",
    title: "Echidna",
  },
]

const DEFI_ROUTES = [
  {
    path: "uniswap-v2",
    title: "Uniswap V2 交换",
  },
  {
    path: "uniswap-v2-add-remove-liquidity",
    title: "Uniswap V2 添加和移除流动性",
  },
  {
    path: "uniswap-v2-optimal-one-sided-supply",
    title: "Uniswap V2 Optimal One Sided Supply",
  },
  {
    path: "chainlink-price-oracle",
    title: "Chainlink 价格预言机",
  },
  {
    path: "staking-rewards",
    title: "Staking Rewards 质押生息",
  },
  {
    path: "constant-sum-amm",
    title: "Constant Sum AMM",
  },
  {
    path: "constant-product-amm",
    title: "Constant Product AMM",
  },
]

export const ROUTES_BY_CATEGORY = [
  {
    title: "",
    routes: SOL_ROUTES.map((route) => ({
      ...route,
      path: `/solidity-by-example-cn/${route.path}`,
    })),
  },
  {
    title: "Applications",
    routes: APP_ROUTES.map((route) => ({
      ...route,
      path: `/solidity-by-example-cn/app/${route.path}`,
    })),
  },
  {
    title: "Hacks",
    routes: HACK_ROUTES.map((route) => ({
      ...route,
      path: `/solidity-by-example-cn/hacks/${route.path}`,
    })),
  },
  {
    title: "Security",
    routes: SEC_ROUTES.map((route) => ({
      ...route,
      path: `/solidity-by-example-cn/sec/${route.path}`,
    })),
  },
  {
    title: "Tests",
    routes: TEST_ROUTES.map((route) => ({
      ...route,
      path: `/solidity-by-example-cn/tests/${route.path}`,
    })),
  },
  {
    title: "DeFi",
    routes: DEFI_ROUTES.map((route) => ({
      ...route,
      path: `/solidity-by-example-cn/defi/${route.path}`,
    })),
  },
]

const ROUTES = ROUTES_BY_CATEGORY.map(({ routes }) => routes).flat()
const ROUTE_INDEX_BY_PATH = ROUTES.reduce((map, route: Route, i) => {
  // @ts-ignore
  map[route.path] = i
  return map
}, {})

export function getPrevNextPaths(path: string): {
  prev: Route | null
  next: Route | null
} {
  // @ts-ignore
  const index = ROUTE_INDEX_BY_PATH[path]
  if (index >= 0) {
    const prev = ROUTES[index - 1] || null
    const next = ROUTES[index + 1] || null
    return { prev, next }
  }
  return {
    prev: null,
    next: null,
  }
}

export default function HomePage() {
  return (
    <div className={styles.component}>
      <SEO
        title="Solidity by Example 中文版"
        description="使用 Solidity 学习编写智能合约"
      />
      <h1 className={styles.header}>
        <a href="/solidity-by-example-cn/">Solidity by Example 中文版</a>
      </h1>
      <div className={styles.subHeader}>v 0.8.10</div>
      <div className={styles.main}>
        <p>
          用简单的例子介绍{" "}
          <a href="https://docs.soliditylang.org/" target="__blank">
            Solidity
          </a>
        </p>

        {ROUTES_BY_CATEGORY.map(({ routes, title }, i) => (
          <div key={i}>
            {title && <h3 className={styles.category}>{title}</h3>}

            <ul className={styles.list}>
              {routes.map(({ path, title }) => (
                <li className={styles.listItem} key={path}>
                  <a href={path}>{title}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
