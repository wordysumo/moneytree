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

async function main() {
    
    const {client, newContractId} = await deployContract()
    console.log("contract ID: " + newContractId)
}

main();