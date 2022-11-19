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
            
            

            <Example plant={plant} plantExists={plantExists} water={water} feed={feed} canWater={canWater} />
        </div>
    )

}

render(<App />, document.getElementById("root"));
