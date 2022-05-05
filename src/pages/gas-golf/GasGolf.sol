// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

// gas 节约
contract GasGolf {
    // 初始 - 50908 gas
    // 使用 calldata - 49163 gas
    // 将状态变量赋值到内存中的变量 - 48952 gas
    // short circuit 短路 - 48634 gas
    // loop increments 循环增量 - 48244 gas
    // cache array length 缓存数组长度 - 48209 gas
    // 将数组元素赋值到内存中 - 48047 gas

    uint public total;

    // 刚开始时候的函数 - 没有进行gas优化
    // function sumIfEvenAndLessThan99(uint[] memory nums) external {
    //     for (uint i = 0; i < nums.length; i += 1) {
    //          // 这里2个布尔值赋值可以删掉，删掉之后。如果if中前面条件不满足，后面一个条件就不需要判断，这样便可以节省部分gas。
    //         bool isEven = nums[i] % 2 == 0;
    //         bool isLessThan99 = nums[i] < 99;
    //         if (isEven && isLessThan99) {
    //             // 每次循环修改状态变量是比较消耗gas，我们可以把这个状态变量拿到循环体外，见下面优化后的函数
    //             total += nums[i];
    //         }
    //     }
    // }

    // gas优化后的函数
    // [1, 2, 3, 4, 5, 100]
    function sumIfEvenAndLessThan99(uint[] calldata nums) external {
        // 首先把状态变量拷贝到内存中
        uint _total = total;
        // 缓存数组长度
        uint len = nums.length;

        for (uint i = 0; i < len; ++i) {
            //
            uint num = nums[i];
            if (num % 2 == 0 && num < 99) {
                // 此处每次累加修改的是内存中的变量
                _total += num;
            }
        }

        total = _total;
    }
}
