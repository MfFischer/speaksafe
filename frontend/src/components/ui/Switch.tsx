import React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Switch: React.FC<SwitchProps> = ({
  checked,
  onCheckedChange,
  label,
  description,
  disabled = false,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: { root: 'w-8 h-4', thumb: 'w-3 h-3 data-[state=checked]:translate-x-4' },
    md: { root: 'w-11 h-6', thumb: 'w-5 h-5 data-[state=checked]:translate-x-5' },
    lg: { root: 'w-14 h-8', thumb: 'w-7 h-7 data-[state=checked]:translate-x-6' }
  };

  return (
    <div className="flex items-center justify-between">
      {(label || description) && (
        <div className="flex-1">
          {label && (
            <div className="text-white font-medium">{label}</div>
          )}
          {description && (
            <div className="text-text-secondary text-sm">{description}</div>
          )}
        </div>
      )}
      
      <SwitchPrimitive.Root
        className={`${sizeClasses[size].root} bg-white/20 rounded-full relative data-[state=checked]:bg-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300`}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      >
        <SwitchPrimitive.Thumb
          className={`${sizeClasses[size].thumb} bg-white rounded-full transition-transform duration-300 translate-x-0.5 will-change-transform`}
        />
      </SwitchPrimitive.Root>
    </div>
  );
};

export default Switch;
