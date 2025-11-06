'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface LogoProps {
  className?: string;
}

export default function Logo({ className = '' }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center space-x-2 ${className}`}>
      <motion.div
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <img src="/logo.svg" alt="ChefGPT Logo" className="w-8 h-8" />
      </motion.div>
      <span className="text-xl font-bold text-primary">ChefGPT</span>
    </Link>
  );
}

