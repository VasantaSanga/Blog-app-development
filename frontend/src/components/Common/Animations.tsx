/**
 * Reusable Animation Components & Variants
 * Using Framer Motion for smooth, performant animations
 */

import React, { ReactNode } from 'react';
import { motion, Variants, HTMLMotionProps } from 'framer-motion';
import { Box } from '@mui/material';

// ============ Animation Variants ============

// Fade animations
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' }
  },
  exit: { opacity: 0, transition: { duration: 0.3 } }
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

// Scale animations
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      type: 'spring',
      stiffness: 300,
      damping: 20
    }
  }
};

// Stagger container for children animations
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05
    }
  }
};

// Card hover animations
export const cardHover: Variants = {
  rest: { 
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  hover: { 
    scale: 1.02,
    y: -8,
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  tap: { 
    scale: 0.98,
    transition: { duration: 0.1 }
  }
};

// Button animations
export const buttonHover: Variants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: { duration: 0.2, ease: 'easeOut' }
  },
  tap: { scale: 0.95 }
};

// Page transitions
export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.4, 
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.1
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.3 }
  }
};

// Slide animations
export const slideInFromBottom: Variants = {
  hidden: { opacity: 0, y: 100 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: 'spring',
      stiffness: 100,
      damping: 20
    }
  }
};

// Shimmer/glow effect for highlighted elements
export const glowPulse: Variants = {
  initial: { boxShadow: '0 0 0 rgba(99, 102, 241, 0)' },
  animate: {
    boxShadow: [
      '0 0 0 rgba(99, 102, 241, 0)',
      '0 0 30px rgba(99, 102, 241, 0.4)',
      '0 0 0 rgba(99, 102, 241, 0)'
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

// ============ Animation Components ============

interface MotionBoxProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
}

// Fade In component
export const FadeIn: React.FC<MotionBoxProps & { delay?: number }> = ({ 
  children, 
  delay = 0,
  ...props 
}) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: { duration: 0.5, delay, ease: 'easeOut' }
      }
    }}
    {...props}
  >
    {children}
  </motion.div>
);

// Fade In Up component
export const FadeInUp: React.FC<MotionBoxProps & { delay?: number }> = ({ 
  children, 
  delay = 0,
  ...props 
}) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0, y: 30 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }
      }
    }}
    {...props}
  >
    {children}
  </motion.div>
);

// Scale In component
export const ScaleIn: React.FC<MotionBoxProps & { delay?: number }> = ({ 
  children, 
  delay = 0,
  ...props 
}) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0, scale: 0.9 },
      visible: { 
        opacity: 1, 
        scale: 1,
        transition: { duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }
      }
    }}
    {...props}
  >
    {children}
  </motion.div>
);

// Stagger children container
interface StaggerContainerProps {
  children: ReactNode;
  delay?: number;
  staggerDelay?: number;
  className?: string;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({ 
  children, 
  delay = 0,
  staggerDelay = 0.1,
  className
}) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay,
          delayChildren: delay
        }
      }
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// Stagger item for use inside StaggerContainer
export const StaggerItem: React.FC<MotionBoxProps> = ({ children, ...props }) => (
  <motion.div
    variants={fadeInUp}
    {...props}
  >
    {children}
  </motion.div>
);

// Animated card wrapper with hover effects
interface AnimatedCardProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  children, 
  onClick,
  className,
  style
}) => (
  <motion.div
    initial="rest"
    whileHover="hover"
    whileTap="tap"
    variants={cardHover}
    onClick={onClick}
    className={className}
    style={{ ...style, cursor: onClick ? 'pointer' : 'default' }}
  >
    {children}
  </motion.div>
);

// Scroll-triggered animation wrapper
interface ScrollRevealProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  className?: string;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({ 
  children, 
  direction = 'up',
  delay = 0,
  className
}) => {
  const variants: Record<string, Variants> = {
    up: fadeInUp,
    down: fadeInDown,
    left: fadeInLeft,
    right: fadeInRight
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={variants[direction]}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Page wrapper with transition
interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ children, className }) => (
  <motion.div
    initial="hidden"
    animate="visible"
    exit="exit"
    variants={pageTransition}
    className={className}
  >
    {children}
  </motion.div>
);

// Animated button wrapper
interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({ 
  children, 
  onClick,
  className,
  disabled
}) => (
  <motion.div
    initial="rest"
    whileHover={disabled ? undefined : "hover"}
    whileTap={disabled ? undefined : "tap"}
    variants={buttonHover}
    onClick={disabled ? undefined : onClick}
    className={className}
    style={{ display: 'inline-block' }}
  >
    {children}
  </motion.div>
);

// Floating animation for decorative elements
export const FloatingElement: React.FC<MotionBoxProps & { duration?: number }> = ({ 
  children,
  duration = 3,
  ...props
}) => (
  <motion.div
    animate={{
      y: [0, -10, 0],
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: 'easeInOut'
    }}
    {...props}
  >
    {children}
  </motion.div>
);

// Typewriter effect component
interface TypewriterProps {
  text: string;
  delay?: number;
  className?: string;
}

export const Typewriter: React.FC<TypewriterProps> = ({ 
  text, 
  delay = 0.05,
  className 
}) => {
  const words = text.split(' ');
  
  return (
    <motion.span className={className}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} style={{ display: 'inline-block', marginRight: '0.25em' }}>
          {word.split('').map((char, charIndex) => (
            <motion.span
              key={charIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.1,
                delay: (wordIndex * 5 + charIndex) * delay
              }}
              style={{ display: 'inline-block' }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.span>
  );
};

// Number counter animation
interface CountUpProps {
  end: number;
  duration?: number;
  className?: string;
}

export const CountUp: React.FC<CountUpProps> = ({ 
  end, 
  duration: _duration = 2,
  className 
}) => {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {end}
      </motion.span>
    </motion.span>
  );
};

// Create a MotionBox for MUI compatibility
export const MotionBox = motion(Box);

export default {
  FadeIn,
  FadeInUp,
  ScaleIn,
  StaggerContainer,
  StaggerItem,
  AnimatedCard,
  ScrollReveal,
  PageWrapper,
  AnimatedButton,
  FloatingElement,
  Typewriter,
  CountUp,
  MotionBox
};
