import * as React from "react";
import { useRef } from "react";
import { motion } from "framer-motion";

export const Example = () => {
  const constraintsRef = useRef(null);

  return (
    <motion.div className="container" ref={constraintsRef}>
      <motion.div className="item" drag dragConstraints={constraintsRef} />
    </motion.div>
  );
};
