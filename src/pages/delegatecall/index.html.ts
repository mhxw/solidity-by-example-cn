// metadata
export const version = "0.8.10"
export const title = "Delegatecall 多重调用"
export const description = "Example of how to use deletegatecall in Solidity"

const html = `<p><code>delegatecall</code> 是一个类似于 <code>call</code> 的低级函数。</p>
<p>当合约 <code>A</code> 使用 <code>delegatecall</code> 调用合约 <code>B</code> 的方法, 合约 <code>B</code> 的代码，合约 <code>A</code>的存储, <code>msg.sender</code> 和 <code>msg.value</code> 被执行。</p>
<p>相当于合约 A 调用 B 的方法，合约 B 中的值没有发生改变，而合约 A 的值发生改变。</p>
<blockquote>
<p>注意</p>
<p>委托调用合约的变量位置和被调用合约的变量位置必须保持一致。
在新版 solidity 中，可以在被调用合约的当前所有变量之后添加新的变量，但不能在当前所有变量之前添加新变量。</p>
</blockquote>
<pre><code class="language-solidity"><span class="hljs-comment">// SPDX-License-Identifier: MIT</span>
<span class="hljs-meta"><span class="hljs-keyword">pragma</span> <span class="hljs-keyword">solidity</span> ^0.8.10;</span>

<span class="hljs-comment">// <span class="hljs-doctag">NOTE:</span> Deploy this contract first</span>
<span class="hljs-class"><span class="hljs-keyword">contract</span> <span class="hljs-title">B</span> </span>{
    <span class="hljs-comment">// <span class="hljs-doctag">NOTE:</span> storage layout must be the same as contract A</span>
    <span class="hljs-comment">// 注意：变量布局必须和合约A中的变量布局保持一致</span>
    <span class="hljs-keyword">uint</span> <span class="hljs-keyword">public</span> num;
    <span class="hljs-keyword">address</span> <span class="hljs-keyword">public</span> sender;
    <span class="hljs-keyword">uint</span> <span class="hljs-keyword">public</span> value;

    <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">setVars</span>(<span class="hljs-params"><span class="hljs-keyword">uint</span> _num</span>) <span class="hljs-title"><span class="hljs-keyword">public</span></span> <span class="hljs-title"><span class="hljs-keyword">payable</span></span> </span>{
        num <span class="hljs-operator">=</span> _num;
        sender <span class="hljs-operator">=</span> <span class="hljs-built_in">msg</span>.<span class="hljs-built_in">sender</span>;
        value <span class="hljs-operator">=</span> <span class="hljs-built_in">msg</span>.<span class="hljs-built_in">value</span>;
    }
}

<span class="hljs-class"><span class="hljs-keyword">contract</span> <span class="hljs-title">A</span> </span>{
    <span class="hljs-keyword">uint</span> <span class="hljs-keyword">public</span> num;
    <span class="hljs-keyword">address</span> <span class="hljs-keyword">public</span> sender;
    <span class="hljs-keyword">uint</span> <span class="hljs-keyword">public</span> value;

    <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">setVars</span>(<span class="hljs-params"><span class="hljs-keyword">address</span> _contract, <span class="hljs-keyword">uint</span> _num</span>) <span class="hljs-title"><span class="hljs-keyword">public</span></span> <span class="hljs-title"><span class="hljs-keyword">payable</span></span> </span>{
        <span class="hljs-comment">// A&#x27;s storage is set, B is not modified.</span>
        <span class="hljs-comment">// A的变量发送变化，B没有改变</span>
        (<span class="hljs-keyword">bool</span> success, <span class="hljs-keyword">bytes</span> <span class="hljs-keyword">memory</span> data) <span class="hljs-operator">=</span> _contract.<span class="hljs-built_in">delegatecall</span>(
            <span class="hljs-built_in">abi</span>.<span class="hljs-built_in">encodeWithSignature</span>(<span class="hljs-string">"setVars(uint256)"</span>, _num)
        );
    }
}
</code></pre>
`

export default html
