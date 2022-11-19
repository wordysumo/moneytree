import * as React from "react";
import { useRef } from "react";
import { motion } from "framer-motion";

export const Example = (props) => {
  const constraintsRef = useRef(null);
  const [catchOff, setCatchOff] = React.useState(true)

  return (
    <div>
      <div className="econtainer">
      <motion.div className="container" ref={constraintsRef}>
        {!catchOff && <motion.div className="item" drag dragConstraints={constraintsRef} />}
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
      {catchOff && <button className="mainButton" disabled={!props.canWater} onClick={props.water}>Water</button>                }
      {catchOff && <button className="mainButton" onClick={props.feed}>Feed</button>                }
      {catchOff && <button onClick={() => {setCatchOff(false)}} className="mainButton">Catch</button>      }
      {catchOff && <button className="mainButton">Donate</button>   }
      </div>
      </div>
      </div>
      
    </div>
  );
};
