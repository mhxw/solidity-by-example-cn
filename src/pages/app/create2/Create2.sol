// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

//
contract Factory {
    // 返回新部署合约的地址
    function deploy(
        address _owner,
        uint _foo,
        bytes32 _salt
    ) public payable returns (address) {
        // 这种语法是一种较新的方式，无需汇编就可以调用 create2 ，你只需要传入 salt
        // https://docs.soliditylang.org/en/latest/control-structures.html#salted-contract-creations-create2
        return address(new TestContract{salt: _salt}(_owner, _foo));
    }
}

// 这是使用汇编的旧方法
contract FactoryAssembly {
    event Deployed(address addr, uint salt);

    // 1. 获取被部署合约的 bytecode（新合约编译后的机器码）
    // 注意: _owner 和 _foo TestContract 合约的构造函数的参数
    function getBytecode(address _owner, uint _foo) public pure returns (bytes memory) {
        bytes memory bytecode = type(TestContract).creationCode;
        // 通过abi.encode 将构造函数的参数一起打包进来
        return abi.encodePacked(bytecode, abi.encode(_owner, _foo));
    }

    // 2. 计算被部署合约的地址
    // 注意: _salt 是用于创建被部署合约地址的随机数
    function getAddress(bytes memory bytecode, uint _salt)
        public
        view
        returns (address)
    {
        // 计算地址用到4个参数：1：固定的字符串，2：当前工厂合约的地址，3：salt bytes32类型，4：新合约源代码的机器码
        bytes32 hash = keccak256(
            abi.encodePacked(bytes1(0xff), address(this), _salt, keccak256(bytecode))
        );

        // 注意: 将最后 20 字节的哈希转换为地址
        return address(uint160(uint(hash)));
    }

    // 3. 部署合约
    // 注意:
    // 检查函数中事件日志：Deployed，其中包含新部署的 TestContract 合约的地址
    // 日志中的地址应该等于上面计算后的地址
    function deploy(bytes memory bytecode, uint _salt) public payable {
        address addr;

        /*
        注意: 如何使用 create2

        create2(v, p, n, s)
        create new contract with code at memory p to p + n
        and send v wei
        and return the new address
        where new address = first 20 bytes of keccak256(0xff + address(this) + s + keccak256(mem[p…(p+n)))
              s = big-endian 256-bit value
        */
        assembly {
            addr := create2(
                callvalue(), // wei sent with current call
                // Actual code starts after skipping the first 32 bytes
                add(bytecode, 0x20),
                mload(bytecode), // 加载 加载前32个字节中包含的代码大小
                _salt // Salt 通过函数参数传递进来
            )

            if iszero(extcodesize(addr)) {
                revert(0, 0)
            }
        }

        emit Deployed(addr, _salt);
    }
}

contract TestContract {
    address public owner;
    uint public foo;

    constructor(address _owner, uint _foo) payable {
        owner = _owner;
        foo = _foo;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}
