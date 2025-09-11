import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = true,
  glass = true,
  padding = 'md',
  onClick
}) => {
  const baseClasses = glass ? 'glass-card' : 'bg-bg-secondary border border-white/10 rounded-xl shadow-lg';
  
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const hoverProps = hover ? {
    whileHover: { y: -2, scale: 1.01 },
    transition: { duration: 0.2 }
  } : {};

  const Component = onClick ? motion.div : motion.div;

  return (
    <Component
      className={`${baseClasses} ${paddingClasses[padding]} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      {...hoverProps}
    >
      {children}
    </Component>
  );
};

export default Card;
