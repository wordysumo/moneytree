import * as React from "react";
import { useRef } from "react";
import { motion } from "framer-motion";

export const Example = () => {
  const constraintsRef = useRef(null);

  return (
    <div>
      <div className="econtainer">
      <motion.div className="container" ref={constraintsRef}>
        <motion.div className="item" drag dragConstraints={constraintsRef} />
      </motion.div>
      </div>
      
      <div className="buttons">        
        <button className="water">Water</button>                
        <button className="feed">Feed</button>                
        <button className="catch">Catch</button>      
        <button className="donate">Donate</button>   
      </div>
    </div>
  );
};
