// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract Array {
    // 初始化数组的几种方式
    uint[] public arr;
    uint[] public arr2 = [1, 2, 3];
    // Fixed sized array, all elements initialize to 0
    uint[10] public myFixedSizeArr;

    function get(uint i) public view returns (uint) {
        return arr[i];
    }

    // Solidity 可以返回整个数组。
    // 但是对于长度可以无限增长的数组，
    // 应该避免使用这个函数
    function getArr() public view returns (uint[] memory) {
        return arr;
    }

    function push(uint i) public {
        // 向数组尾部推入数据
        // 注意：只有动态数组才可这样操作
        // This will increase the array length by 1.
        arr.push(i);
    }

    function pop() public {
        // 删除数组中最后一个元素
        // This will decrease the array length by 1
        arr.pop();
    }

    function getLength() public view returns (uint) {
        // 获取数组长度
        return arr.length;
    }

    function remove(uint index) public {
        // 删除不会改变数组长度
        // 它将索引处的值重置为其默认值，
        // 在当前情况下，uint默认为0
        delete arr[index];
    }

    function examples() external {
        // 在内存中创建数组，只能创建固定数组；并且这种情况不能push或pop
        uint[] memory a = new uint[](5);
    }
}
