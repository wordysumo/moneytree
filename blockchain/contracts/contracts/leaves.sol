pragma solidity >=0.8.0;

contract Leaves {
    mapping(address => uint) private balances;

    function name() public pure returns (string memory) {
        return "Leaves";
    }
    function balanceOf() public view returns (uint) {
        return balances[msg.sender];
    }
    function transferTo(address _to, uint32 _value) public returns (bool success) {
        require(balances[msg.sender] >= _value);
        balances[msg.sender] -= _value;
        balances[_to] += _value;
        return true;
    }
    function getDailyCoins() internal returns (bool success) {
        balances[msg.sender] += 2;
        return true;
    }
    function spend(address _user, uint _value) internal returns (bool success) {
        require(balances[_user] >= _value);
        balances[_user] -= _value;
        return true;
    }
    function getAddress() public view returns (address) {
        return msg.sender;
    } 
    function buy() public payable returns (bool success) {
        require(msg.value >= 0);
        balances[msg.sender] += 1;
        return true;
    }
    function donate() public returns (bool success) {
        require(balances[msg.sender] >= 1);
        balances[msg.sender] -= 1;
        return true;
    }
}