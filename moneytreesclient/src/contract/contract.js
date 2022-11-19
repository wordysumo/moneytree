import { Client, ContractCallQuery, Hbar, ContractExecuteTransaction} from "@hashgraph/sdk";

const myAccountId = "0.0.48924104";
const myPrivateKey = "2cb3bd6ba377220406a5ae1151a9390728e37cbd518655ed6b5228de4ed7b03d";
export const contractId = "0.0.48927983"

export const client = Client.forTestnet();
client.setOperator(myAccountId, myPrivateKey);


export async function getPlantData() {
    const contractQueryGrowth = await new ContractCallQuery()
    .setGas(100000)
    .setContractId(contractId)
    .setFunction("getPlantGrowth")
    .setQueryPayment(new Hbar(2));
    const getPlantGrowth = await contractQueryGrowth.execute(client);
    const growthResponse = getPlantGrowth.getUint32(0)
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
    const feedResponse = getPlantFeed.getUint32(0)
    //Log the message
    console.log("Your plant fed: " + feedResponse);

    return {watered: wateredResponse, growthStage: growthResponse, feedAmount: feedResponse}
}

export async function createNewPlant() {
    const contractExecTx = await new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(1000000)
    .setFunction("createPlant");
    const submitExecTx = await contractExecTx.execute(client);
    const receipt = await submitExecTx.getReceipt(client);
    console.log("The transaction status is " +receipt.status.toString());
}

export async function getBalance() {
    const contractQueryBalance = await new ContractCallQuery()
    .setGas(100000)
    .setContractId(contractId)
    .setFunction("balanceOf")
    .setQueryPayment(new Hbar(2));
    const getBalance = await contractQueryBalance.execute(client);
    const balanceResponse = getBalance.getUint32(0);
    return balanceResponse;
    //Log the message
}

export async function hasPlant() {
    const contractQueryGrowth = await new ContractCallQuery()
    .setGas(100000)
    .setContractId(contractId)
    .setFunction("hasPlant")
    .setQueryPayment(new Hbar(2));
    const plantExists = await contractQueryGrowth.execute(client);
    const response = plantExists.getBool(0)
    return response
}

export async function waterPlant() {
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

export async function canWaterPlant() {
    const contractQueryWater = await new ContractCallQuery()
    .setGas(100000)
    .setContractId(contractId)
    .setFunction("canWater")
    .setQueryPayment(new Hbar(2));
    const canWater = await contractQueryWater.execute(client);
    const response = canWater.getBool(0)
    return response
}

export async function feedPlant() {
    const contractExecTx = await new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(100000)
    .setFunction("feedPlant");
    const submitExecTx = await contractExecTx.execute(client);
    const receipt = await submitExecTx.getReceipt(client);
    console.log("The transaction status is " +receipt.status.toString());
}

