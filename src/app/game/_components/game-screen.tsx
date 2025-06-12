"use client"
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Dispatch, RefObject, SetStateAction } from "react";
import { Volume, Volume2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { KanaItem } from "@/types/kana-types";


interface GameScreenProps {
    setSoundOn: Dispatch<SetStateAction<boolean>>;
    soundOn: boolean;
    kanaQueue: KanaItem[];
    currentIndex: number;
    userInput: string;
    handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    inputRef: RefObject<HTMLInputElement | null>;
    isCorrect: boolean | null;
    showAnswer: boolean;
    revealedAnswer: string;
    score: number;
}

const GameScreen: React.FC<GameScreenProps> = ({
    setSoundOn,
    soundOn,
    kanaQueue,
    currentIndex,
    userInput,
    handleInput,
    handleKeyDown,
    inputRef,
    isCorrect,
    showAnswer,
    revealedAnswer,
    score,
}) => {
  return (
    <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white/20 backdrop-blur shadow-lg rounded-xl p-8 max-w-lg w-full text-center relative"
            >
                {/* SoundToggler on correct answer */}
                <Button
                    variant={"ghost"}
                    onClick={() => setSoundOn((s) => !s)}
                    aria-label={soundOn ? "Mute sound" : "Unmute sound"}
                    className="absolute top-4 right-4 text-white hover:text-secondary-foreground"
                >
                {soundOn ? <Volume2 size={24} /> : <Volume size={24} />}
                </Button>
                {/* Enter Button Tooltip */}
                <div className="absolute top-4 left-4">
                    <Tooltip>
                        <TooltipTrigger><span className="text-white border-1 px-1 border-white rounded-full text-[10px] cursor-pointer">?</span></TooltipTrigger>
                        <TooltipContent>
                            <p className="text-sm text-gray-300">
                                Press <kbd className="kbd">Enter</kbd> on the input to reveal the answer.<br />
                                Note: This will <strong>not</strong> count as a correct answer.
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </div>
                <h2 className="text-white text-xl font-semibold mb-4">Kana Typer</h2>
                {/* Kana Symbol */}
                <div className="text-6xl mb-4">{kanaQueue[currentIndex]?.kana}</div>
                {/* Input */}
                <input
                    ref={inputRef}
                    className={`px-4 py-2 rounded w-full text-center text-black outline-none border-2 transition ${
                    isCorrect === true ? "border-green-500" : isCorrect === false ? "border-red-500" : "border-transparent"
                    }`}
                    type="text"
                    placeholder="Type romaji..."
                    value={userInput}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                />
                {/* Show answer on Enter */}
                {showAnswer && (
                    <div className="mt-2 text-black font-semibold">
                        {revealedAnswer}
                    </div>
                )}
                {/* Statistics */}
                <div className="flex justify-between mt-4 text-white font-semibold">
                    <div>
                    Shown: {currentIndex + 1} / {kanaQueue.length}
                    </div>
                    <div className="text-secondary-foreground">Correct: {score}</div>
                </div>
        </motion.div>
  )
}

export default GameScreen