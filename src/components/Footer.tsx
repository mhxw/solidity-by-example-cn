import React from "react"
import styles from "./Footer.module.css"

function Footer() {
  return (
    <div className={styles.component}>
      <div className={styles.row}>
        <a href="https://github.com/mhxw/solidity-by-example-cn" target="__blank">
          源码
        </a>
        <div className={styles.bar}>|</div>
        <a
          href="https://github.com/mhxw/solidity-by-example-cn/blob/gh-pages/LICENSE"
          target="__blank"
        >
          license
        </a>
      </div>
    </div>
  )
}

export default Footer
