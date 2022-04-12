// metadata
export const version = "0.8.10"
export const title = "Immutable 不可变量"
export const description = "Immutable variables"

const html = `<p>Immutable variables are like constants. Values of immutable variables can be set inside the constructor but cannot be modified afterwards.</p>
<p>Immutable 修饰的变量是在部署的时候确定变量的值, 它在构造函数中赋值一次之后,就不在改变, 这是一个运行时赋值, 就可以解除之前 constant 不支持使用运行时状态赋值的限制。</p>
<p>Immutable 不可变量同样不会占用状态变量存储空间, 在部署时,变量的值会被追加的运行时字节码中, 因此它比使用状态变量便宜的多, 同样带来了更多的安全性(确保了这个值无法在修改)。</p>
<pre><code class="language-solidity"><span class="hljs-comment">// SPDX-License-Identifier: MIT</span>
<span class="hljs-meta"><span class="hljs-keyword">pragma</span> <span class="hljs-keyword">solidity</span> ^0.8.10;</span>

<span class="hljs-class"><span class="hljs-keyword">contract</span> <span class="hljs-title">Immutable</span> </span>{
    <span class="hljs-comment">// coding convention to uppercase constant variables</span>
    <span class="hljs-keyword">address</span> <span class="hljs-keyword">public</span> <span class="hljs-keyword">immutable</span> MY_ADDRESS;
    <span class="hljs-keyword">uint</span> <span class="hljs-keyword">public</span> <span class="hljs-keyword">immutable</span> MY_UINT;

    <span class="hljs-function"><span class="hljs-keyword">constructor</span>(<span class="hljs-params"><span class="hljs-keyword">uint</span> _myUint</span>) </span>{
        MY_ADDRESS <span class="hljs-operator">=</span> <span class="hljs-built_in">msg</span>.<span class="hljs-built_in">sender</span>;
        MY_UINT <span class="hljs-operator">=</span> _myUint;
    }
}
</code></pre>
`

export default html
