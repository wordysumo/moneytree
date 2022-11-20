import * as React from "react";
import { useEffect, useState } from 'react';
import { useRef } from "react";
import { motion } from "framer-motion";
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';
import Fab from '@mui/material/Fab';
import SendIcon from '@mui/icons-material/Send';
import Tooltip from '@mui/material/Tooltip';
import TimerIcon from '@mui/icons-material/Timer';
import ForestIcon from '@mui/icons-material/Forest';
import ReactRain from 'react-rain-animation';
import LoadingButton from '@mui/lab/LoadingButton';
import Snackbar from '@mui/material/Snackbar';


// import all the styles
import "react-rain-animation/lib/style.css";


export const Example = (props) => {
  const constraintsRef = useRef(null);
  const [catchOff, setCatchOff] = useState(true)
  const [cooldownTimer, setCooldownTimer] = useState(0)
  const [species, setSpecies] = useState("oak") 
  const [rain, setRain] = useState(false)
  const [feedLoading, setFeedLoading] = useState(false)
  const [transferSuccess, setTransferSuccess] = useState(false)
// currently, it is using base case for tree type! easy to show off trees...
  const types = ["oak", "birch", "cherry"];
  
  const buttonProps ={
    margin: '5px',
    width: "200px"
  }

  useEffect(() => {
    if (props.cooldown !== 0) {
      console.log(props.cooldown)
      let id = props.plant.id      
      id % 2 !== 0 && setSpecies(types[0])  
      id % 2 === 0 && setSpecies(types[1])  
      id % 10 === 0 && setSpecies(types[2])
      setCooldownTimer(props.cooldown - (Date.now() / 1000))
      setInterval(() => {
        setCooldownTimer(props.cooldown - (Date.now() / 1000))
      },6000)
    }
  },[props.cooldown])


  async function transfer() {
    const address = prompt("account address")
    const amount = prompt("amount")
    await props.transfer(address, amount)
    setTransferSuccess(true)
  }

  function water() {
    setRain(true)
    props.water()
    setTimeout(() => {
      setRain(false)
    },5000)
  }
  async function feed() {
    setFeedLoading(true);
    await props.feed()
    setFeedLoading(false)
  }

  return (
    <div>
      
      <div className="econtainer">         
      <motion.div className="container" ref={constraintsRef}>
      {rain && <ReactRain
          numDrops="50"
        />  }              
        {!catchOff && <motion.div className="item" drag dragConstraints={constraintsRef} />}
        {(props.plant && props.plant.growthStage === 0) && <img className="tree" src={require('./images/' + species + '_seed.png')} alt="tree"></img>   }                   
        {(props.plant && props.plant.growthStage === 1) && <img className="tree" src={require('./images/' + species + '_sprout.png')} alt="tree"></img>   }                   
        {(props.plant && props.plant.growthStage === 2) && <img className="tree" src={require('./images/' + species + '_junior.png')} alt="tree"></img>   }                   
        {(props.plant && props.plant.growthStage === 3) && <img className="tree" src={require('./images/' + species + '_senior.png')} alt="tree"></img>   }                   
        {(props.plant && props.plant.growthStage === 4) && <img className="tree" src={require('./images/' + species + '_tree.png')} alt="tree"></img>   }                
      </motion.div>            
      <div className="container-bottom" >
        <div className="menu-right">
      <div className="buttons">    
      {props.plantExists && !props.canWater && <h1><TimerIcon />{Math.floor(cooldownTimer / 3600)} hours {Math.floor(cooldownTimer / 60) - Math.floor(cooldownTimer / 3600) * 60} minutes</h1> }   
      {(props.plantExists && catchOff) && <Button sx={buttonProps} variant="contained" disabled={!props.canWater} onClick={water}>Water</Button>  }              
        {(props.plantExists && catchOff) && <LoadingButton sx={buttonProps} variant="contained" disabled={props.balance === 0}  onClick={feed} loading={feedLoading}>Feed</LoadingButton>   }             
        {(props.plantExists && catchOff) && <Button sx={buttonProps} variant="contained" onClick={() => {setCatchOff(false)}} >Catch</Button>      }
        {(props.plantExists && catchOff) && <Button onClick={props.donate} sx={buttonProps} variant="contained" disabled={props.balance === 0} >Donate  <ForestIcon/> </Button> }  
        {(props.plantExists && !catchOff) && <Button sx={buttonProps} variant="contained" onClick={() => {setCatchOff(true)}} >Return</Button>      }
        {(!props.plantExists) && <Button variant="contained" onClick={props.create} >create plant</Button>}
      </div>
      </div>
      </div>
      </div>
      {props.plant && <div className="stage-progress">
        <h1></h1>
        <LinearProgress variant="determinate" value={(props.plant.feedAmount / ((props.plant.growthStage + 1) * 5)) * 100} />
      </div>}
      <div className="transfer-fab">
        <Tooltip title="transfer leaves">
      <Fab onClick={transfer} color="primary">
            <SendIcon />
      </Fab>
      </Tooltip>
      </div>
      <Snackbar
        open={transferSuccess}
        autoHideDuration={6000}
        onClose={() => {setTransferSuccess(false)}}
        message="Transaction successful"
      />
    </div>
  );
};
