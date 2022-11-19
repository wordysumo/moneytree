const { Client, FileCreateTransaction, ContractCreateTransaction, ContractCallQuery, Hbar, ContractExecuteTransaction, ContractCreateFlow
 } = require("@hashgraph/sdk");
require("dotenv").config();

function init() {
    //Grab your Hedera testnet account ID and private key from your .env file
    const myAccountId = process.env.MY_ACCOUNT_ID;
    const myPrivateKey = process.env.MY_PRIVATE_KEY;

    if (myAccountId == null || myPrivateKey == null ) {
        throw new Error("Environment variables myAccountId and myPrivateKey must be present");
    }

    const client = Client.forTestnet();
    client.setOperator(myAccountId, myPrivateKey);
    return client
}

async function deployContract() {
    const client = init()

    let leaves = require("./Moneytrees.json");
    const bytecode = leaves.bytecode;
    
    const contractCreate = new ContractCreateFlow()
    .setGas(100000)
    .setBytecode(bytecode);

    const txResponse = await contractCreate.execute(client);
    const receipt = await txResponse.getReceipt(client);
    const newContractId = receipt.contractId;

    return {client, newContractId}
}

async function getPlantData(client, contractId) {
    const contractQueryGrowth = await new ContractCallQuery()
    .setGas(100000)
    .setContractId(contractId)
    .setFunction("getPlantGrowth")
    .setQueryPayment(new Hbar(2));
    const getPlantGrowth = await contractQueryGrowth.execute(client);
    const growthResponse = getPlantGrowth.getUint256(0)
    //Log the message
    console.log("Your plant growth: " + growthResponse);

    const contractQueryWatered = await new ContractCallQuery()
    .setGas(100000)
    .setContractId(contractId)
    .setFunction("getPlantWatered")
    .setQueryPayment(new Hbar(2));
    const getPlantWater = await contractQueryWatered.execute(client);
    const wateredResponse = getPlantWater.getBool(0)
    //Log the message
    console.log("Your plant watered today: " + wateredResponse);

    const contractQueryFeed = await new ContractCallQuery()
    .setGas(100000)
    .setContractId(contractId)
    .setFunction("getPlantFeed")
    .setQueryPayment(new Hbar(2));
    const getPlantFeed = await contractQueryFeed.execute(client);
    const feedResponse = getPlantFeed.getUint256(0)
    //Log the message
    console.log("Your plant fed: " + feedResponse);

    return {watered: wateredResponse, growthStage: growthResponse, feedAmount: feedResponse}
}

async function createNewPlant(client, contractId) {
    const contractExecTx = await new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(1000000)
    .setFunction("createPlant");
    const submitExecTx = await contractExecTx.execute(client);
    const receipt = await submitExecTx.getReceipt(client);
    console.log("The transaction status is " +receipt.status.toString());
}

async function waterPlant(client, contractId) {
    try {
    const contractExecTx = await new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(100000)
    .setFunction("waterPlant");
    const submitExecTx = await contractExecTx.execute(client);
    const receipt = await submitExecTx.getReceipt(client);
    console.log("The transaction status is " +receipt.status.toString());
    } catch (err) {
        console.log("already watered today")
    }
}

async function feedPlant(client, contractId) {
    const contractExecTx = await new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(100000)
    .setFunction("feedPlant");
    const submitExecTx = await contractExecTx.execute(client);
    const receipt = await submitExecTx.getReceipt(client);
    console.log("The transaction status is " +receipt.status.toString());
}

async function main() {
    
    const {client, newContractId} = await deployContract()

    await createNewPlant(client, newContractId)
    setInterval(() => {
        console.log("new run")
        waterPlant(client, newContractId)
        getPlantData(client, newContractId)
    },10000)

    // await feedPlant(client, newContractId)
    // const contractQuery = await new ContractCallQuery()
    // .setGas(100000)
    // .setContractId(newContractId)
    // .setFunction("balanceOf" )
    // .setQueryPayment(new Hbar(2));
    // const getMessage = await contractQuery.execute(client);
    // const message = getMessage.getInt128(0);
    // //Log the message
    // console.log("Your balance: " + message);

    // await getPlantData(client, newContractId)
}

main();