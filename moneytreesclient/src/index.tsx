import * as React from "react";
import { render } from "react-dom";
import { Example } from "./example";
import "./styles.css";
import {getPlantData, waterPlant, createNewPlant, hasPlant, getBalance, canWaterPlant, feedPlant, getCurrentCooldown, resetPlant, transferLeaves, getMyAddress, getHbarBalance, buyLeaves, donateLeaves} from "./contract/contract.js";
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';
import { Stack } from "@mui/system";
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import LoadingButton from '@mui/lab/LoadingButton';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';



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
    const [buyLoading, setBuyLoading] = React.useState(false)
    const [thanks, setThanks] = React.useState(false)
    const [loading, setLoading] = React.useState(true)
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
            setLoading(false)
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
        setBuyLoading(true)
        await buyLeaves()
        setBalance(await getBalance())
        const _hBalance = await getHbarBalance()
        setHBalance(_hBalance)
        setBuyLoading(false)
    }

    async function transfer(destination, amount) {
        await transferLeaves(destination, amount)
        setBalance(await getBalance())
    }
    async function donate() {
        await donateLeaves()
        setBalance(await getBalance())
        setThanks(true)
    }
    return (
        <div> 
            <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop> 
            <div className="balance">
                <h1>Wallet</h1>
                <Stack direction='row'>
                <h2>{balance} <EnergySavingsLeafIcon /></h2>                
                </Stack>
                <h2>{Math.floor(hBalance)} H</h2>
                <LoadingButton variant="outlined" color="primary" onClick={buyCurrency} loading={buyLoading}>buy <EnergySavingsLeafIcon /></LoadingButton>
                
            </div>
            
            

            <Example plant={plant} plantExists={plantExists} cooldown={cooldown} water={water} feed={feed} canWater={canWater} create={createPlant} transfer={transfer} donate={donate} balance={balance} />
            <Snackbar
        open={thanks}
        autoHideDuration={6000}
        onClose={() => {
            setThanks(false)
        }}
        message="Thank you for your donation"
      />
        </div>
    )

}

render(<App />, document.getElementById("root"));
