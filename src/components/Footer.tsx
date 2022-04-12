import React from "react"
import styles from "./Footer.module.css"

function Footer() {
  return (
    <div className={styles.component}>
      <div className={styles.row}>
        <a href="https://mhxw.life/ethereum-development-with-go-book/" target="__blank">
          用Go来做以太坊开发
        </a>
      </div>
      <div className={styles.row}>
        <a href="https://github.com/mhxw/solidity-by-example-cn" target="__blank">
          源码
        </a>
        <div className={styles.bar}>|</div>
        <a
          href="https://github.com/mhxw/solidity-by-example-cn/blob/dev/LICENSE"
          target="__blank"
        >
          License
        </a>
      </div>
    </div>
  )
}

export default Footer
