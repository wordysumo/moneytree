import * as React from "react";
import { useEffect, useState } from 'react';
import { useRef } from "react";
import { motion } from "framer-motion";
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import LinearProgress from '@mui/material/LinearProgress';
import Fab from '@mui/material/Fab';
import SendIcon from '@mui/icons-material/Send';
import Tooltip from '@mui/material/Tooltip';
import TimerIcon from '@mui/icons-material/Timer';



export const Example = (props) => {
  const constraintsRef = useRef(null);
  const [catchOff, setCatchOff] = useState(true)
  const [cooldownTimer, setCooldownTimer] = useState(0)
  const buttonProps ={
    margin: '5px',
    width: "200px"
  }
  useEffect(() => {
    if (props.cooldown !== 0) {
      console.log(props.cooldown)
      setInterval(() => {
        setCooldownTimer(props.cooldown - (Date.now() / 1000))
      },6000)
    }
  },[props.cooldown])

  async function transfer() {
    const address = prompt("account address")
    const amount = prompt("amount")
    await props.transfer(address, amount)
  }

  return (
    <div>
      <div className="econtainer">
      <motion.div className="container" ref={constraintsRef}>
        {!catchOff && <motion.div className="item" drag dragConstraints={constraintsRef} />}
      </motion.div>
      <div className="container-bottom" >
        <div className="menu-right">
      <div className="buttons">    
      <h1><TimerIcon />{Math.floor(cooldownTimer / 3600)} hours {Math.floor(cooldownTimer / 60) - Math.floor(cooldownTimer / 3600) * 60} minutes</h1>    
      {(props.plantExists && catchOff) && <Button sx={buttonProps} variant="contained" disabled={!props.canWater} onClick={props.water}>Water</Button>  }              
        {(props.plantExists && catchOff) && <Button sx={buttonProps} variant="contained"  onClick={props.feed}>Feed</Button>   }             
        {(props.plantExists && catchOff) && <Button sx={buttonProps} variant="contained" onClick={() => {setCatchOff(false)}} >Catch</Button>      }
        {(props.plantExists && catchOff) && <Button sx={buttonProps} variant="contained" >Donate</Button> }  
        {(!props.plantExists) && <Button variant="contained" onClick={props.create} >create plant</Button>}
      </div>
      </div>
      </div>
      </div>
      {props.plant && <div className="stage-progress">
        <h1>Progress to next stage</h1>
        <LinearProgress variant="determinate" value={(props.plant.feedAmount / ((props.plant.growthStage + 1) * 5)) * 100} />
      </div>}
      <div className="transfer-fab">
        <Tooltip title="transfer leaves">
      <Fab onClick={transfer} color="primary">
            <SendIcon />
      </Fab>
      </Tooltip>
      </div>
    </div>
  );
};
