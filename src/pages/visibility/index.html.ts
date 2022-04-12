// metadata
export const version = "0.8.10"
export const title = "Visibility  可见性"
export const description =
  "An example of external, internal, private and public functions in Solidity"

const html = `<p>函数和状态变量必须声明它们是否可以被其他合约访问。</p>
<h3 id="函数可见性">函数可见性</h3>
<p>函数可以声明为</p>
<ul>
<li><code>public</code> - 公开函数可以被内外部合约调用，对于 public 状态变量， 会自动生成一个 getter 函数。 (最宽松)</li>
<li><code>private</code> - 私有函数只能在本合约内部调用，不能被派生合约使用（限制性最强）。</li>
<li><code>internal</code>- 内部函数可以在本合约和继承合约中调用，不使用 <code>this</code> 调用，没有通过合约的 ABI 暴露给外部。</li>
<li><code>external</code> - 外部函数只能从外部其他合约中调用 (如果要从本合约中调用它，则必须使用 <code>this.</code>;即外部函数<code>externalFunc()</code>编译错误，但<code>this.externalFunc()</code>编译正确)。</li>
</ul>
<h3 id="状态变量可见性">状态变量可见性</h3>
<p>状态变量可以声明为 <code>public</code>, <code>private</code>, 或者 <code>internal</code> 没有 <code>external</code> 一说.</p>
<ul>
<li><code>public</code> - 公共状态变量与内部变量的不同之处仅在于编译器会自动为它们生成 getter 函数，这允许其他合约读取它们的值。内外部合约均能访问。</li>
<li><code>internal</code>- 内部状态变量只能被本合约或派生合约中访问。它们不能被外部访问。这是状态变量的默认可见性级别。</li>
<li><code>private</code> - 私有状态变量类似于内部变量，但它们在派生合约中不可见。</li>
</ul>
<blockquote>
<p>将一些变量声明为<code>private</code>或<code>internal</code>只能防止其他合约读取或修改信息，但它仍然会被区块链之外的真实世界看到。</p>
</blockquote>
<pre><code class="language-solidity"><span class="hljs-comment">// SPDX-License-Identifier: MIT</span>
<span class="hljs-meta"><span class="hljs-keyword">pragma</span> <span class="hljs-keyword">solidity</span> ^0.8.10;</span>

<span class="hljs-class"><span class="hljs-keyword">contract</span> <span class="hljs-title">Base</span> </span>{
    <span class="hljs-comment">// Private function can only be called</span>
    <span class="hljs-comment">// - inside this contract</span>
    <span class="hljs-comment">// Contracts that inherit this contract cannot call this function.</span>
    <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">privateFunc</span>(<span class="hljs-params"></span>) <span class="hljs-title"><span class="hljs-keyword">private</span></span> <span class="hljs-title"><span class="hljs-keyword">pure</span></span> <span class="hljs-title"><span class="hljs-keyword">returns</span></span> (<span class="hljs-params"><span class="hljs-keyword">string</span> <span class="hljs-keyword">memory</span></span>) </span>{
        <span class="hljs-keyword">return</span> <span class="hljs-string">"private function called"</span>;
    }

    <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">testPrivateFunc</span>(<span class="hljs-params"></span>) <span class="hljs-title"><span class="hljs-keyword">public</span></span> <span class="hljs-title"><span class="hljs-keyword">pure</span></span> <span class="hljs-title"><span class="hljs-keyword">returns</span></span> (<span class="hljs-params"><span class="hljs-keyword">string</span> <span class="hljs-keyword">memory</span></span>) </span>{
        <span class="hljs-keyword">return</span> privateFunc();
    }

    <span class="hljs-comment">// Internal function can be called</span>
    <span class="hljs-comment">// - inside this contract</span>
    <span class="hljs-comment">// - inside contracts that inherit this contract</span>
    <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">internalFunc</span>(<span class="hljs-params"></span>) <span class="hljs-title"><span class="hljs-keyword">internal</span></span> <span class="hljs-title"><span class="hljs-keyword">pure</span></span> <span class="hljs-title"><span class="hljs-keyword">returns</span></span> (<span class="hljs-params"><span class="hljs-keyword">string</span> <span class="hljs-keyword">memory</span></span>) </span>{
        <span class="hljs-keyword">return</span> <span class="hljs-string">"internal function called"</span>;
    }

    <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">testInternalFunc</span>(<span class="hljs-params"></span>) <span class="hljs-title"><span class="hljs-keyword">public</span></span> <span class="hljs-title"><span class="hljs-keyword">pure</span></span> <span class="hljs-title"><span class="hljs-keyword">virtual</span></span> <span class="hljs-title"><span class="hljs-keyword">returns</span></span> (<span class="hljs-params"><span class="hljs-keyword">string</span> <span class="hljs-keyword">memory</span></span>) </span>{
        <span class="hljs-keyword">return</span> internalFunc();
    }

    <span class="hljs-comment">// Public functions can be called</span>
    <span class="hljs-comment">// - inside this contract</span>
    <span class="hljs-comment">// - inside contracts that inherit this contract</span>
    <span class="hljs-comment">// - by other contracts and accounts</span>
    <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">publicFunc</span>(<span class="hljs-params"></span>) <span class="hljs-title"><span class="hljs-keyword">public</span></span> <span class="hljs-title"><span class="hljs-keyword">pure</span></span> <span class="hljs-title"><span class="hljs-keyword">returns</span></span> (<span class="hljs-params"><span class="hljs-keyword">string</span> <span class="hljs-keyword">memory</span></span>) </span>{
        <span class="hljs-keyword">return</span> <span class="hljs-string">"public function called"</span>;
    }

    <span class="hljs-comment">// External functions can only be called</span>
    <span class="hljs-comment">// - by other contracts and accounts</span>
    <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">externalFunc</span>(<span class="hljs-params"></span>) <span class="hljs-title"><span class="hljs-keyword">external</span></span> <span class="hljs-title"><span class="hljs-keyword">pure</span></span> <span class="hljs-title"><span class="hljs-keyword">returns</span></span> (<span class="hljs-params"><span class="hljs-keyword">string</span> <span class="hljs-keyword">memory</span></span>) </span>{
        <span class="hljs-keyword">return</span> <span class="hljs-string">"external function called"</span>;
    }

    <span class="hljs-comment">// This function will not compile since we&#x27;re trying to call</span>
    <span class="hljs-comment">// an external function here.</span>
    <span class="hljs-comment">// function testExternalFunc() public pure returns (string memory) {</span>
    <span class="hljs-comment">//     return externalFunc();</span>
    <span class="hljs-comment">// }</span>

    <span class="hljs-comment">// State variables</span>
    <span class="hljs-keyword">string</span> <span class="hljs-keyword">private</span> privateVar <span class="hljs-operator">=</span> <span class="hljs-string">"my private variable"</span>;
    <span class="hljs-keyword">string</span> <span class="hljs-keyword">internal</span> internalVar <span class="hljs-operator">=</span> <span class="hljs-string">"my internal variable"</span>;
    <span class="hljs-keyword">string</span> <span class="hljs-keyword">public</span> publicVar <span class="hljs-operator">=</span> <span class="hljs-string">"my public variable"</span>;
    <span class="hljs-comment">// State variables cannot be external so this code won&#x27;t compile.</span>
    <span class="hljs-comment">// string external externalVar = "my external variable";</span>
}

<span class="hljs-class"><span class="hljs-keyword">contract</span> <span class="hljs-title">Child</span> <span class="hljs-keyword">is</span> <span class="hljs-title">Base</span> </span>{
    <span class="hljs-comment">// Inherited contracts do not have access to private functions</span>
    <span class="hljs-comment">// and state variables.</span>
    <span class="hljs-comment">// function testPrivateFunc() public pure returns (string memory) {</span>
    <span class="hljs-comment">//     return privateFunc();</span>
    <span class="hljs-comment">// }</span>

    <span class="hljs-comment">// Internal function call be called inside child contracts.</span>
    <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">testInternalFunc</span>(<span class="hljs-params"></span>) <span class="hljs-title"><span class="hljs-keyword">public</span></span> <span class="hljs-title"><span class="hljs-keyword">pure</span></span> <span class="hljs-title"><span class="hljs-keyword">override</span></span> <span class="hljs-title"><span class="hljs-keyword">returns</span></span> (<span class="hljs-params"><span class="hljs-keyword">string</span> <span class="hljs-keyword">memory</span></span>) </span>{
        <span class="hljs-keyword">return</span> internalFunc();
    }
}
</code></pre>
`

export default html
