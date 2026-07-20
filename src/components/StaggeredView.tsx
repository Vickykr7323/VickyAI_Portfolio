import React from "react";
import { motion } from "motion/react";

// Professional spring physical-based transitions
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.15,
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 14,
    },
  },
};

interface StaggerContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  as?: any;
  style?: React.CSSProperties;
  noStaggerChildren?: boolean;
  onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export function StaggerContainer({ children, className = "", as = "div", noStaggerChildren = false, ...props }: StaggerContainerProps) {
  const Component = motion[as] || (motion.div as any);
  const arrayChildren = React.Children.toArray(children);

  const isDepthCard = className.includes("depth-card-3d");

  // Highly responsive physical spring values for snapping cards into 3D space
  const card3DVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.95,
      rotateX: -10,
      rotateY: 5,
      z: -30,
      transformPerspective: 1000
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      z: 0,
      transformPerspective: 1000,
      transition: {
        type: "spring",
        stiffness: 150, // snappy & responsive
        damping: 15,
        mass: 0.9,
        staggerChildren: 0.06,
        delayChildren: 0.03,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      rotateX: 5,
      z: -15,
      transition: {
        duration: 0.12,
      },
    },
  };

  const activeVariants = isDepthCard ? card3DVariants : containerVariants;

  return (
    <Component
      variants={activeVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={className}
      {...props}
    >
      {noStaggerChildren ? children : arrayChildren.map((child, index) => {
        if (React.isValidElement(child)) {
          // If the child is already a motion component or has animate properties,
          // let it inherit, otherwise wrap it inside our custom staggered StaggerItem
          if ((child.type as any).name?.startsWith("motion")) {
            return child;
          }
          return (
            <motion.div key={index} variants={itemVariants} className="w-full">
              {child}
            </motion.div>
          );
        }
        return child;
      })}
    </Component>
  );
}

export function StaggerItem({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}
