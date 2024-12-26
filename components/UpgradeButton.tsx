"use client";



import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function UpgradeButton() {
  return (
    <Link href={"/billing"}>
    <motion.button
      className="relative group bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm px-4 py-2 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative flex items-center gap-1.5">
        <Sparkles className="w-4 h-4" />
        <span>Upgrade</span>
      </div>
      
      <div className="absolute -inset-[1px] bg-purple-400/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.button>
    </Link>
  );
}