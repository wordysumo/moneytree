import * as React from "react";
import { render } from "react-dom";
import { Example } from "./example";
import "./styles.css";
import {getPlantData, waterPlant, createNewPlant, hasPlant, getBalance, canWaterPlant, feedPlant, getCurrentCooldown, resetPlant, transferLeaves, getMyAddress, getHbarBalance, buyLeaves} from "./contract/contract.js";
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';
import { Stack } from "@mui/system";
import Button from '@mui/material/Button';


interface Plant {
    watered: boolean,
    feedAmount: number,
    growthStage: number,
    lastWatered: number,
    id: number
}

const App = () => {
    const [plant, setPlant] = React.useState<Plant | undefined>(undefined)
    const [plantExists, setPlantExists] = React.useState(false)
    const [balance, setBalance] = React.useState(0)
    const [hBalance, setHBalance] = React.useState(0)
    const [canWater, setCanWater] = React.useState(false)
    const [cooldown, setCooldown] = React.useState(0)
    const [myAddress, setMyAddress] = React.useState("")
    React.useEffect(() => {
        async function load() {
            const address = await getMyAddress()
            setMyAddress(address)
            const _hBalance = await getHbarBalance()
            setHBalance(_hBalance)
            const plantExistsRequest = await hasPlant()
            console.log(plantExistsRequest)
            setPlantExists(plantExistsRequest)
            if (plantExistsRequest) {
                await fetchPlantData()
                
            }
            setBalance(await getBalance())
        }
        load()
        
    },[])
    async function fetchPlantData() {
        const newPlant = await getPlantData()
        setPlant(newPlant)
        await updateCanWater()
        console.log(Math.floor(((Date.now() / 1000) - newPlant.lastWatered) / 3600))
        if (Math.floor(((Date.now() / 1000) - newPlant.lastWatered) / 3600) >= 1 && newPlant.lastWatered !== 0) {
            alert("you didn't water your plant and it died")
            await resetPlant()
            const newPlant = await getPlantData()
            setPlant(newPlant)
            await updateCanWater()
        }
    }
    async function createPlant() {
        await createNewPlant()
        setPlantExists(true)
        await fetchPlantData()
    }
    async function water() {
        try {
        await waterPlant()
        }catch(err) {
            console.log(err)
            alert("already watered")
        }
        await fetchPlantData()
        setBalance(await getBalance())
        await updateCanWater()
    }
    async function feed() {
        await feedPlant()
        await fetchPlantData()
        setBalance(await getBalance())
    }
    async function updateCanWater() {
        const _canWater = await canWaterPlant()
        setCanWater(_canWater)
        if (!_canWater) {
            const cooldown = await getCurrentCooldown()
            setCooldown(cooldown)
            console.log(cooldown)
        }
    }
    async function buyCurrency() {
        await buyLeaves()
        setBalance(await getBalance())
        const _hBalance = await getHbarBalance()
        setHBalance(_hBalance)
    }

    async function transfer(destination, amount) {
        await transferLeaves(destination, amount)
        setBalance(await getBalance())
    }
    
    return (
        <div>  
            <div className="balance">
                <Stack direction='row'>
                <h2>balance: {balance}</h2>
                <EnergySavingsLeafIcon />
                </Stack>
                <h2>balance: {hBalance} H</h2>
                <Button variant="outlined" color="primary" onClick={buyCurrency}>buy</Button>
                
            </div>
            
            

            <Example plant={plant} plantExists={plantExists} cooldown={cooldown} water={water} feed={feed} canWater={canWater} create={createPlant} transfer={transfer} />
        </div>
    )

}

render(<App />, document.getElementById("root"));
