// metadata
export const version = "0.8.10"
export const title = "View and Pure 函数"
export const description = "An example of view and pure functions in Solidity"

const html = `<p>Getter 函数可以声明为 <code>view</code> 或者 <code>pure</code> 函数。</p>
<h3 id="视图函数（view-functions）">视图函数（View Functions）</h3>
<p>用<code>View</code>声明的函数只能读取状态，而<strong>不能修改状态</strong>。</p>
<p>以下几种情况认为是修改了状态：</p>
<ul>
<li>写状态变量</li>
<li>触发事件（events）</li>
<li>创建其他的合约</li>
<li>使用 selfdestruct。</li>
<li>call 调用附加了以太币</li>
<li>调用了任何没有 view 或 pure 修饰的函数</li>
<li>使用了低级别的调用（low-level calls）</li>
<li>使用了包含特定操作符的内联汇编</li>
</ul>
<h3 id="纯函数（pure-functions）">纯函数（Pure Functions）</h3>
<p>用<code>Pure</code>声明的函数<strong>既不能读取也不能修改状态</strong>。</p>
<p>以下几种情况被认为是读取了状态：</p>
<ul>
<li>读状态变量</li>
<li>访问了 this.balance 或 <address>.balance</li>
<li>访问了 block, tx, msg 的成员 (msg.sig 和 msg.data 除外).</li>
<li>调用了任何没有 pure 修饰的函数</li>
<li>使用了包含特定操作符的内联汇编</li>
</ul>
<pre><code class="language-solidity"><span class="hljs-comment">// SPDX-License-Identifier: MIT</span>
<span class="hljs-meta"><span class="hljs-keyword">pragma</span> <span class="hljs-keyword">solidity</span> ^0.8.10;</span>

<span class="hljs-class"><span class="hljs-keyword">contract</span> <span class="hljs-title">ViewAndPure</span> </span>{
    <span class="hljs-keyword">uint</span> <span class="hljs-keyword">public</span> x <span class="hljs-operator">=</span> <span class="hljs-number">1</span>;

    <span class="hljs-comment">// Promise not to modify the state.</span>
    <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">addToX</span>(<span class="hljs-params"><span class="hljs-keyword">uint</span> y</span>) <span class="hljs-title"><span class="hljs-keyword">public</span></span> <span class="hljs-title"><span class="hljs-keyword">view</span></span> <span class="hljs-title"><span class="hljs-keyword">returns</span></span> (<span class="hljs-params"><span class="hljs-keyword">uint</span></span>) </span>{
        <span class="hljs-keyword">return</span> x <span class="hljs-operator">+</span> y;
    }

    <span class="hljs-comment">// Promise not to modify or read from the state.</span>
    <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">add</span>(<span class="hljs-params"><span class="hljs-keyword">uint</span> i, <span class="hljs-keyword">uint</span> j</span>) <span class="hljs-title"><span class="hljs-keyword">public</span></span> <span class="hljs-title"><span class="hljs-keyword">pure</span></span> <span class="hljs-title"><span class="hljs-keyword">returns</span></span> (<span class="hljs-params"><span class="hljs-keyword">uint</span></span>) </span>{
        <span class="hljs-keyword">return</span> i <span class="hljs-operator">+</span> j;
    }
}
</code></pre>
<p>用<code>View</code>和<code>Pure</code>关键字定义的函数不会改变以太坊区块链的状态，这意味着当你调用这些函数时，你不会向区块链发送任何交易，因为交易被定义为从一个状态到另一个状态的状态栏变换。其仅仅是，你连接的节点通过检查其自己的区块链版本在本地执行函数代码，并将结果返回，而无需将任何交易广播到以太坊网络。</p>
`

export default html
