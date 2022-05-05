// metadata
export const version = "0.8.10"
export const title = "发送以太 (transfer, send, call)"
export const description = "An example of sending Ether in Solidity"

const html = `<h3 id="如何发送以太？">如何发送以太？</h3>
<p>你可以向其他合约发送以太通过：</p>
<ul>
<li><code>transfer</code> (2300 gas, 抛出错误)</li>
<li><code>send</code> (2300 gas, 返回布尔值)</li>
<li><code>call</code> (转发所有 gas 或设置 gas，返回布尔值)</li>
</ul>
<h3 id="如何接收以太？">如何接收以太？</h3>
<p>接收 Ether 的合约必须至少具有以下函数之一</p>
<ul>
<li><code>receive() external payable</code></li>
<li><code>fallback() external payable</code></li>
</ul>
<p>如果 <code>msg.data</code> 为空调用 <code>receive()</code> 否则调用 <code>fallback()</code>。</p>
<h3 id="您应该使用哪种方法？">您应该使用哪种方法？</h3>
<p><code>call</code> 是 2019 年 12 月后推荐使用与重入防护结合使用的方法。</p>
<p>通过以下方式防止重入</p>
<ul>
<li>在调用其他合约之前进行所有状态更改，遵循先判断，后写入变量在进行外部调用的编码规范（Checks-Effects-Interactions）；</li>
<li>使用防重入锁</li>
</ul>
<p>注意点：在使用 call.value 时候，如果调用者是合约对象，会执行 fallback。</p>
<p>具体案例可参考此文章。</p>
<p><a href="https://mp.weixin.qq.com/s/nveh1aVTxIBUDTzzQqSuIQ">https://mp.weixin.qq.com/s/nveh1aVTxIBUDTzzQqSuIQ</a></p>
<pre><code class="language-solidity"><span class="hljs-comment">// SPDX-License-Identifier: MIT</span>
<span class="hljs-meta"><span class="hljs-keyword">pragma</span> <span class="hljs-keyword">solidity</span> ^0.8.10;</span>

<span class="hljs-class"><span class="hljs-keyword">contract</span> <span class="hljs-title">ReceiveEther</span> </span>{
    <span class="hljs-comment">/*
    Which function is called, fallback() or receive()?

           send Ether
               |
         msg.data is empty?
              / \\
            yes  no
            /     \\
receive() exists?  fallback()
         /   \\
        yes   no
        /      \\
    receive()   fallback()
    */</span>

    <span class="hljs-comment">// Function to receive Ether. msg.data must be empty</span>
    <span class="hljs-function"><span class="hljs-keyword">receive</span>(<span class="hljs-params"></span>) <span class="hljs-title"><span class="hljs-keyword">external</span></span> <span class="hljs-title"><span class="hljs-keyword">payable</span></span> </span>{}

    <span class="hljs-comment">// Fallback function is called when msg.data is not empty</span>
    <span class="hljs-function"><span class="hljs-keyword">fallback</span>(<span class="hljs-params"></span>) <span class="hljs-title"><span class="hljs-keyword">external</span></span> <span class="hljs-title"><span class="hljs-keyword">payable</span></span> </span>{}

    <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">getBalance</span>(<span class="hljs-params"></span>) <span class="hljs-title"><span class="hljs-keyword">public</span></span> <span class="hljs-title"><span class="hljs-keyword">view</span></span> <span class="hljs-title"><span class="hljs-keyword">returns</span></span> (<span class="hljs-params"><span class="hljs-keyword">uint</span></span>) </span>{
        <span class="hljs-keyword">return</span> <span class="hljs-keyword">address</span>(<span class="hljs-built_in">this</span>).<span class="hljs-built_in">balance</span>;
    }
}

<span class="hljs-class"><span class="hljs-keyword">contract</span> <span class="hljs-title">SendEther</span> </span>{
    <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">sendViaTransfer</span>(<span class="hljs-params"><span class="hljs-keyword">address</span> <span class="hljs-keyword">payable</span> _to</span>) <span class="hljs-title"><span class="hljs-keyword">public</span></span> <span class="hljs-title"><span class="hljs-keyword">payable</span></span> </span>{
        <span class="hljs-comment">// 不再推荐使用此功能发送以太币。</span>
        _to.<span class="hljs-built_in">transfer</span>(<span class="hljs-built_in">msg</span>.<span class="hljs-built_in">value</span>);
    }

    <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">sendViaSend</span>(<span class="hljs-params"><span class="hljs-keyword">address</span> <span class="hljs-keyword">payable</span> _to</span>) <span class="hljs-title"><span class="hljs-keyword">public</span></span> <span class="hljs-title"><span class="hljs-keyword">payable</span></span> </span>{
        <span class="hljs-comment">// Send 会返回一个布尔值，表示成功或失败</span>
        <span class="hljs-comment">// 不建议使用此功能发送 Ether。</span>
        <span class="hljs-keyword">bool</span> sent <span class="hljs-operator">=</span> _to.<span class="hljs-built_in">send</span>(<span class="hljs-built_in">msg</span>.<span class="hljs-built_in">value</span>);
        <span class="hljs-built_in">require</span>(sent, <span class="hljs-string">"Failed to send Ether"</span>);
    }

    <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">sendViaCall</span>(<span class="hljs-params"><span class="hljs-keyword">address</span> <span class="hljs-keyword">payable</span> _to</span>) <span class="hljs-title"><span class="hljs-keyword">public</span></span> <span class="hljs-title"><span class="hljs-keyword">payable</span></span> </span>{
        <span class="hljs-comment">// Call 会返回一个布尔值</span>
        <span class="hljs-comment">// 这是当前推荐使用的方法。</span>
        (<span class="hljs-keyword">bool</span> sent, <span class="hljs-keyword">bytes</span> <span class="hljs-keyword">memory</span> data) <span class="hljs-operator">=</span> _to.<span class="hljs-built_in">call</span>{<span class="hljs-built_in">value</span>: <span class="hljs-built_in">msg</span>.<span class="hljs-built_in">value</span>}(<span class="hljs-string">""</span>);
        <span class="hljs-built_in">require</span>(sent, <span class="hljs-string">"Failed to send Ether"</span>);
    }
}
</code></pre>
`

export default html
