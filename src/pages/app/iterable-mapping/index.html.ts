// metadata
export const version = "0.8.10"
export const title = "Iterable Mapping 可迭代映射"
export const description = "Iterable Mapping in Solidity"

const html = `<p>映射本身是无法遍历的，即无法枚举所有的键。不过，可以在它们之上实现一个数据结构来进行迭代。 以下是一个如何创建可迭代 <code>mapping</code> 的示例。</p>
<pre><code class="language-solidity"><span class="hljs-comment">// SPDX-License-Identifier: MIT</span>
<span class="hljs-meta"><span class="hljs-keyword">pragma</span> <span class="hljs-keyword">solidity</span> ^0.8.10;</span>

<span class="hljs-class"><span class="hljs-keyword">library</span> <span class="hljs-title">IterableMapping</span> </span>{
    <span class="hljs-comment">// Iterable mapping from address to uint;</span>
    <span class="hljs-keyword">struct</span> <span class="hljs-title">Map</span> {
        <span class="hljs-keyword">address</span>[] keys;
        <span class="hljs-keyword">mapping</span>(<span class="hljs-keyword">address</span> <span class="hljs-operator">=</span><span class="hljs-operator">&gt;</span> <span class="hljs-keyword">uint</span>) values;
        <span class="hljs-keyword">mapping</span>(<span class="hljs-keyword">address</span> <span class="hljs-operator">=</span><span class="hljs-operator">&gt;</span> <span class="hljs-keyword">uint</span>) indexOf;
        <span class="hljs-keyword">mapping</span>(<span class="hljs-keyword">address</span> <span class="hljs-operator">=</span><span class="hljs-operator">&gt;</span> <span class="hljs-keyword">bool</span>) inserted;
    }

    <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">get</span>(<span class="hljs-params">Map <span class="hljs-keyword">storage</span> map, <span class="hljs-keyword">address</span> key</span>) <span class="hljs-title"><span class="hljs-keyword">public</span></span> <span class="hljs-title"><span class="hljs-keyword">view</span></span> <span class="hljs-title"><span class="hljs-keyword">returns</span></span> (<span class="hljs-params"><span class="hljs-keyword">uint</span></span>) </span>{
        <span class="hljs-keyword">return</span> map.values[key];
    }

    <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">getKeyAtIndex</span>(<span class="hljs-params">Map <span class="hljs-keyword">storage</span> map, <span class="hljs-keyword">uint</span> index</span>) <span class="hljs-title"><span class="hljs-keyword">public</span></span> <span class="hljs-title"><span class="hljs-keyword">view</span></span> <span class="hljs-title"><span class="hljs-keyword">returns</span></span> (<span class="hljs-params"><span class="hljs-keyword">address</span></span>) </span>{
        <span class="hljs-keyword">return</span> map.keys[index];
    }

    <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">size</span>(<span class="hljs-params">Map <span class="hljs-keyword">storage</span> map</span>) <span class="hljs-title"><span class="hljs-keyword">public</span></span> <span class="hljs-title"><span class="hljs-keyword">view</span></span> <span class="hljs-title"><span class="hljs-keyword">returns</span></span> (<span class="hljs-params"><span class="hljs-keyword">uint</span></span>) </span>{
        <span class="hljs-keyword">return</span> map.keys.<span class="hljs-built_in">length</span>;
    }

    <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">set</span>(<span class="hljs-params">
        Map <span class="hljs-keyword">storage</span> map,
        <span class="hljs-keyword">address</span> key,
        <span class="hljs-keyword">uint</span> val
    </span>) <span class="hljs-title"><span class="hljs-keyword">public</span></span> </span>{
        <span class="hljs-keyword">if</span> (map.inserted[key]) {
            map.values[key] <span class="hljs-operator">=</span> val;
        } <span class="hljs-keyword">else</span> {
            map.inserted[key] <span class="hljs-operator">=</span> <span class="hljs-literal">true</span>;
            map.values[key] <span class="hljs-operator">=</span> val;
            map.indexOf[key] <span class="hljs-operator">=</span> map.keys.<span class="hljs-built_in">length</span>;
            map.keys.<span class="hljs-built_in">push</span>(key);
        }
    }

    <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">remove</span>(<span class="hljs-params">Map <span class="hljs-keyword">storage</span> map, <span class="hljs-keyword">address</span> key</span>) <span class="hljs-title"><span class="hljs-keyword">public</span></span> </span>{
        <span class="hljs-keyword">if</span> (<span class="hljs-operator">!</span>map.inserted[key]) {
            <span class="hljs-keyword">return</span>;
        }

        <span class="hljs-keyword">delete</span> map.inserted[key];
        <span class="hljs-keyword">delete</span> map.values[key];

        <span class="hljs-keyword">uint</span> index <span class="hljs-operator">=</span> map.indexOf[key];
        <span class="hljs-keyword">uint</span> lastIndex <span class="hljs-operator">=</span> map.keys.<span class="hljs-built_in">length</span> <span class="hljs-operator">-</span> <span class="hljs-number">1</span>;
        <span class="hljs-keyword">address</span> lastKey <span class="hljs-operator">=</span> map.keys[lastIndex];

        map.indexOf[lastKey] <span class="hljs-operator">=</span> index;
        <span class="hljs-keyword">delete</span> map.indexOf[key];

        map.keys[index] <span class="hljs-operator">=</span> lastKey;
        map.keys.<span class="hljs-built_in">pop</span>();
    }
}

<span class="hljs-class"><span class="hljs-keyword">contract</span> <span class="hljs-title">TestIterableMap</span> </span>{
    <span class="hljs-keyword">using</span> <span class="hljs-title">IterableMapping</span> <span class="hljs-title"><span class="hljs-keyword">for</span></span> <span class="hljs-title">IterableMapping</span>.<span class="hljs-title">Map</span>;

    IterableMapping.Map <span class="hljs-keyword">private</span> map;

    <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">testIterableMap</span>(<span class="hljs-params"></span>) <span class="hljs-title"><span class="hljs-keyword">public</span></span> </span>{
        map.set(<span class="hljs-keyword">address</span>(<span class="hljs-number">0</span>), <span class="hljs-number">0</span>);
        map.set(<span class="hljs-keyword">address</span>(<span class="hljs-number">1</span>), <span class="hljs-number">100</span>);
        map.set(<span class="hljs-keyword">address</span>(<span class="hljs-number">2</span>), <span class="hljs-number">200</span>); <span class="hljs-comment">// insert</span>
        map.set(<span class="hljs-keyword">address</span>(<span class="hljs-number">2</span>), <span class="hljs-number">200</span>); <span class="hljs-comment">// update</span>
        map.set(<span class="hljs-keyword">address</span>(<span class="hljs-number">3</span>), <span class="hljs-number">300</span>);

        <span class="hljs-keyword">for</span> (<span class="hljs-keyword">uint</span> i <span class="hljs-operator">=</span> <span class="hljs-number">0</span>; i <span class="hljs-operator">&lt;</span> map.size(); i<span class="hljs-operator">+</span><span class="hljs-operator">+</span>) {
            <span class="hljs-keyword">address</span> key <span class="hljs-operator">=</span> map.getKeyAtIndex(i);

            <span class="hljs-built_in">assert</span>(map.get(key) <span class="hljs-operator">=</span><span class="hljs-operator">=</span> i <span class="hljs-operator">*</span> <span class="hljs-number">100</span>);
        }

        map.remove(<span class="hljs-keyword">address</span>(<span class="hljs-number">1</span>));

        <span class="hljs-comment">// keys = [address(0), address(3), address(2)]</span>
        <span class="hljs-built_in">assert</span>(map.size() <span class="hljs-operator">=</span><span class="hljs-operator">=</span> <span class="hljs-number">3</span>);
        <span class="hljs-built_in">assert</span>(map.getKeyAtIndex(<span class="hljs-number">0</span>) <span class="hljs-operator">=</span><span class="hljs-operator">=</span> <span class="hljs-keyword">address</span>(<span class="hljs-number">0</span>));
        <span class="hljs-built_in">assert</span>(map.getKeyAtIndex(<span class="hljs-number">1</span>) <span class="hljs-operator">=</span><span class="hljs-operator">=</span> <span class="hljs-keyword">address</span>(<span class="hljs-number">3</span>));
        <span class="hljs-built_in">assert</span>(map.getKeyAtIndex(<span class="hljs-number">2</span>) <span class="hljs-operator">=</span><span class="hljs-operator">=</span> <span class="hljs-keyword">address</span>(<span class="hljs-number">2</span>));
    }
}
</code></pre>
`

export default html
