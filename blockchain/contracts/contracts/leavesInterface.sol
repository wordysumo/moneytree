pragma solidity >=0.8.0;

interface LeavesInterface {
    function name() external returns (string memory);
    function balanceOf() external returns (uint);
    function transferTo(address _to, uint _value) external returns (bool success);
    function getDailyCoins() external returns (bool success);
    function spend(address _user, uint _value) external returns (bool success);
}