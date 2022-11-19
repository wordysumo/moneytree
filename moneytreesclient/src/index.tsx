import * as React from "react";
import { render } from "react-dom";
import { Example } from "./example";
import "./styles.css";
import {getPlantData, waterPlant, createNewPlant, hasPlant, getBalance, canWaterPlant, feedPlant} from "./contract/contract.js";

interface Plant {
    watered: boolean,
    feedAmount: number,
    growthStage: number
}

const App = () => {
    const [plant, setPlant] = React.useState<Plant | undefined>(undefined)
    const [plantExists, setPlantExists] = React.useState(false)
    const [balance, setBalance] = React.useState(0)
    const [canWater, setCanWater] = React.useState(false)
    React.useEffect(() => {
        async function load() {
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
        const _canWater = await canWaterPlant()
        setCanWater(_canWater)
    }
    async function createPlant() {
        await createNewPlant()
        setPlantExists(true)
        await fetchPlantData()
    }
    async function water() {
        await waterPlant()
        await fetchPlantData()
        setBalance(await getBalance())
    }
    async function feed() {
        await feedPlant()
        await fetchPlantData()
        setBalance(await getBalance())
    }
    
    return (
        <div>  
            <div className="balance">
                {balance} Leaves
            </div>
            
            {(plantExists && plant) && (
                <div className="plantData">
                <label>growth: {plant.growthStage}</label>
                <label>stage: {plant.feedAmount}</label>
                <label>watered: {plant.watered ? "true" : "false"}</label>
                </div>
            )}
            {!plantExists && <button onClick={createPlant}>create plant</button>}
            {plantExists && <button onClick={water} disabled={!canWater}>water</button>}
            {plantExists && <button onClick={feed} >feed</button>}

            <Example />
        </div>
    )

}

render(<App />, document.getElementById("root"));
