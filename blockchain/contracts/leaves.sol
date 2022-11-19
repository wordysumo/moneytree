pragma solidity >=0.8.0;

contract Leaves {
    mapping(address => uint) private balances;

    function name() public pure returns (string memory) {
        return "Leaves";
    }
    function balanceOf(address _user) public view returns (uint) {
        return balances[msg.sender];
    }
    function transferTo(address _to, uint _value) public returns (bool success) {
        require(balances[msg.sender] >= _value);
        balances[msg.sender] -= _value;
        balances[_to] += _value;
    }
}