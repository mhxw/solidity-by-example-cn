// metadata
export const version = "0.8.10"
export const title = "Gas 优化技巧"
export const description = "Some gas saving techniques"

const html = `<p>一些节约gas技巧。</p>
<ul>
<li>将输入变量的 <code>memory</code> 存储位置改为 <code>calldata</code></li>
<li>由加载状态变量改为内存变量</li>
<li>循环小技巧：将 <code>i++</code> 改为 <code>++i</code></li>
<li>Caching array elements 缓存数组元素</li>
<li>Short circuit 短路</li>
</ul>
<pre><code class="language-solidity"><span class="hljs-comment">// SPDX-License-Identifier: MIT</span>
<span class="hljs-meta"><span class="hljs-keyword">pragma</span> <span class="hljs-keyword">solidity</span> ^0.8.10;</span>

<span class="hljs-comment">// gas 节约</span>
<span class="hljs-class"><span class="hljs-keyword">contract</span> <span class="hljs-title">GasGolf</span> </span>{
    <span class="hljs-comment">// 初始 - 50908 gas</span>
    <span class="hljs-comment">// 使用 calldata - 49163 gas</span>
    <span class="hljs-comment">// 将状态变量赋值到内存中的变量 - 48952 gas</span>
    <span class="hljs-comment">// short circuit 短路 - 48634 gas</span>
    <span class="hljs-comment">// loop increments 循环增量 - 48244 gas</span>
    <span class="hljs-comment">// cache array length 缓存数组长度 - 48209 gas</span>
    <span class="hljs-comment">// 将数组元素赋值到内存中 - 48047 gas</span>

    <span class="hljs-keyword">uint</span> <span class="hljs-keyword">public</span> total;

    <span class="hljs-comment">// 刚开始时候的函数 - 没有进行gas优化</span>
    <span class="hljs-comment">// function sumIfEvenAndLessThan99(uint[] memory nums) external {</span>
    <span class="hljs-comment">//     for (uint i = 0; i &lt; nums.length; i += 1) {</span>
    <span class="hljs-comment">//          // 这里2个布尔值赋值可以删掉，删掉之后。如果if中前面条件不满足，后面一个条件就不需要判断，这样便可以节省部分gas。</span>
    <span class="hljs-comment">//         bool isEven = nums[i] % 2 == 0;</span>
    <span class="hljs-comment">//         bool isLessThan99 = nums[i] &lt; 99;</span>
    <span class="hljs-comment">//         if (isEven &amp;&amp; isLessThan99) {</span>
    <span class="hljs-comment">//             // 每次循环修改状态变量是比较消耗gas，我们可以把这个状态变量拿到循环体外，见下面优化后的函数</span>
    <span class="hljs-comment">//             total += nums[i];</span>
    <span class="hljs-comment">//         }</span>
    <span class="hljs-comment">//     }</span>
    <span class="hljs-comment">// }</span>

    <span class="hljs-comment">// gas优化后的函数</span>
    <span class="hljs-comment">// [1, 2, 3, 4, 5, 100]</span>
    <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">sumIfEvenAndLessThan99</span>(<span class="hljs-params"><span class="hljs-keyword">uint</span>[] <span class="hljs-keyword">calldata</span> nums</span>) <span class="hljs-title"><span class="hljs-keyword">external</span></span> </span>{
        <span class="hljs-comment">// 首先把状态变量拷贝到内存中</span>
        <span class="hljs-keyword">uint</span> _total <span class="hljs-operator">=</span> total;
        <span class="hljs-comment">// 缓存数组长度</span>
        <span class="hljs-keyword">uint</span> len <span class="hljs-operator">=</span> nums.<span class="hljs-built_in">length</span>;

        <span class="hljs-keyword">for</span> (<span class="hljs-keyword">uint</span> i <span class="hljs-operator">=</span> <span class="hljs-number">0</span>; i <span class="hljs-operator">&lt;</span> len; <span class="hljs-operator">+</span><span class="hljs-operator">+</span>i) {
            <span class="hljs-comment">//</span>
            <span class="hljs-keyword">uint</span> num <span class="hljs-operator">=</span> nums[i];
            <span class="hljs-keyword">if</span> (num <span class="hljs-operator">%</span> <span class="hljs-number">2</span> <span class="hljs-operator">=</span><span class="hljs-operator">=</span> <span class="hljs-number">0</span> <span class="hljs-operator">&amp;</span><span class="hljs-operator">&amp;</span> num <span class="hljs-operator">&lt;</span> <span class="hljs-number">99</span>) {
                <span class="hljs-comment">// 此处每次累加修改的是内存中的变量</span>
                _total <span class="hljs-operator">+</span><span class="hljs-operator">=</span> num;
            }
        }

        total <span class="hljs-operator">=</span> _total;
    }
}
</code></pre>
`

export default html
