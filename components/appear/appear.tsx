'use client';

import { motion } from "framer-motion"

const AppearComponent = ({ children, delay }: { children: React.ReactNode, delay?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.1, type: "spring", stiffness: 50, delay }}
      viewport={{ once: true }}
    >
    {children}
  </motion.div>
)
  ;
};

export default AppearComponent;
