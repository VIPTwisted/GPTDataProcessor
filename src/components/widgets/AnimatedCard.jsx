
import React from 'react';
import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  hover: { scale: 1.02, boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.15)" },
};

const AnimatedCard = ({ children, className = '', title, onClick, subTitle }) => {
  return (
    <motion.div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col justify-between transition-all duration-300 ease-in-out ${className}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      viewport={{ once: true, amount: 0.8 }}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div>
        {title && (
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {title}
          </h3>
        )}
        {subTitle && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{subTitle}</p>
        )}
        {children}
      </div>
    </motion.div>
  );
};

export default AnimatedCard;
