// metadata
export const version = "0.8.10"
export const title = "Fallback 回退函数"
export const description = "Example of how to use fallback in Solidity"

const html = `<p>一个合约最多可以有一个回退函数，函数可声明为： <code>fallback () external [payable]</code> 或 <code>fallback (bytes calldata _input) external [payable] returns (bytes memory _output)</code> (都没有 <code>function</code> 关键字)。 它可以是 <code>virtual</code> 的，可以被重载也可以有<code>modifier</code> 。</p>
<h3 id="fallback-函数的场景：">fallback 函数的场景：</h3>
<ul>
<li>当调用的函数找不到时，就会调用默认的<code>fallback</code>函数（如果函数标识符与智能合约中的任何可用函数都不匹配）。</li>
<li>当向某个合约中发送以太，接收合约没有<code>receive</code>函数，不管<code>msg.data</code>是否为空，都会调用<code>fallback</code>函数。</li>
<li>当向某个合约发送以太时，接收合约有<code>receive</code>函数，但<code>msg.data</code>不为空，这种情况也会调用<code>fallback</code>函数；除非<code>msg.data</code>为空，此时就会调用<code>receive</code>函数。</li>
</ul>
<p>如果回退函数在接收以太时调用，该函数仅有 2300 gas limit 可以使用（如，当使用 send 或 transfer 时）。除了基础的日志输出之外，进行其他操作的余地很小。</p>
<p>下面的操作会消耗 2300 gas :</p>
<ul>
<li>写入存储</li>
<li>创建合约</li>
<li>调用消耗大量 gas 的外部函数</li>
<li>发送以太币</li>
</ul>
<pre><code class="language-solidity"><span class="hljs-comment">// SPDX-License-Identifier: MIT</span>
<span class="hljs-meta"><span class="hljs-keyword">pragma</span> <span class="hljs-keyword">solidity</span> ^0.8.10;</span>

<span class="hljs-class"><span class="hljs-keyword">contract</span> <span class="hljs-title">Fallback</span> </span>{
    <span class="hljs-function"><span class="hljs-keyword">event</span> <span class="hljs-title">Log</span>(<span class="hljs-params"><span class="hljs-keyword">uint</span> gas</span>)</span>;

    <span class="hljs-comment">// Fallback function must be declared as external.</span>
    <span class="hljs-function"><span class="hljs-keyword">fallback</span>(<span class="hljs-params"></span>) <span class="hljs-title"><span class="hljs-keyword">external</span></span> <span class="hljs-title"><span class="hljs-keyword">payable</span></span> </span>{
        <span class="hljs-comment">// send / transfer (forwards 2300 gas to this fallback function)</span>
        <span class="hljs-comment">// call (forwards all of the gas)</span>
        <span class="hljs-keyword">emit</span> Log(<span class="hljs-built_in">gasleft</span>());
    }

    <span class="hljs-comment">// Helper function to check the balance of this contract</span>
    <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">getBalance</span>(<span class="hljs-params"></span>) <span class="hljs-title"><span class="hljs-keyword">public</span></span> <span class="hljs-title"><span class="hljs-keyword">view</span></span> <span class="hljs-title"><span class="hljs-keyword">returns</span></span> (<span class="hljs-params"><span class="hljs-keyword">uint</span></span>) </span>{
        <span class="hljs-keyword">return</span> <span class="hljs-keyword">address</span>(<span class="hljs-built_in">this</span>).<span class="hljs-built_in">balance</span>;
    }
}

<span class="hljs-class"><span class="hljs-keyword">contract</span> <span class="hljs-title">SendToFallback</span> </span>{
    <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">transferToFallback</span>(<span class="hljs-params"><span class="hljs-keyword">address</span> <span class="hljs-keyword">payable</span> _to</span>) <span class="hljs-title"><span class="hljs-keyword">public</span></span> <span class="hljs-title"><span class="hljs-keyword">payable</span></span> </span>{
        _to.<span class="hljs-built_in">transfer</span>(<span class="hljs-built_in">msg</span>.<span class="hljs-built_in">value</span>);
    }

    <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">callFallback</span>(<span class="hljs-params"><span class="hljs-keyword">address</span> <span class="hljs-keyword">payable</span> _to</span>) <span class="hljs-title"><span class="hljs-keyword">public</span></span> <span class="hljs-title"><span class="hljs-keyword">payable</span></span> </span>{
        (<span class="hljs-keyword">bool</span> sent, ) <span class="hljs-operator">=</span> _to.<span class="hljs-built_in">call</span>{<span class="hljs-built_in">value</span>: <span class="hljs-built_in">msg</span>.<span class="hljs-built_in">value</span>}(<span class="hljs-string">""</span>);
        <span class="hljs-built_in">require</span>(sent, <span class="hljs-string">"Failed to send Ether"</span>);
    }
}
</code></pre>
`

export default html
