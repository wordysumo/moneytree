pragma solidity >=0.8.0;

import "./leaves.sol";

contract Moneytrees is Leaves {
    struct Plant {
        uint id;
        bool watered;
        uint growthStage;
        uint feedAmount;
        uint lastWatered;
    }
    mapping (address => uint) ownerPlant;
    mapping(address => uint) cooldowns;

    modifier ownsPlant() {
        require(ownerPlant[msg.sender] != 0, "User must have a plant");
        _;
    }

    Plant[] plants;
    function createPlant() public returns (bool success) {
        require(ownerPlant[msg.sender] == 0,"User already has plant");
        uint newId = plants.length + 1;
        Plant memory newPlant = Plant(newId,false,0,0,0);
        plants.push(newPlant);
        ownerPlant[msg.sender] = newId;
        return true;
    }
    function hasPlant() public view returns (bool) {
        return ownerPlant[msg.sender] != 0;
    }
    function waterPlant() public ownsPlant returns (bool success) {
        require(block.timestamp >= cooldowns[msg.sender]);
        cooldowns[msg.sender] = block.timestamp + 1 days;
        uint id = ownerPlant[msg.sender];
        Plant storage currentPlant = plants[id - 1];
        currentPlant.watered = true;
        currentPlant.lastWatered = block.timestamp;
        getDailyCoins();
        return true;
    }
    function canWater() public view ownsPlant returns (bool) {
        return cooldowns[msg.sender] <= block.timestamp;
    }
    function getCooldown() public view ownsPlant returns (uint) {
        return cooldowns[msg.sender];
    }
    function feedPlant() public ownsPlant returns (bool success) {
        spend(msg.sender, 1);
        uint id = ownerPlant[msg.sender];
        Plant storage currentPlant = plants[id - 1];
        currentPlant.feedAmount += 1;
        if (currentPlant.feedAmount == (currentPlant.growthStage + 1) * 5) {
            currentPlant.growthStage += 1;
            if (currentPlant.growthStage > 4) {
                currentPlant.growthStage = 4;
            }
            currentPlant.feedAmount = 0;
        }
        return true;
    }
    function resetPlant() public ownsPlant returns (bool success) {
        uint id = ownerPlant[msg.sender];
        Plant storage currentPlant = plants[id - 1];
        currentPlant.growthStage = 0;
        currentPlant.feedAmount = 0;
        currentPlant.lastWatered = 0;
        currentPlant.watered = false;
        return true;
    }
    function getPlantWatered() public view returns (bool) {
        return plants[ownerPlant[msg.sender] - 1].watered;
    }
    function getPlantGrowth() public view returns (uint) {
        return plants[ownerPlant[msg.sender] - 1].growthStage;
    }
    function getPlantFeed() public view returns (uint) {
        return plants[ownerPlant[msg.sender] - 1].feedAmount;
    }
    function getPlantLastWatered() public view returns (uint) {
        return plants[ownerPlant[msg.sender] - 1].lastWatered;
    }
}