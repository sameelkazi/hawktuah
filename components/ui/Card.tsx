import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  noPadding?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', delay = 0, noPadding = false }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <motion.div
      ref={divRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative group rounded-2xl ${className}`}
    >
      {/* Spotlight Border Glow */}
      <div 
        className="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-0 blur-sm"
        style={{
            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(59, 130, 246, 0.5), transparent 40%)`
        }}
      />
      
      {/* Sharp Border Glow */}
      <div 
        className="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-0"
        style={{
            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(59, 130, 246, 0.4), transparent 40%)`
        }}
      />

      {/* Card Content Container */}
      <div className={`relative h-full bg-white/80 dark:bg-[#0F172A]/90 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-2xl transition-all duration-300 shadow-lg shadow-slate-200/50 dark:shadow-none overflow-hidden z-10 ${noPadding ? '' : 'p-6'}`}>
        
        {/* Inner Spotlight Glow */}
        <div 
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
                background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(59, 130, 246, 0.08), transparent 40%)`
            }}
        />
        
        {children}
      </div>
    </motion.div>
  );
};

export default Card;