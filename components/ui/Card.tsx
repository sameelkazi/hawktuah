import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  noPadding?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', delay = 0, noPadding = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={`relative group rounded-2xl ${className}`}
    >
      {/* Glowing Border Effect */}
      <div className="absolute -inset-[1px] bg-gradient-to-r from-blue-500/30 via-cyan-500/30 to-blue-500/30 dark:from-blue-600/50 dark:via-cyan-600/50 dark:to-blue-600/50 rounded-2xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500 group-hover:animate-pulse-slow" />
      
      <div className={`relative h-full bg-white/70 dark:bg-[#0F172A]/80 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-2xl transition-all duration-300 shadow-lg shadow-slate-200/50 dark:shadow-none group-hover:border-blue-300/50 dark:group-hover:border-white/20 overflow-hidden ${noPadding ? '' : 'p-6'}`}>
        {children}
      </div>
    </motion.div>
  );
};

export default Card;