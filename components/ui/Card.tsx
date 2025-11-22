import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const Card: React.FC<CardProps> = ({ children, className = '', delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={`bg-glass-100 backdrop-blur-xl border border-glass-border rounded-2xl p-6 hover:bg-glass-200 transition-colors duration-300 shadow-xl ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Card;
