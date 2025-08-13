import { motion } from 'framer-motion';

const pageVariants = {
  initial: { y: 20 },
  in: { y: 0 },
  out: { y: -20 },
};

const pageTransition = {
  duration: 0.3,
  ease: 'easeInOut',
};

export default function PageTransitionWrapper({ children }) {
  return (
    <div>
      {children}
    </div>
  );
}
