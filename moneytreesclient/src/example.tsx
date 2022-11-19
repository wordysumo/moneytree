import * as React from "react";
import { useRef } from "react";
import { motion } from "framer-motion";

export const Example = (props) => {
  const constraintsRef = useRef(null);

  return (
    <div>
      <div className="econtainer">
      <motion.div className="container" ref={constraintsRef}>
        <motion.div className="item" drag dragConstraints={constraintsRef} />
      </motion.div>
      <div className="container-bottom" >
      {(props.plantExists && props.plant) && (
                <div className="plantData">
                <h3>growth: {props.plant.growthStage}</h3>
                <h3>stage: {props.plant.feedAmount}</h3>
                <h3>watered: {props.plant.watered ? "true" : "false"}</h3>
                </div>
            )}
      <div className="buttons">        
        <button className="mainButton" disabled={!props.canWater} onClick={props.water}>Water</button>                
        <button className="mainButton" onClick={props.feed}>Feed</button>                
        <button className="mainButton">Catch</button>      
        <button className="mainButton">Donate</button>   
      </div>
      </div>
      </div>
      
    </div>
  );
};
