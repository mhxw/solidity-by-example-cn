// metadata
export const version = "0.8.10"
export const title = "使用 Create2 预计算合约地址"
export const description = "Precompute contract address with create2"

const html = `<p><code>create2</code> 是以太坊在 2019 年 2 月 28 号的君士坦丁堡（Constantinople）硬分叉中引入 的一个新操作码。</p>
<p>使用 <code>create2</code> 方法可以在部署合约之前就可以直接计算出新部署的合约地址。</p>
<p>new 和 create2 部署新合约的不同点：</p>
<ul>
<li><code>new</code>方法是：在工厂合约里部署新合约，部署合约的地址是工厂合约的地址和工厂合约对外发出交易的 nonce 值计算出来的新合约地址。</li>
<li><code>create2</code>方法是：工厂合约地址加盐 salt 再加上被部署合约的 bytecode 机器码去计算未来新部署合约的地址。因此新部署合约的地址在部署之前就可以预测出来。</li>
</ul>
<p>注意点：</p>
<blockquote>
<p>salt 不变的情况下，新部署的合约的地址就不会变化。因此，相同的 salt 在这个合约也只能使用一次，否则就会发生重复部署合约的错误。
除非新合约是具有自毁功能的。 新合约如果自毁掉之后，你还可以使用相同的 salt 再把新合约部署到原来的地址上。</p>
</blockquote>
<p>因此，一个合约部署之后再自毁然后重生，这种情况是正常的。
你可以使用 <code>create2</code> 操作码在同一地址多次部署智能合约。这是因为 <code>create2</code> 检查目标地址的 nonce 是否为零（它会在构造函数的开头将其设置为 1）。在这种情况下，<code>selfdestruct()</code> 函数每次都会重置地址的 nonce。因此，如果再次使用相同的参数调用 <code>create2</code> 创建合约，对 nonce 的检查是可以通过的。</p>
<pre><code class="language-solidity"><span class="hljs-comment">// SPDX-License-Identifier: MIT</span>
<span class="hljs-meta"><span class="hljs-keyword">pragma</span> <span class="hljs-keyword">solidity</span> ^0.8.10;</span>

<span class="hljs-comment">//</span>
<span class="hljs-class"><span class="hljs-keyword">contract</span> <span class="hljs-title">Factory</span> </span>{
    <span class="hljs-comment">// 返回新部署合约的地址</span>
    <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">deploy</span>(<span class="hljs-params">
        <span class="hljs-keyword">address</span> _owner,
        <span class="hljs-keyword">uint</span> _foo,
        <span class="hljs-keyword">bytes32</span> _salt
    </span>) <span class="hljs-title"><span class="hljs-keyword">public</span></span> <span class="hljs-title"><span class="hljs-keyword">payable</span></span> <span class="hljs-title"><span class="hljs-keyword">returns</span></span> (<span class="hljs-params"><span class="hljs-keyword">address</span></span>) </span>{
        <span class="hljs-comment">// 这种语法是一种较新的方式，无需汇编就可以调用 create2 ，你只需要传入 salt</span>
        <span class="hljs-comment">// https://docs.soliditylang.org/en/latest/control-structures.html#salted-contract-creations-create2</span>
        <span class="hljs-keyword">return</span> <span class="hljs-keyword">address</span>(<span class="hljs-keyword">new</span> TestContract{<span class="hljs-built_in">salt</span>: _salt}(_owner, _foo));
    }
}

<span class="hljs-comment">// 这是使用汇编的旧方法</span>
<span class="hljs-class"><span class="hljs-keyword">contract</span> <span class="hljs-title">FactoryAssembly</span> </span>{
    <span class="hljs-function"><span class="hljs-keyword">event</span> <span class="hljs-title">Deployed</span>(<span class="hljs-params"><span class="hljs-keyword">address</span> addr, <span class="hljs-keyword">uint</span> salt</span>)</span>;

    <span class="hljs-comment">// 1. 获取被部署合约的 bytecode（新合约编译后的机器码）</span>
    <span class="hljs-comment">// 注意: _owner 和 _foo TestContract 合约的构造函数的参数</span>
    <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">getBytecode</span>(<span class="hljs-params"><span class="hljs-keyword">address</span> _owner, <span class="hljs-keyword">uint</span> _foo</span>) <span class="hljs-title"><span class="hljs-keyword">public</span></span> <span class="hljs-title"><span class="hljs-keyword">pure</span></span> <span class="hljs-title"><span class="hljs-keyword">returns</span></span> (<span class="hljs-params"><span class="hljs-keyword">bytes</span> <span class="hljs-keyword">memory</span></span>) </span>{
        <span class="hljs-keyword">bytes</span> <span class="hljs-keyword">memory</span> bytecode <span class="hljs-operator">=</span> <span class="hljs-keyword">type</span>(TestContract).<span class="hljs-built_in">creationCode</span>;
        <span class="hljs-comment">// 通过abi.encode 将构造函数的参数一起打包进来</span>
        <span class="hljs-keyword">return</span> <span class="hljs-built_in">abi</span>.<span class="hljs-built_in">encodePacked</span>(bytecode, <span class="hljs-built_in">abi</span>.<span class="hljs-built_in">encode</span>(_owner, _foo));
    }

    <span class="hljs-comment">// 2. 计算被部署合约的地址</span>
    <span class="hljs-comment">// 注意: _salt 是用于创建被部署合约地址的随机数</span>
    <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">getAddress</span>(<span class="hljs-params"><span class="hljs-keyword">bytes</span> <span class="hljs-keyword">memory</span> bytecode, <span class="hljs-keyword">uint</span> _salt</span>)
        <span class="hljs-title"><span class="hljs-keyword">public</span></span>
        <span class="hljs-title"><span class="hljs-keyword">view</span></span>
        <span class="hljs-title"><span class="hljs-keyword">returns</span></span> (<span class="hljs-params"><span class="hljs-keyword">address</span></span>)
    </span>{
        <span class="hljs-comment">// 计算地址用到4个参数：1：固定的字符串，2：当前工厂合约的地址，3：salt bytes32类型，4：新合约源代码的机器码</span>
        <span class="hljs-keyword">bytes32</span> hash <span class="hljs-operator">=</span> <span class="hljs-built_in">keccak256</span>(
            <span class="hljs-built_in">abi</span>.<span class="hljs-built_in">encodePacked</span>(<span class="hljs-keyword">bytes1</span>(<span class="hljs-number">0xff</span>), <span class="hljs-keyword">address</span>(<span class="hljs-built_in">this</span>), _salt, <span class="hljs-built_in">keccak256</span>(bytecode))
        );

        <span class="hljs-comment">// 注意: 将最后 20 字节的哈希转换为地址</span>
        <span class="hljs-keyword">return</span> <span class="hljs-keyword">address</span>(<span class="hljs-keyword">uint160</span>(<span class="hljs-keyword">uint</span>(hash)));
    }

    <span class="hljs-comment">// 3. 部署合约</span>
    <span class="hljs-comment">// 注意:</span>
    <span class="hljs-comment">// 检查函数中事件日志：Deployed，其中包含新部署的 TestContract 合约的地址</span>
    <span class="hljs-comment">// 日志中的地址应该等于上面计算后的地址</span>
    <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">deploy</span>(<span class="hljs-params"><span class="hljs-keyword">bytes</span> <span class="hljs-keyword">memory</span> bytecode, <span class="hljs-keyword">uint</span> _salt</span>) <span class="hljs-title"><span class="hljs-keyword">public</span></span> <span class="hljs-title"><span class="hljs-keyword">payable</span></span> </span>{
        <span class="hljs-keyword">address</span> addr;

        <span class="hljs-comment">/*
        注意: 如何使用 create2

        create2(v, p, n, s)
        create new contract with code at memory p to p + n
        and send v wei
        and return the new address
        where new address = first 20 bytes of keccak256(0xff + address(this) + s + keccak256(mem[p…(p+n)))
              s = big-endian 256-bit value
        */</span>
        <span class="hljs-keyword">assembly</span> {
            addr <span class="hljs-operator">:=</span> <span class="hljs-built_in">create2</span>(
                <span class="hljs-built_in">callvalue</span>(), <span class="hljs-comment">// wei sent with current call</span>
                <span class="hljs-comment">// Actual code starts after skipping the first 32 bytes</span>
                <span class="hljs-built_in">add</span>(bytecode, <span class="hljs-number">0x20</span>),
                <span class="hljs-built_in">mload</span>(bytecode), <span class="hljs-comment">// 加载 加载前32个字节中包含的代码大小</span>
                _salt <span class="hljs-comment">// Salt 通过函数参数传递进来</span>
            )

            <span class="hljs-keyword">if</span> <span class="hljs-built_in">iszero</span>(<span class="hljs-built_in">extcodesize</span>(addr)) {
                <span class="hljs-keyword">revert</span>(<span class="hljs-number">0</span>, <span class="hljs-number">0</span>)
            }
        }

        <span class="hljs-keyword">emit</span> Deployed(addr, _salt);
    }
}

<span class="hljs-class"><span class="hljs-keyword">contract</span> <span class="hljs-title">TestContract</span> </span>{
    <span class="hljs-keyword">address</span> <span class="hljs-keyword">public</span> owner;
    <span class="hljs-keyword">uint</span> <span class="hljs-keyword">public</span> foo;

    <span class="hljs-function"><span class="hljs-keyword">constructor</span>(<span class="hljs-params"><span class="hljs-keyword">address</span> _owner, <span class="hljs-keyword">uint</span> _foo</span>) <span class="hljs-title"><span class="hljs-keyword">payable</span></span> </span>{
        owner <span class="hljs-operator">=</span> _owner;
        foo <span class="hljs-operator">=</span> _foo;
    }

    <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">getBalance</span>(<span class="hljs-params"></span>) <span class="hljs-title"><span class="hljs-keyword">public</span></span> <span class="hljs-title"><span class="hljs-keyword">view</span></span> <span class="hljs-title"><span class="hljs-keyword">returns</span></span> (<span class="hljs-params"><span class="hljs-keyword">uint</span></span>) </span>{
        <span class="hljs-keyword">return</span> <span class="hljs-keyword">address</span>(<span class="hljs-built_in">this</span>).<span class="hljs-built_in">balance</span>;
    }
}
</code></pre>
`

export default html
