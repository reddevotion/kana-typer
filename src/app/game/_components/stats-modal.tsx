"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { motion,  } from "motion/react";

type GameStat = {
  timestamp: number;
  score: number;
  total: number;
  time: number;
  kanaType: "hiragana" | "katakana";
  selectedRows: string[];
};

interface StatsModalProps {
  stats: GameStat[];
  visible: boolean;
  onClose: () => void;
}

const StatsModal: React.FC<StatsModalProps> = ({ stats, visible, onClose }) => {
  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="stats-modal-title"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-secondary backdrop-blur rounded-lg p-6 max-w-lg w-full max-h-[70vh] overflow-y-auto text-muted-foreground shadow-lg"
      >
        <h3
          id="stats-modal-title"
          className="font-bold text-2xl mb-4 border-b border-primary/30 pb-2 text-secondary-foreground"
        >
          Previous Sessions
        </h3>
        {stats.length === 0 ? (
          <p className="text-center text-black/70">No previous sessions found.</p>
        ) : (
          <ul className="space-y-3">
            {stats.reverse().map((s, i) => (
              <li
                key={i}
                className="border border-primary/20 rounded-lg p-3 bg-primary/10"
              >
                <div className="flex justify-between text-sm text-muted-foreground mb-1">
                  <time dateTime={new Date(s.timestamp).toISOString()}>
                    {new Date(s.timestamp).toLocaleString()}
                  </time>
                  <span className="uppercase font-mono">{s.kanaType}</span>
                </div>
                <div className="text-sm space-y-1">
                  <div>
                    <strong>Score:</strong> {s.score} / {s.total}
                  </div>
                  <div>
                    <strong>Time:</strong> {s.time} seconds
                  </div>
                  <div>
                    <strong>Rows:</strong> {s.selectedRows.join(", ")}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 flex justify-end">
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default StatsModal;