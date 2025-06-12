"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4 relative"  
    style={{ backgroundImage: "url(/images/bg.jpg)" }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-6 max-w-xl px-4"
      >
        <h1 className="text-4xl sm:text-5xl font-bold text-white">Welcome to Kana Typer</h1>
        <p className="text-lg text-white/90">
          Master Hiragana and Katakana through an interactive typing game. Improve recognition, accuracy, and speed in a fun way!
        </p>
        <Link href="/game">
          <Button >
            Start Practicing
          </Button>
        </Link>
      </motion.div>
    </main>
  );
}